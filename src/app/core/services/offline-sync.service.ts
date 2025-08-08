/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {Injectable, Injector} from "@angular/core";
import {Observable, BehaviorSubject, from, of, throwError} from "rxjs";
import {
  switchMap,
  catchError,
  retry,
  delay,
  tap,
  filter,
  take,
} from "rxjs/operators";
import {NetworkConnectionService} from "./network-connection.service";
import {
  SendMessageRequest,
  Message,
  MessageStatus,
} from "../../modules/messaging/models/chat.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat/app";

export interface QueuedMessage {
  id: string;
  request: SendMessageRequest;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
  status: "pending" | "sending" | "sent" | "failed";
  error?: string;
}

export interface OfflineSyncStatus {
  isOnline: boolean;
  queuedMessagesCount: number;
  lastSyncTime: Date | null;
  isSyncing: boolean;
  failedMessagesCount: number;
}

@Injectable({
  providedIn: "root",
})
export class OfflineSyncService {
  private messageQueue: QueuedMessage[] = [];
  private syncStatus$ = new BehaviorSubject<OfflineSyncStatus>({
    isOnline: true,
    queuedMessagesCount: 0,
    lastSyncTime: null,
    isSyncing: false,
    failedMessagesCount: 0,
  });

  private readonly STORAGE_KEY = "offline_message_queue";
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 2000;
  private readonly MAX_QUEUE_SIZE = 100;

  private currentUserId: string | null = null;

  constructor(
    private networkService: NetworkConnectionService,
    private injector: Injector,
  ) {
    this.initializeOfflineSync();
  }

  /**
   * Initialize offline synchronization
   */
  private initializeOfflineSync(): void {
    // Load queued messages from storage
    this.loadQueueFromStorage();

    // Listen to network changes
    this.networkService.getConnectionStatus().subscribe((status) => {
      this.updateSyncStatus({isOnline: status.isOnline});

      if (status.isOnline) {
        // When coming back online, process queued messages
        this.processPendingMessages();
      }
    });

    // Periodic sync attempt when online
    this.startPeriodicSync();
  }

