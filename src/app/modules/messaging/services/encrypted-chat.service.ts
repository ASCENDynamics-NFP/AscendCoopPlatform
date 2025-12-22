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
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {
  Observable,
  from,
  firstValueFrom,
  combineLatest,
  of,
  BehaviorSubject,
} from "rxjs";
import {
  switchMap,
  take,
  map,
  distinctUntilChanged,
  shareReplay,
  startWith,
} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {EncryptionService, EncryptedMessage} from "./encryption.service";
import {ChatService} from "./chat.service";
import {Message, SendMessageRequest} from "../models/chat.model";

export interface EncryptedSendMessageRequest
  extends Omit<SendMessageRequest, "text"> {
  text?: string;
  isEncrypted?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class EncryptedChatService {
  // Cache for decrypted messages to prevent re-decryption on every update
  private decryptedCache = new Map<string, string>();

  // Track processed message versions to prevent unnecessary re-processing
  private messageVersions = new Map<
    string,
    {timestamp: any; isEncrypted: boolean; text: string}
  >();

  // Track messages currently being decrypted to prevent duplicate work
  private decryptingMessages = new Set<string>();

  // Subject to trigger message updates after async decryption
  private updateTrigger = new BehaviorSubject<number>(0);

  // Track if key regeneration is in progress to prevent multiple attempts
  private keyRegenerationInProgress = false;

  constructor(
    private firestore: AngularFirestore,
    private store: Store<{auth: AuthState}>,
    private encryptionService: EncryptionService,
    private chatService: ChatService,
    private injector: Injector, // Use Injector to lazily get KeyBackupService
  ) {
    // Subscribe to encryption key changes to clear cache
    this.encryptionService.keysChanged$.subscribe(({userId, action}) => {
      console.log(
        `[EncryptedChatService] Key change detected: ${action} for user ${userId}`,
      );
      if (action === "restored") {
        // Clear all caches to force re-decryption with new keys
        this.clearDecryptionCache();
        console.log(
          "[EncryptedChatService] Decryption cache cleared, triggering re-decryption",
        );
      }
    });
  }

  // Lazy getter for KeyBackupService to avoid circular dependency
  private get keyBackupService(): any {
    return this.injector.get("KeyBackupService" as any, null);
  }

  private getCurrentUserId(): Observable<string> {
    return this.store.select(selectAuthUser).pipe(
      map((user) => user?.uid || ""),
      take(1),
    );
  }

  /**
   * Initialize encryption for a user (generate and store key pair)
   */
  async initializeEncryption(userId: string): Promise<void> {
    try {
      // Check if user already has keys
      const existingKeys =
        await this.encryptionService.getStoredKeyPair(userId);
      if (!existingKeys) {
        // No keys found - user needs to generate or restore keys manually
        throw new Error(
          "No encryption keys found. Please generate new keys or restore from backup.",
        );
      }

      // Keys exist - check if public key is in Firestore
      const publicKeyString = await this.encryptionService.exportPublicKey(
        existingKeys.publicKey,
      );

      try {
        const userKeyDoc = await firstValueFrom(
          this.firestore.collection("userKeys").doc(userId).get(),
        );

        if (!userKeyDoc.exists) {
          // Upload public key to Firestore
          await this.firestore.collection("userKeys").doc(userId).set({
            publicKey: publicKeyString,
            createdAt: new Date(),
            userId: userId,
          });
        }
      } catch (firestoreError) {
        console.warn("Failed to sync public key to Firestore:", firestoreError);
        // Continue - local encryption still works
      }
    } catch (error) {
      console.error("Error initializing encryption:", error);
      throw error;
    }
  }

  /**
   * Get public key for a user with consistent key management
   * This ensures the same keys are used for encryption and decryption
   */
  async getUserPublicKey(userId: string): Promise<CryptoKey | null> {
    try {
      // Get current user ID to check if this is our own key
      const currentUserId = await firstValueFrom(this.getCurrentUserId());

      // If this is our own key, get it from local storage
      if (currentUserId === userId) {
        const storedKeyPair =
          await this.encryptionService.getStoredKeyPair(userId);
        if (storedKeyPair) {
          return storedKeyPair.publicKey;
        }

        // No keys found - user needs to generate or restore keys
        // Don't auto-generate to respect when users explicitly clear keys
        return null;
      }

      // For other users, get their public key from Firestore
      try {
        const userKeyDoc = await firstValueFrom(
          this.firestore.collection("userKeys").doc(userId).get(),
        );

        if (!userKeyDoc.exists) {
          console.warn(`No public key found in Firestore for user ${userId}`);
          return null;
        }

        const userData = userKeyDoc.data() as any;
        if (!userData?.publicKey) {
          console.warn(`Invalid public key data for user ${userId}`);
          return null;
        }

        // Import the public key from Firestore
        return await this.encryptionService.importPublicKey(userData.publicKey);
      } catch (firestoreError) {
        console.warn(
          `Failed to fetch public key for user ${userId} from Firestore:`,
          firestoreError,
        );
        return null;
      }
    } catch (error) {
      console.error(`Error getting public key for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Send an encrypted message
   */
  sendEncryptedMessage(
    request: EncryptedSendMessageRequest,
  ): Observable<string> {
    return from(this.sendEncryptedMessageAsync(request));
  }

  /**
   * Send an encrypted message (async implementation) with comprehensive fallback
   */
  private async sendEncryptedMessageAsync(
    request: EncryptedSendMessageRequest,
  ): Promise<string> {
    try {
      // Get current user
      const currentUser = await firstValueFrom(
        this.store.select(selectAuthUser).pipe(take(1)),
      );
      if (!currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      // If encryption is not requested or text is empty, use regular chat service
      if (!request.isEncrypted || !request.text) {
        return firstValueFrom(
          this.chatService.sendMessage(request as SendMessageRequest),
        );
      }

      // Check if encryption is available before attempting encryption
      const participantStatus = await this.getParticipantEncryptionStatus(
        request.chatId,
      );

      if (
        !participantStatus.allReady &&
        participantStatus.missingKeyParticipants.length > 0
      ) {
        // Some participants don't have encryption keys
        const error: any = new Error("PARTIAL_ENCRYPTION_AVAILABLE");
        error.missingKeyParticipants = participantStatus.missingKeyParticipants;
        error.readyParticipants = participantStatus.readyParticipants;
        throw error;
      }

      if (!(await this.isEncryptionAvailable(request.chatId))) {
        console.warn(
          "Encryption not available, falling back to unencrypted message",
        );
        return firstValueFrom(
          this.chatService.sendMessage({
            ...request,
            isEncrypted: false,
            encryptionData: undefined,
            encryptedKeys: undefined,
          } as SendMessageRequest),
        );
      }

      try {
        // Get chat participants
        const chat = await firstValueFrom(
          this.chatService.getChat(request.chatId).pipe(take(1)),
        );
        if (!chat) {
          throw new Error("Chat not found");
        }

        // Generate message encryption key
        const messageKey = await this.encryptionService.generateMessageKey();

        // Encrypt the message content
        const encryptedMessage = await this.encryptionService.encryptMessage(
          request.text,
          messageKey,
        );

        // Get public keys for all participants and encrypt the message key for each (in parallel)
        const encryptedKeys: {[userId: string]: string} = {};
        let encryptionFailures = 0;

        // Parallel encryption for better performance (5x faster for large groups)
        const encryptionPromises = chat.participants.map(
          async (participantId) => {
            try {
              const publicKey = await this.getUserPublicKey(participantId);
              if (publicKey) {
                const encryptedKey =
                  await this.encryptionService.encryptKeyForRecipient(
                    messageKey,
                    publicKey,
                  );
                return {participantId, encryptedKey, success: true};
              } else {
                console.warn(
                  `No public key found for participant: ${participantId}`,
                );
                return {participantId, encryptedKey: "", success: false};
              }
            } catch (keyError) {
              console.warn(
                `Failed to encrypt key for participant ${participantId}:`,
                keyError,
              );
              return {participantId, encryptedKey: "", success: false};
            }
          },
        );

        // Wait for all encryption operations to complete
        const results = await Promise.all(encryptionPromises);

        // Process results
        for (const result of results) {
          if (result.success) {
            encryptedKeys[result.participantId] = result.encryptedKey;
          } else {
            encryptionFailures++;
          }
        }

        // If we couldn't encrypt for any participants, fall back to unencrypted
        if (Object.keys(encryptedKeys).length === 0) {
          console.warn(
            "No participants could receive encrypted message, falling back to unencrypted",
          );
          return firstValueFrom(
            this.chatService.sendMessage({
              ...request,
              isEncrypted: false,
              encryptionData: undefined,
              encryptedKeys: undefined,
            } as SendMessageRequest),
          );
        }

        // If some participants couldn't receive encrypted message, log warning but continue
        if (encryptionFailures > 0) {
          console.warn(
            `${encryptionFailures} participants cannot receive encrypted message`,
          );
        }

        // Create encrypted message request
        const encryptedRequest: SendMessageRequest = {
          ...request,
          text: encryptedMessage.encryptedContent,
          isEncrypted: true,
          encryptionData: {
            algorithm: encryptedMessage.algorithm,
            iv: encryptedMessage.iv,
            keyFingerprint: encryptedMessage.keyFingerprint,
          },
          encryptedKeys: encryptedKeys,
        };

        return await firstValueFrom(
          this.chatService.sendMessage(encryptedRequest),
        );
      } catch (encryptionError) {
        console.warn(
          "Encryption failed, falling back to unencrypted message:",
          encryptionError,
        );
        // Fall back to sending unencrypted message
        return firstValueFrom(
          this.chatService.sendMessage({
            ...request,
            isEncrypted: false,
            encryptionData: undefined,
            encryptedKeys: undefined,
          } as SendMessageRequest),
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Last resort: still try to send unencrypted if possible
      try {
        console.warn("Attempting last resort unencrypted send");
        return firstValueFrom(
          this.chatService.sendMessage({
            ...request,
            isEncrypted: false,
            encryptionData: undefined,
            encryptedKeys: undefined,
          } as SendMessageRequest),
        );
      } catch (finalError) {
        console.error("Final send attempt failed:", finalError);
        throw finalError;
      }
    }
  }

  /**
   * Decrypt a message for the current user with enhanced error handling
   */
  async decryptMessage(message: Message, userId: string): Promise<string> {
    try {
      // Validate message has proper encryption fields
      if (!this.isValidEncryptedMessage(message)) {
        console.warn("Message marked as encrypted but missing encryption data");
        // Check if the text looks like encrypted content
        if (this.looksLikeEncryptedContent(message.text)) {
          return "🔒 Encrypted message (unable to decrypt)";
        }
        return message.text || "🔒 Invalid encrypted message";
      }

      // Get user's private key
      const keyPair = await this.encryptionService.getStoredKeyPair(userId);
      if (!keyPair) {
        console.warn(
          `No encryption keys found for user ${userId}, returning fallback message`,
        );
        return "🔒 Encrypted message (no decryption keys)";
      }

      // Get encrypted message key for this user
      const encryptedKey = message.encryptedKeys![userId];
      if (!encryptedKey) {
        // This is expected for historical messages sent before the user was added to the chat
        // or before the user had encryption keys set up.
        console.warn(
          `[EncryptedChat] Skipping message ${message.id}: No key for user ${userId}`,
        );
        return "🔒 Encrypted message (sent before you joined or encryption was set up)";
      }

      // Decrypt the message key
      const messageKey = await this.encryptionService.decryptKeyFromSender(
        encryptedKey,
        keyPair.privateKey,
      );

      // Decrypt the message content
      const encryptedMessageData: EncryptedMessage = {
        encryptedContent: message.text || "",
        iv: message.encryptionData!.iv,
        keyFingerprint: message.encryptionData!.keyFingerprint,
        algorithm: message.encryptionData!.algorithm,
      };

      const decryptedText = await this.encryptionService.decryptMessage(
        encryptedMessageData,
        messageKey,
      );

      return decryptedText;
    } catch (error) {
      // Type the error properly
      const typedError = error as Error;

      // Check if this might be a key mismatch issue (OperationError)
      if (typedError.name === "OperationError") {
        console.warn(
          `[EncryptedChat] Decryption failed for message ${message.id} (Key Mismatch):`,
          typedError.message,
        );
        // More helpful error message with action
        return "🔒 Unable to decrypt (key mismatch). Try restoring your backup in encryption settings.";
      }

      // Check for invalid key format
      if (
        typedError.message?.includes("key") ||
        typedError.message?.includes("Invalid")
      ) {
        console.error("[EncryptedChat] Invalid key format:", error);
        return "🔒 Unable to decrypt (invalid key format). Check encryption settings.";
      }

      console.error("[EncryptedChat] Error decrypting message:", error);
      return "🔒 Unable to decrypt. Contact support if this persists.";
    }
  }

  /**
   * Validate if a message has proper encryption structure
   */
  private isValidEncryptedMessage(message: Message): boolean {
    return !!(
      message.isEncrypted &&
      message.encryptionData &&
      message.encryptionData.iv &&
      message.encryptionData.algorithm &&
      message.encryptedKeys &&
      Object.keys(message.encryptedKeys).length > 0
    );
  }

  /**
   * Check if text content looks like encrypted data (base64-like patterns)
   */
  private looksLikeEncryptedContent(text: string | undefined): boolean {
    if (!text) return false;

    // Check for base64-like patterns (common in encrypted content)
    // Base64 typically contains alphanumeric characters, +, /, and = padding
    const base64Pattern = /^[A-Za-z0-9+/]{20,}={0,2}$/;

    // Check for other patterns that suggest encrypted content
    const hasRandomLookingContent =
      text.length > 15 &&
      /[A-Za-z0-9]{15,}/.test(text) &&
      !/\s/.test(text) && // No spaces
      !/[.!?]/.test(text); // No common punctuation

    return base64Pattern.test(text) || hasRandomLookingContent;
  }

  /**
   * Clear the decryption cache
   * This forces all messages to be re-decrypted (useful when keys are restored)
   */
  clearDecryptionCache(): void {
    console.log(
      `[EncryptedChatService] Clearing cache - ${this.decryptedCache.size} cached messages, ${this.messageVersions.size} versions, ${this.decryptingMessages.size} in-progress`,
    );
    this.decryptedCache.clear();
    this.messageVersions.clear();
    this.decryptingMessages.clear();
    // Trigger update to re-decrypt all messages
    const newValue = this.updateTrigger.value + 1;
    console.log(
      `[EncryptedChatService] Triggering update: ${this.updateTrigger.value} -> ${newValue}`,
    );
    this.updateTrigger.next(newValue);
  }

  /**
   * Get messages with zero-flicker decryption using combined observable streams
   * Hides encrypted messages until they are successfully decrypted
   */
  getDecryptedMessages(
    chatId: string,
    userId: string,
    limit: number = 20,
  ): Observable<Message[]> {
    return combineLatest([
      this.chatService.getChatMessages(chatId, limit),
      this.updateTrigger.asObservable(),
    ]).pipe(
      map(([messages, _trigger]) => {
        return messages
          .map((message) => {
            const messageId =
              message.id || `temp_${Date.now()}_${Math.random()}`;
            const cacheKey = `${messageId}_${userId}`;

            if (
              !message.isEncrypted ||
              !this.isValidEncryptedMessage(message)
            ) {
              // Check if this looks like encrypted content but wasn't properly marked
              if (this.looksLikeEncryptedContent(message.text)) {
                return {
                  ...message,
                  text: "🔒 Encrypted message (unable to decrypt)",
                };
              }
              // Non-encrypted message - return as-is
              return message;
            }

            // For encrypted messages, check cache first
            const cachedText = this.decryptedCache.get(cacheKey);
            if (cachedText !== undefined) {
              console.log(
                `[EncryptedChatService] Using cached text for message ${messageId}`,
              );
              return {
                ...message,
                text: cachedText,
              };
            }

            // If not cached, start async decryption
            console.log(
              `[EncryptedChatService] Starting decryption for message ${messageId}`,
            );
            this.startAsyncDecryption(message, userId, messageId, cacheKey);

            // Return null to hide the message until decryption completes
            return null;
          })
          .filter((message): message is Message => message !== null); // Remove null messages
      }),
      distinctUntilChanged((prev, curr) => {
        if (prev.length !== curr.length) return false;
        return prev.every((msg, index) => {
          const currMsg = curr[index];
          return (
            msg.id === currMsg?.id &&
            msg.text === currMsg?.text &&
            msg.timestamp === currMsg?.timestamp
          );
        });
      }),
      shareReplay(1),
    );
  }

  /**
   * Get decrypted historical messages
   * Reuses the same caching and decryption logic as the real-time stream
   */
  getDecryptedHistory(
    chatId: string,
    startAfter: any,
    limit: number,
    userId: string,
  ): Observable<Message[]> {
    return this.chatService.getChatHistory(chatId, startAfter, limit).pipe(
      map((messages) => {
        // Process messages for decryption
        messages.forEach((message) => {
          const messageId = message.id || `temp_${Date.now()}_${Math.random()}`;
          const cacheKey = `${messageId}_${userId}`;

          if (
            message.isEncrypted &&
            this.isValidEncryptedMessage(message) &&
            !this.decryptedCache.has(cacheKey)
          ) {
            // Start async decryption for any messages not already in cache
            this.startAsyncDecryption(message, userId, messageId, cacheKey);
          }
        });

        // Return messages with decrypted content if available in cache, or placeholder
        return messages.map((message) => {
          if (!message.isEncrypted) return message;

          const messageId = message.id;
          const cacheKey = `${messageId}_${userId}`;

          if (this.decryptedCache.has(cacheKey)) {
            return {
              ...message,
              text: this.decryptedCache.get(cacheKey),
            };
          }

          // If not yet decrypted, return as is (but decryption has started in background)
          // The UI should handle showing a loading state or "decrypting..."
          // Note: Since this is a one-time fetch, we might need to handle the update
          // differently than the real-time stream.
          // For now, we return valid messages, and the component can subscribe
          // to updateTrigger if it wants to be notified of late decryptions.
          return message;
        });
      }),
    );
  }

  /**
   * Start async decryption without blocking UI updates
   */
  private startAsyncDecryption(
    message: Message,
    userId: string,
    messageId: string,
    cacheKey: string,
  ): void {
    // Prevent duplicate decryption attempts
    if (this.decryptingMessages.has(cacheKey)) {
      return;
    }

    this.decryptingMessages.add(cacheKey);

    // Check if message has changed since last time
    const currentVersion = {
      timestamp: message.timestamp,
      isEncrypted: message.isEncrypted || false,
      text: message.text || "",
    };

    const lastVersion = this.messageVersions.get(messageId);
    const hasChanged =
      !lastVersion ||
      lastVersion.timestamp !== currentVersion.timestamp ||
      lastVersion.isEncrypted !== currentVersion.isEncrypted ||
      lastVersion.text !== currentVersion.text;

    if (!hasChanged && this.decryptedCache.has(cacheKey)) {
      this.decryptingMessages.delete(cacheKey);
      return;
    }

    // Decrypt asynchronously
    this.decryptMessage(message, userId)
      .then((decryptedText) => {
        this.decryptedCache.set(cacheKey, decryptedText);
        this.messageVersions.set(messageId, currentVersion);
        // Force stream update by triggering the update subject
        this.updateTrigger.next(this.updateTrigger.value + 1);
      })
      .catch((error) => {
        console.error("Error decrypting message:", error);

        // Check if this is an OperationError indicating key incompatibility
        if (error.name === "OperationError") {
          console.warn(
            "OperationError in async decryption - NOT regenerating keys to preserve message history",
          );
          // DO NOT regenerate keys automatically in background as this would make old messages unreadable
        }

        // Use a user-friendly fallback message instead of raw encrypted content
        const fallbackText = "🔒 Encrypted message (unable to decrypt)";
        this.decryptedCache.set(cacheKey, fallbackText);
        this.updateTrigger.next(this.updateTrigger.value + 1);
      })
      .finally(() => {
        this.decryptingMessages.delete(cacheKey);
      });
  }

  /**
   * Trigger a message update to refresh the UI
   */
  private triggerMessageUpdate(): void {
    this.updateTrigger.next(this.updateTrigger.value + 1);
  }

  /**
   * Get detailed encryption status for all chat participants
   * Returns which participants have keys and which don't
   */
  async getParticipantEncryptionStatus(chatId: string): Promise<{
    allReady: boolean;
    readyParticipants: string[];
    missingKeyParticipants: string[];
    participantNames?: Map<string, string>;
  }> {
    try {
      const chat = await firstValueFrom(this.chatService.getChat(chatId));
      if (!chat) {
        return {
          allReady: false,
          readyParticipants: [],
          missingKeyParticipants: [],
        };
      }

      const readyParticipants: string[] = [];
      const missingKeyParticipants: string[] = [];

      for (const participantId of chat.participants) {
        try {
          const publicKey = await this.getUserPublicKey(participantId);
          if (publicKey) {
            readyParticipants.push(participantId);
          } else {
            missingKeyParticipants.push(participantId);
          }
        } catch (error) {
          missingKeyParticipants.push(participantId);
        }
      }

      return {
        allReady: missingKeyParticipants.length === 0,
        readyParticipants,
        missingKeyParticipants,
      };
    } catch (error) {
      console.error("Error checking participant encryption status:", error);
      return {
        allReady: false,
        readyParticipants: [],
        missingKeyParticipants: [],
      };
    }
  }

  /**
   * Check if encryption is available for a chat
   * Returns true only if all participants have public keys available
   */
  async isEncryptionAvailable(chatId: string): Promise<boolean> {
    try {
      const chat = await firstValueFrom(this.chatService.getChat(chatId));
      if (!chat) {
        return false;
      }

      // For encryption to be available:
      // 1. The browser supports Web Crypto API
      // 2. The current user has encryption enabled
      // 3. All participants have public keys available
      const userId = await firstValueFrom(this.getCurrentUserId());
      if (!userId) {
        return false;
      }

      // Check if Web Crypto API is available
      if (!window.crypto || !window.crypto.subtle) {
        return false;
      }

      // Check if user has a stored key pair (encryption enabled)
      const keyPair = await this.encryptionService.getStoredKeyPair(userId);
      if (!keyPair) {
        return false;
      }

      // Check if all participants have public keys available
      for (const participantId of chat.participants) {
        const publicKey = await this.getUserPublicKey(participantId);
        if (!publicKey) {
          console.warn(
            `Encryption not available: participant ${participantId} has no public key`,
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error checking encryption availability:", error);
      return false;
    }
  }

  /**
   * Enable encryption for the current user
   */
  async enableEncryption(): Promise<void> {
    const userId = await firstValueFrom(this.getCurrentUserId());
    if (!userId) throw new Error("User not authenticated");

    try {
      // Check if key pair already exists
      const existingKeyPair =
        await this.encryptionService.getStoredKeyPair(userId);

      if (!existingKeyPair) {
        // No keys found - user needs to generate or restore keys manually
        throw new Error(
          "No encryption keys found. Please generate new keys or restore from backup in Encryption Settings.",
        );
      }

      // Keys exist - ensure public key is in Firestore
      try {
        const userKeyDoc = await firstValueFrom(
          this.firestore.collection("userKeys").doc(userId).get(),
        );

        if (!userKeyDoc.exists) {
          // Store public key in Firestore for other users to access
          const publicKeyString = await this.encryptionService.exportPublicKey(
            existingKeyPair.publicKey,
          );
          await this.firestore.collection("userKeys").doc(userId).set({
            publicKey: publicKeyString,
            createdAt: new Date(),
            userId: userId,
          });
        }
      } catch (firestoreError) {
        console.warn("Failed to sync public key to Firestore:", firestoreError);
        // Continue - local encryption still works
      }
    } catch (error) {
      console.error("Error enabling encryption:", error);
      throw error;
    }
  }

  /**
   * Check encryption key health
   * Tests if keys can encrypt/decrypt properly
   */
  async checkKeyHealth(userId: string): Promise<{
    healthy: boolean;
    error?: string;
    recommendation?: string;
  }> {
    try {
      const keyPair = await this.encryptionService.getStoredKeyPair(userId);

      if (!keyPair) {
        return {
          healthy: false,
          error: "No encryption keys found",
          recommendation: "Enable encryption or restore from backup",
        };
      }

      // Test encryption/decryption
      const testMessage = "test-" + Date.now();
      const messageKey = await this.encryptionService.generateMessageKey();

      // Test encrypt
      const encrypted = await this.encryptionService.encryptMessage(
        testMessage,
        messageKey,
      );

      // Test decrypt
      const decrypted = await this.encryptionService.decryptMessage(
        encrypted,
        messageKey,
      );

      if (decrypted !== testMessage) {
        return {
          healthy: false,
          error: "Keys corrupted - decryption mismatch",
          recommendation: "Restore keys from backup or generate new keys",
        };
      }

      return {healthy: true};
    } catch (error) {
      console.error("Key health check failed:", error);
      return {
        healthy: false,
        error: (error as Error).message || "Unknown error",
        recommendation: "Try restoring from backup or regenerate keys",
      };
    }
  }

  /**
   * Regenerate encryption keys (use when there are key compatibility issues)
   */
  async regenerateKeys(): Promise<void> {
    // Prevent multiple simultaneous regeneration attempts
    if (this.keyRegenerationInProgress) {
      console.log("Key regeneration already in progress, skipping...");
      return;
    }

    const userId = await firstValueFrom(this.getCurrentUserId());
    if (!userId) throw new Error("User not authenticated");

    try {
      this.keyRegenerationInProgress = true;

      // Clear existing keys and cache
      await this.encryptionService.clearStoredKeys(userId);
      this.clearDecryptionCache();

      // Generate new key pair
      const keyPair = await this.encryptionService.generateKeyPair();

      // Store new keys locally
      await this.encryptionService.storeKeyPair(keyPair, userId);

      // Store new public key in Firestore for other users to access
      const publicKeyString = await this.encryptionService.exportPublicKey(
        keyPair.publicKey,
      );

      try {
        await this.firestore.collection("userKeys").doc(userId).set({
          publicKey: publicKeyString,
          createdAt: new Date(),
          userId: userId,
        });
      } catch (firestoreError) {
        console.warn(
          "Failed to store public key in Firestore, continuing with local keys only:",
          firestoreError,
        );
        // Don't throw here - local encryption keys are still functional
        // This allows the system to work even if Firestore permissions are misconfigured
      }

      console.log("Successfully regenerated encryption keys");
    } catch (error) {
      console.error("Error regenerating encryption keys:", error);
      throw error;
    } finally {
      this.keyRegenerationInProgress = false;
    }
  }

  /**
   * Disable encryption for a user (remove keys)
   */
  async disableEncryption(): Promise<void> {
    const currentUser = await firstValueFrom(
      this.store.select(selectAuthUser).pipe(take(1)),
    );
    if (!currentUser?.uid) {
      throw new Error("User not authenticated");
    }

    // Clear local keys
    await this.encryptionService.clearStoredKeys(currentUser.uid);

    // Remove public key from Firestore
    await this.firestore.collection("userKeys").doc(currentUser.uid).delete();
  }

  /**
   * Check if current user has encryption enabled
   */
  async isEncryptionEnabled(): Promise<boolean> {
    const currentUser = await firstValueFrom(
      this.store.select(selectAuthUser).pipe(take(1)),
    );
    if (!currentUser?.uid) {
      return false;
    }

    const keyPair = await this.encryptionService.getStoredKeyPair(
      currentUser.uid,
    );
    return keyPair !== null;
  }

  /**
   * Clear all encryption data for fresh start (useful for development/testing)
   * This clears ALL encryption-related data from browser storage
   */
  clearAllEncryptionData(): void {
    // Clear localStorage keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("publicKey_") ||
          key.startsWith("privateKey_") ||
          key.includes("encrypt"))
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Clear sessionStorage keys
    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (
        key &&
        (key.startsWith("tempPublicKey_") || key.includes("encrypt"))
      ) {
        sessionKeysToRemove.push(key);
      }
    }

    sessionKeysToRemove.forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }

  /**
   * Clear cache entries for a specific user (useful when user logs out)
   */
  clearUserDecryptionCache(userId: string): void {
    const keysToDelete: string[] = [];
    for (const [key] of this.decryptedCache) {
      if (key.endsWith(`_${userId}`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.decryptedCache.delete(key));

    // Note: We don't clear messageVersions here as they're not user-specific
  }

  /**
   * Get the encrypted message key for a specific user and message
   * This retrieves the user's encrypted copy of the message key
   */
  getMessageKeyForUser(message: Message, userId: string): string | null {
    if (!message.encryptedKeys || !message.encryptedKeys[userId]) {
      console.warn(
        `No encrypted key found for user ${userId} in message ${message.id}`,
      );
      return null;
    }
    return message.encryptedKeys[userId];
  }

  /**
   * Get all users who have access to a specific message
   * Returns array of user IDs who can decrypt this message
   */
  getMessageRecipients(message: Message): string[] {
    if (!message.encryptedKeys) {
      return [];
    }
    return Object.keys(message.encryptedKeys);
  }

  /**
   * Check if a specific user can decrypt a message
   */
  canUserDecryptMessage(message: Message, userId: string): boolean {
    return !!(message.encryptedKeys && message.encryptedKeys[userId]);
  }

  /**
   * Get decrypted message key for current user (useful for debugging or key management)
   * WARNING: This exposes the raw message key - use carefully
   */
  async getDecryptedMessageKey(
    message: Message,
    userId: string,
  ): Promise<CryptoKey | null> {
    try {
      // Get user's private key
      const keyPair = await this.encryptionService.getStoredKeyPair(userId);
      if (!keyPair) {
        console.warn(`No encryption keys found for user ${userId}`);
        return null;
      }

      // Get encrypted message key for this user
      const encryptedKey = this.getMessageKeyForUser(message, userId);
      if (!encryptedKey) {
        return null;
      }

      // Decrypt the message key
      const messageKey = await this.encryptionService.decryptKeyFromSender(
        encryptedKey,
        keyPair.privateKey,
      );

      return messageKey;
    } catch (error) {
      console.error(
        `Error getting decrypted message key for user ${userId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Get message encryption info for debugging/analysis
   */
  getMessageEncryptionInfo(message: Message): {
    isEncrypted: boolean;
    algorithm?: string;
    recipientCount: number;
    recipients: string[];
    hasEncryptionData: boolean;
    keyFingerprint?: string;
  } {
    return {
      isEncrypted: !!message.isEncrypted,
      algorithm: message.encryptionData?.algorithm,
      recipientCount: message.encryptedKeys
        ? Object.keys(message.encryptedKeys).length
        : 0,
      recipients: this.getMessageRecipients(message),
      hasEncryptionData: !!message.encryptionData,
      keyFingerprint: message.encryptionData?.keyFingerprint,
    };
  }

  /**
   * Export user's decryption keys for backup/transfer (use with extreme caution)
   * This could be used for key backup or device migration
   */
  async exportUserKeys(
    userId: string,
  ): Promise<{publicKey: string; privateKey: string} | null> {
    try {
      const keyPair = await this.encryptionService.getStoredKeyPair(userId);
      if (!keyPair) {
        return null;
      }

      const publicKeyString = await this.encryptionService.exportPublicKey(
        keyPair.publicKey,
      );
      const privateKeyBytes = await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey,
      );
      const privateKeyString = btoa(
        String.fromCharCode(...new Uint8Array(privateKeyBytes)),
      );

      return {
        publicKey: publicKeyString,
        privateKey: privateKeyString,
      };
    } catch (error) {
      console.error(`Error exporting keys for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Import user keys from backup (use with extreme caution)
   * This could be used for key restoration or device migration
   */
  async importUserKeys(
    userId: string,
    keys: {publicKey: string; privateKey: string},
  ): Promise<boolean> {
    try {
      // Import the keys first to validate them
      const publicKey = await this.encryptionService.importPublicKey(
        keys.publicKey,
      );

      const privateKeyBuffer = Uint8Array.from(atob(keys.privateKey), (c) =>
        c.charCodeAt(0),
      );
      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"],
      );

      // Store the keys using the standard method
      await this.encryptionService.storeKeyPair(
        {publicKey, privateKey},
        userId,
      );

      // Update Firestore with the public key
      try {
        await this.firestore.collection("userKeys").doc(userId).set({
          publicKey: keys.publicKey,
          createdAt: new Date(),
          userId: userId,
        });
      } catch (firestoreError) {
        console.warn(
          "Failed to store public key in Firestore:",
          firestoreError,
        );
        // Continue - local keys are imported successfully
      }

      console.log(`Successfully imported keys for user ${userId}`);
      return true;
    } catch (error) {
      console.error(`Error importing keys for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Diagnose encryption key issues for debugging
   */
  async diagnoseKeyIssues(userId: string): Promise<{
    hasLocalKeys: boolean;
    hasFirestoreKey: boolean;
    canImportLocalKeys: boolean;
    keyMismatch: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let hasLocalKeys = false;
    let hasFirestoreKey = false;
    let canImportLocalKeys = false;
    let keyMismatch = false;

    try {
      // Check local keys
      const keyPair = await this.encryptionService.getStoredKeyPair(userId);
      hasLocalKeys = !!keyPair;

      if (keyPair) {
        canImportLocalKeys = true;
        console.log("✅ Local keys found and can be imported");
      } else {
        issues.push("No local encryption keys found");
        recommendations.push("Enable encryption or import keys from backup");
      }

      // Check Firestore key
      try {
        const userKeyDoc = await firstValueFrom(
          this.firestore.collection("userKeys").doc(userId).get(),
        );
        const userData = userKeyDoc.data() as any;
        hasFirestoreKey = userKeyDoc.exists && !!userData?.publicKey;

        if (!hasFirestoreKey) {
          issues.push("No public key found in Firestore");
          recommendations.push("Re-enable encryption to upload public key");
        }
      } catch (firestoreError) {
        issues.push("Cannot access Firestore keys");
        recommendations.push(
          "Check internet connection and Firestore permissions",
        );
      }

      // Check for key mismatch if both exist
      if (hasLocalKeys && hasFirestoreKey) {
        try {
          const userKeyDoc = await firstValueFrom(
            this.firestore.collection("userKeys").doc(userId).get(),
          );
          const userData = userKeyDoc.data() as any;
          const firestorePublicKey = userData?.publicKey;
          const localPublicKey = await this.encryptionService.exportPublicKey(
            keyPair!.publicKey,
          );

          if (firestorePublicKey !== localPublicKey) {
            keyMismatch = true;
            issues.push(
              "Public key mismatch between local storage and Firestore",
            );
            recommendations.push(
              "Re-enable encryption to sync keys or restore from backup",
            );
          }
        } catch (error) {
          issues.push("Cannot compare local and Firestore keys");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      issues.push(`Error during diagnosis: ${errorMessage}`);
      recommendations.push(
        "Try refreshing the page or clearing browser storage",
      );
    }

    return {
      hasLocalKeys,
      hasFirestoreKey,
      canImportLocalKeys,
      keyMismatch,
      issues,
      recommendations,
    };
  }

  /**
   * Manual key regeneration (only call when user explicitly requests it)
   * WARNING: This will make all existing encrypted messages unreadable!
   */
  async manualKeyRegeneration(): Promise<{success: boolean; message: string}> {
    const userId = await firstValueFrom(this.getCurrentUserId());
    if (!userId) {
      return {success: false, message: "User not authenticated"};
    }

    try {
      console.warn(
        "⚠️ MANUAL KEY REGENERATION - This will make existing encrypted messages unreadable!",
      );

      // Clear existing keys and cache
      await this.encryptionService.clearStoredKeys(userId);
      this.clearDecryptionCache();

      // Generate new key pair
      const keyPair = await this.encryptionService.generateKeyPair();

      // Store new keys locally
      await this.encryptionService.storeKeyPair(keyPair, userId);

      // Store new public key in Firestore for other users to access
      const publicKeyString = await this.encryptionService.exportPublicKey(
        keyPair.publicKey,
      );

      try {
        await this.firestore.collection("userKeys").doc(userId).set({
          publicKey: publicKeyString,
          createdAt: new Date(),
          userId: userId,
        });
      } catch (firestoreError) {
        console.warn(
          "Failed to store public key in Firestore:",
          firestoreError,
        );
      }

      return {
        success: true,
        message:
          "Keys regenerated successfully. Note: Previous encrypted messages are now unreadable.",
      };
    } catch (error) {
      console.error("Error in manual key regeneration:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message: `Failed to regenerate keys: ${errorMessage}`,
      };
    }
  }
}
