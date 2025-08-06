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
import {Injectable} from "@angular/core";
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

  constructor(
    private firestore: AngularFirestore,
    private store: Store<{auth: AuthState}>,
    private encryptionService: EncryptionService,
    private chatService: ChatService,
  ) {}

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
      if (existingKeys) {
        return;
      }

      // Generate new key pair
      const keyPair = await this.encryptionService.generateKeyPair();

      // Store locally
      await this.encryptionService.storeKeyPair(keyPair, userId);

      // Store public key in Firestore for other users to access
      const publicKeyString = await this.encryptionService.exportPublicKey(
        keyPair.publicKey,
      );
      await this.firestore.collection("userKeys").doc(userId).set({
        publicKey: publicKeyString,
        createdAt: new Date(),
        userId: userId,
      });
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
      // First try to get stored keys for this user
      const storedKeyPair =
        await this.encryptionService.getStoredKeyPair(userId);
      if (storedKeyPair) {
        return storedKeyPair.publicKey;
      }

      // If no stored keys exist, generate new ones and store them
      const keyPair = await this.encryptionService.generateKeyPair();

      // Store the key pair for future use
      await this.encryptionService.storeKeyPair(keyPair, userId);

      return keyPair.publicKey;
    } catch (error) {
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
      if (!this.isEncryptionAvailable(request.chatId)) {
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

        // Get public keys for all participants and encrypt the message key for each
        const encryptedKeys: {[userId: string]: string} = {};
        let encryptionFailures = 0;

        for (const participantId of chat.participants) {
          try {
            const publicKey = await this.getUserPublicKey(participantId);
            if (publicKey) {
              encryptedKeys[participantId] =
                await this.encryptionService.encryptKeyForRecipient(
                  messageKey,
                  publicKey,
                );
            } else {
              console.warn(
                `No public key found for participant: ${participantId}`,
              );
              encryptionFailures++;
            }
          } catch (keyError) {
            console.warn(
              `Failed to encrypt key for participant ${participantId}:`,
              keyError,
            );
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
        return message.text || "[Invalid encrypted message]";
      }

      // Get user's private key
      const keyPair = await this.encryptionService.getStoredKeyPair(userId);
      if (!keyPair) {
        console.warn(
          "No encryption keys found for user, returning original text",
        );
        return message.text || "[No decryption keys]";
      }

      // Get encrypted message key for this user
      const encryptedKey = message.encryptedKeys![userId];
      if (!encryptedKey) {
        console.warn(
          "No encrypted key found for this user, available keys:",
          Object.keys(message.encryptedKeys!),
        );
        return message.text || "[No access key]";
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
      console.error("Error decrypting message:", error);

      // Type the error properly
      const typedError = error as Error;
      console.error("Error details:", {
        name: typedError.name,
        message: typedError.message,
        stack: typedError.stack,
      });

      // Check if this might be a key mismatch issue
      if (typedError.name === "OperationError") {
        console.warn(
          "OperationError detected - likely key mismatch from previous encryption session",
        );
        return `[Encrypted message - cannot decrypt: ${message.text?.substring(0, 20)}...]`;
      }

      // Return a fallback instead of throwing
      return message.text || "[Decryption failed]";
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
   * Get messages with zero-flicker decryption using combined observable streams
   * Hides encrypted messages until they are successfully decrypted
   */
  getDecryptedMessages(chatId: string, userId: string): Observable<Message[]> {
    return combineLatest([
      this.chatService.getChatMessages(chatId),
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
              // Non-encrypted message - return as-is
              return message;
            }

            // For encrypted messages, check cache first
            const cachedText = this.decryptedCache.get(cacheKey);
            if (cachedText !== undefined) {
              return {
                ...message,
                text: cachedText,
              };
            }

            // If not cached, start async decryption
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
        const fallbackText = `[Decryption failed]`;
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
   * Check if encryption is available for a chat
   */
  async isEncryptionAvailable(chatId: string): Promise<boolean> {
    try {
      const chat = await firstValueFrom(this.chatService.getChat(chatId));
      if (!chat) {
        return false;
      }

      // For this demo, encryption is available if:
      // 1. The browser supports Web Crypto API
      // 2. The current user has encryption enabled
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
      return keyPair !== null;
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
      if (existingKeyPair) {
        return;
      }

      // Generate new key pair
      const keyPair = await this.encryptionService.generateKeyPair();

      // Store locally
      await this.encryptionService.storeKeyPair(keyPair, userId);

      // For demo purposes, we're not storing public keys in Firestore
    } catch (error) {
      console.error("Error initializing encryption:", error);
      throw error;
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
    this.encryptionService.clearStoredKeys(currentUser.uid);

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
   * Clear decryption cache to free memory or when switching users/chats
   */
  clearDecryptionCache(): void {
    this.decryptedCache.clear();
    this.messageVersions.clear();
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
}