  /**
   * Set current user ID
   */
  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
  }

  /**
   * Get sync status observable
   */
  getSyncStatus(): Observable<OfflineSyncStatus> {
    return this.syncStatus$.asObservable();
  }

  /**
   * Queue message for offline sending
   */
  queueMessage(request: SendMessageRequest): string {
    console.log("📝 Queuing message for offline sending:", {
      chatId: request.chatId,
      text:
        request.text?.substring(0, 50) +
        (request.text && request.text.length > 50 ? "..." : ""),
      isEncrypted: request.isEncrypted,
      currentUserId: this.currentUserId,
    });

    const queuedMessage: QueuedMessage = {
      id: this.generateMessageId(),
      request,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.MAX_RETRIES,
      status: "pending",
    };

    // Check queue size limit
    if (this.messageQueue.length >= this.MAX_QUEUE_SIZE) {
      console.warn("⚠️ Message queue full, removing oldest failed messages");
      // Remove oldest failed messages to make room
      this.messageQueue = this.messageQueue
        .filter((msg) => msg.status !== "failed")
        .slice(-(this.MAX_QUEUE_SIZE - 1));
    }

    this.messageQueue.push(queuedMessage);
    this.saveQueueToStorage();
    this.updateQueueCounts();

    console.log(
      "📋 Message queued:",
      queuedMessage.id,
      "Queue size:",
      this.messageQueue.length,
    );

    // If online, try to send immediately
    if (this.networkService.isCurrentlyOnline()) {
      console.log("🌐 Currently online, attempting immediate send");
      this.sendQueuedMessage(queuedMessage);
    } else {
      console.log(
        "📴 Currently offline, message will be sent when connection is restored",
      );
    }

    return queuedMessage.id;
  }

  /**
   * Remove message from queue
   */
  removeFromQueue(messageId: string): void {
    const index = this.messageQueue.findIndex((msg) => msg.id === messageId);
    if (index !== -1) {
      this.messageQueue.splice(index, 1);
      this.saveQueueToStorage();
      this.updateQueueCounts();
    }
  }

  /**
   * Get queued messages
   */
  getQueuedMessages(): QueuedMessage[] {
    return [...this.messageQueue];
  }

  /**
   * Get pending messages count
   */
  getPendingCount(): number {
    return this.messageQueue.filter(
      (msg) => msg.status === "pending" || msg.status === "sending",
    ).length;
  }

  /**
   * Get failed messages count
   */
  getFailedCount(): number {
    return this.messageQueue.filter((msg) => msg.status === "failed").length;
  }

  /**
   * Retry failed messages
   */
  retryFailedMessages(): void {
    const failedMessages = this.messageQueue.filter(
      (msg) => msg.status === "failed",
    );

    failedMessages.forEach((message) => {
      message.status = "pending";
      message.retryCount = 0;
      message.error = undefined;
    });

    this.saveQueueToStorage();
    this.updateQueueCounts();

    if (this.networkService.isCurrentlyOnline()) {
      this.processPendingMessages();
    }
  }

  /**
   * Clear all failed messages
   */
  clearFailedMessages(): void {
    this.messageQueue = this.messageQueue.filter(
      (msg) => msg.status !== "failed",
    );
    this.saveQueueToStorage();
    this.updateQueueCounts();
  }

  /**
   * Clear entire queue
   */
  clearQueue(): void {
    this.messageQueue = [];
    this.saveQueueToStorage();
    this.updateQueueCounts();
  }

  /**
   * Process pending messages when coming online
   */
  private processPendingMessages(): void {
    if (this.syncStatus$.value.isSyncing) {
      return; // Already syncing
    }

    const pendingMessages = this.messageQueue.filter(
      (msg) => msg.status === "pending",
    );

    if (pendingMessages.length === 0) {
      return;
    }

    this.updateSyncStatus({isSyncing: true});

    // Process messages sequentially to avoid overwhelming the server
    this.processMessagesSequentially(pendingMessages).finally(() => {
      this.updateSyncStatus({
        isSyncing: false,
        lastSyncTime: new Date(),
      });
    });
  }

  /**
   * Process messages sequentially
   */
  private async processMessagesSequentially(
    messages: QueuedMessage[],
  ): Promise<void> {
    for (const message of messages) {
      if (message.status === "pending") {
        await this.sendQueuedMessage(message);
        // Small delay between messages
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  /**
   * Send a queued message
   */
  private async sendQueuedMessage(queuedMessage: QueuedMessage): Promise<void> {
    if (!this.networkService.isCurrentlyOnline()) {
      console.log("📴 Network offline, skipping message send");
      return;
    }

    console.log("📤 Attempting to send queued message:", queuedMessage.id);
    queuedMessage.status = "sending";
    this.updateQueueCounts();

    try {
      // Get AngularFirestore from injector
      const firestore = this.injector.get(AngularFirestore);
      const currentUserId = this.currentUserId;

      if (!currentUserId) {
        throw new Error("User ID not available for queued message");
      }

      if (!queuedMessage.request.chatId) {
        throw new Error("Chat ID not available for queued message");
      }

      console.log(
        "🔄 Sending message to chat:",
        queuedMessage.request.chatId,
        "from user:",
        currentUserId,
      );

      // Create message data using firebase timestamp
      const messageData = {
        senderId: currentUserId,
        text: queuedMessage.request.text || "",
        type: queuedMessage.request.type || "TEXT",
        status: "SENT",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        // Include other fields from request
        ...(queuedMessage.request.fileUrl && {
          fileUrl: queuedMessage.request.fileUrl,
        }),
        ...(queuedMessage.request.fileName && {
          fileName: queuedMessage.request.fileName,
        }),
        ...(queuedMessage.request.fileSize && {
          fileSize: queuedMessage.request.fileSize,
        }),
        ...(queuedMessage.request.fileType && {
          fileType: queuedMessage.request.fileType,
        }),
        ...(queuedMessage.request.isEncrypted && {
          isEncrypted: queuedMessage.request.isEncrypted,
        }),
        ...(queuedMessage.request.encryptionData && {
          encryptionData: queuedMessage.request.encryptionData,
        }),
        ...(queuedMessage.request.encryptedKeys && {
          encryptedKeys: queuedMessage.request.encryptedKeys,
        }),
      };

      // Send to Firestore using AngularFirestore
      const messagesRef = firestore.collection(
        `chats/${queuedMessage.request.chatId}/messages`,
      );
      const docRef = await messagesRef.add(messageData);

      console.log("✅ Message added to Firestore:", docRef.id);

      // Update chat metadata
      const lastMessageText = queuedMessage.request.isEncrypted
        ? "🔒 Encrypted message"
        : queuedMessage.request.text || "File attachment";

      const chatUpdateData = {
        lastMessage: lastMessageText,
        lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        lastModifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await firestore
        .collection("chats")
        .doc(queuedMessage.request.chatId)
        .update(chatUpdateData);

      console.log("✅ Chat metadata updated successfully");
      console.log("✅ Queued message sent successfully:", docRef.id);

      // Mark as sent and remove from queue
      queuedMessage.status = "sent";
      setTimeout(() => {
        this.removeFromQueue(queuedMessage.id);
      }, 1000); // Keep briefly to show success
    } catch (error) {
      console.error("❌ Error sending queued message:", error);
      console.error("📋 Message details:", {
        messageId: queuedMessage.id,
        chatId: queuedMessage.request.chatId,
        userId: this.currentUserId,
        retryCount: queuedMessage.retryCount,
        error: error,
      });

      queuedMessage.retryCount++;

      if (queuedMessage.retryCount >= queuedMessage.maxRetries) {
        queuedMessage.status = "failed";
        queuedMessage.error = this.getErrorMessage(error);
        console.warn(
          `❌ Message failed after ${queuedMessage.maxRetries} retries:`,
          queuedMessage.error,
        );
      } else {
        queuedMessage.status = "pending";
        const retryDelay =
          this.RETRY_DELAY_MS * Math.pow(2, queuedMessage.retryCount - 1);
        console.log(
          `🔄 Retrying message in ${retryDelay}ms (${queuedMessage.retryCount}/${queuedMessage.maxRetries})...`,
        );

        // Retry with exponential backoff
        setTimeout(() => {
          this.sendQueuedMessage(queuedMessage);
        }, retryDelay);
      }
    }

    this.saveQueueToStorage();
    this.updateQueueCounts();
  }

  /**
   * Start periodic sync attempts
   */
  private startPeriodicSync(): void {
    // Check for pending messages every 30 seconds when online
    setInterval(() => {
      if (
        this.networkService.isCurrentlyOnline() &&
        this.getPendingCount() > 0
      ) {
        this.processPendingMessages();
      }
    }, 30000);
  }

  /**
   * Load queue from local storage
   */
  private loadQueueFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.messageQueue = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));

        // Reset sending status to pending on app restart
        this.messageQueue.forEach((msg) => {
          if (msg.status === "sending") {
            msg.status = "pending";
          }
        });

        this.updateQueueCounts();
      }
    } catch (error) {
      console.error("Error loading message queue from storage:", error);
      this.messageQueue = [];
    }
  }

  /**
   * Save queue to local storage
   */
  private saveQueueToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messageQueue));
    } catch (error) {
      console.error("Error saving message queue to storage:", error);
    }
  }

  /**
   * Update queue counts in sync status
   */
  private updateQueueCounts(): void {
    this.updateSyncStatus({
      queuedMessagesCount: this.getPendingCount(),
      failedMessagesCount: this.getFailedCount(),
    });
  }

  /**
   * Update sync status
   */
  private updateSyncStatus(update: Partial<OfflineSyncStatus>): void {
    const current = this.syncStatus$.value;
    this.syncStatus$.next({...current, ...update});
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `offline_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "Unknown error occurred";
  }

  /**
   * Get sync statistics for debugging
   */
  getSyncStats(): {
    totalQueued: number;
    pending: number;
    sending: number;
    sent: number;
    failed: number;
    oldestMessage: Date | null;
    queueSize: string;
  } {
    const pending = this.messageQueue.filter(
      (m) => m.status === "pending",
    ).length;
    const sending = this.messageQueue.filter(
      (m) => m.status === "sending",
    ).length;
    const sent = this.messageQueue.filter((m) => m.status === "sent").length;
    const failed = this.messageQueue.filter(
      (m) => m.status === "failed",
    ).length;

    const oldest =
      this.messageQueue.length > 0
        ? new Date(
            Math.min(...this.messageQueue.map((m) => m.timestamp.getTime())),
          )
        : null;

    const queueSizeBytes = JSON.stringify(this.messageQueue).length;
    const queueSizeKB = Math.round((queueSizeBytes / 1024) * 100) / 100;

    return {
      totalQueued: this.messageQueue.length,
      pending,
      sending,
      sent,
      failed,
      oldestMessage: oldest,
      queueSize: `${queueSizeKB} KB`,
    };
  }
}
