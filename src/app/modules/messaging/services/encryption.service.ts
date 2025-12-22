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
import {Subject, Observable} from "rxjs";
import {SecureKeyStorageService} from "./secure-key-storage.service";

export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export interface EncryptedMessage {
  encryptedContent: string;
  iv: string;
  keyFingerprint: string;
  algorithm: string;
}

@Injectable({
  providedIn: "root",
})
export class EncryptionService {
  private readonly ALGORITHM = "AES-GCM";
  private readonly KEY_LENGTH = 256;
  private readonly IV_LENGTH = 12; // 96 bits for AES-GCM

  // Observable for key changes (when keys are restored or cleared)
  private keysChangedSubject = new Subject<{
    userId: string;
    action: "restored" | "cleared";
  }>();
  public keysChanged$: Observable<{
    userId: string;
    action: "restored" | "cleared";
  }> = this.keysChangedSubject.asObservable();

  constructor(private secureKeyStorage: SecureKeyStorageService) {}

  /**
   * Generate a new AES key for encrypting messages
   */
  async generateMessageKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true, // extractable
      ["encrypt", "decrypt"],
    );
  }

  /**
   * Generate RSA key pair for key exchange
   */
  async generateKeyPair(): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true, // extractable
      ["encrypt", "decrypt"],
    );

    return keyPair as KeyPair;
  }

  /**
   * Export public key to string for sharing
   */
  async exportPublicKey(publicKey: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey("spki", publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  /**
   * Import public key from string
   */
  async importPublicKey(keyString: string): Promise<CryptoKey> {
    const keyData = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      "spki",
      keyData,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["encrypt"],
    );
  }

  /**
   * Encrypt message content
   */
  async encryptMessage(
    content: string,
    messageKey: CryptoKey,
  ): Promise<EncryptedMessage> {
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

    // Convert content to bytes
    const contentBytes = new TextEncoder().encode(content);

    // Encrypt the content
    const encryptedBytes = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv: iv,
      },
      messageKey,
      contentBytes,
    );

    // Create proper key fingerprint for verification
    const keyFingerprint = await this.createKeyFingerprint(messageKey);

    return {
      encryptedContent: btoa(
        String.fromCharCode(...new Uint8Array(encryptedBytes)),
      ),
      iv: btoa(String.fromCharCode(...iv)),
      keyFingerprint,
      algorithm: this.ALGORITHM,
    };
  }

  /**
   * Decrypt message content with simplified error handling
   */
  async decryptMessage(
    encryptedMessage: EncryptedMessage,
    messageKey: CryptoKey,
  ): Promise<string> {
    try {
      // Convert from base64
      const encryptedBytes = Uint8Array.from(
        atob(encryptedMessage.encryptedContent),
        (c) => c.charCodeAt(0),
      );
      const iv = Uint8Array.from(atob(encryptedMessage.iv), (c) =>
        c.charCodeAt(0),
      );

      // Verify key fingerprint to ensure we're using the correct key
      const expectedFingerprint = await this.createKeyFingerprint(messageKey);
      if (expectedFingerprint !== encryptedMessage.keyFingerprint) {
        throw new Error("Key fingerprint mismatch - wrong decryption key");
      }

      // Decrypt the content
      const decryptedBytes = await crypto.subtle.decrypt(
        {
          name: encryptedMessage.algorithm,
          iv: iv,
        },
        messageKey,
        encryptedBytes,
      );

      // Convert back to string
      return new TextDecoder().decode(decryptedBytes);
    } catch (error) {
      console.error("Failed to decrypt message content:", error);
      const typedError = error as Error;
      throw new Error(
        `Decryption failed: ${typedError.message || "Unknown error"}`,
      );
    }
  }

  /**
   * Encrypt a message key with recipient's public key
   */
  async encryptKeyForRecipient(
    messageKey: CryptoKey,
    recipientPublicKey: CryptoKey,
  ): Promise<string> {
    // Export the message key as raw bytes
    const keyBytes = await crypto.subtle.exportKey("raw", messageKey);

    // Encrypt with recipient's public key
    const encryptedKey = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      recipientPublicKey,
      keyBytes,
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedKey)));
  }

  /**
   * Decrypt a message key with private key
   */
  async decryptKeyFromSender(
    encryptedKey: string,
    privateKey: CryptoKey,
  ): Promise<CryptoKey> {
    // Convert from base64
    const encryptedKeyBytes = Uint8Array.from(atob(encryptedKey), (c) =>
      c.charCodeAt(0),
    );

    // Decrypt with private key
    const keyBytes = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedKeyBytes,
    );

    // Import as AES key with extractable = true and both encrypt/decrypt usages
    return await crypto.subtle.importKey(
      "raw",
      keyBytes,
      {
        name: this.ALGORITHM,
      },
      true, // Make extractable for fingerprint creation
      ["encrypt", "decrypt"], // Include both usages for flexibility
    );
  }

  /**
   * Create a fingerprint for key verification
   */
  private async createKeyFingerprint(key: CryptoKey): Promise<string> {
    const keyBytes = await crypto.subtle.exportKey("raw", key);
    const hashBytes = await crypto.subtle.digest("SHA-256", keyBytes);
    return btoa(String.fromCharCode(...new Uint8Array(hashBytes))).substring(
      0,
      16,
    );
  }

  /**
   * Get public key fingerprint for display/verification
   * Returns a human-readable fingerprint in format: XXXX XXXX XXXX XXXX
   */
  async getPublicKeyFingerprint(publicKey: CryptoKey): Promise<string> {
    try {
      // Export public key
      const publicKeyBytes = await crypto.subtle.exportKey("spki", publicKey);
      // Create SHA-256 hash
      const hashBytes = await crypto.subtle.digest("SHA-256", publicKeyBytes);
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBytes));
      const hexString = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      // Take first 16 characters and format as XXXX XXXX XXXX XXXX
      const formatted = hexString
        .substring(0, 16)
        .toUpperCase()
        .match(/.{1,4}/g)
        ?.join(" ");
      return formatted || hexString.substring(0, 16).toUpperCase();
    } catch (error) {
      console.error("Error generating fingerprint:", error);
      throw error;
    }
  }

  /**
   * Get public key fingerprint from stored keys for current user
   */
  async getStoredPublicKeyFingerprint(userId: string): Promise<string | null> {
    try {
      const keyPair = await this.getStoredKeyPair(userId);
      if (!keyPair) {
        return null;
      }
      return await this.getPublicKeyFingerprint(keyPair.publicKey);
    } catch (error) {
      console.error("Error getting stored key fingerprint:", error);
      return null;
    }
  }

  /**
   * Store keys securely in browser using IndexedDB
   * Migrated from localStorage to IndexedDB for better XSS protection
   */
  async storeKeyPair(keyPair: KeyPair, userId: string): Promise<void> {
    try {
      // Store in IndexedDB with encryption
      await this.secureKeyStorage.storeKeyPair(
        userId,
        keyPair.publicKey,
        keyPair.privateKey,
      );

      console.log(
        `[EncryptionService] Keys stored securely for user ${userId}`,
      );

      // Notify that keys have been restored
      this.keysChangedSubject.next({userId, action: "restored"});
      console.log(
        `[EncryptionService] Emitted 'restored' event for user ${userId}`,
      );
    } catch (error) {
      console.error("Error storing key pair:", error);
      throw error;
    }
  }

  /**
   * Get stored key pair for a user from IndexedDB
   * Automatically migrates from localStorage if keys exist there
   */
  async getStoredKeyPair(userId: string): Promise<CryptoKeyPair | null> {
    try {
      // Try to get keys from IndexedDB first
      let keyPair = await this.secureKeyStorage.getKeyPair(userId);

      if (keyPair) {
        return keyPair;
      }

      // If not found in IndexedDB, try migrating from localStorage
      console.log(
        `[EncryptionService] Attempting to migrate keys from localStorage for user ${userId}`,
      );
      const migrated =
        await this.secureKeyStorage.migrateFromLocalStorage(userId);

      if (migrated) {
        console.log(
          `[EncryptionService] Successfully migrated keys for user ${userId}`,
        );
        // Get the newly migrated keys
        keyPair = await this.secureKeyStorage.getKeyPair(userId);
        return keyPair;
      }

      return null;
    } catch (error) {
      console.error("Error retrieving stored keys:", error);
      // Clear potentially corrupted keys
      await this.clearStoredKeys(userId);
      return null;
    }
  }

  /**
   * Derive encryption key from password using PBKDF2
   * @param password - User's password or passphrase
   * @param salt - Salt for key derivation (32 bytes)
   * @param iterations - Number of PBKDF2 iterations (recommended: 100,000)
   * @returns AES-256 key for encryption/decryption
   */
  async deriveKeyFromPassword(
    password: string,
    salt: Uint8Array,
    iterations: number,
  ): Promise<CryptoKey> {
    // Convert password to key material
    const passwordBuffer = new TextEncoder().encode(password);
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"],
    );

    // Derive AES-GCM key
    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt as BufferSource,
        iterations: iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      {
        name: "AES-GCM",
        length: 256,
      },
      false, // not extractable
      ["encrypt", "decrypt"],
    );
  }

  /**
   * Clear stored keys (for logout) - clears from both IndexedDB and localStorage
   */
  async clearStoredKeys(userId: string): Promise<void> {
    try {
      // Clear from IndexedDB
      await this.secureKeyStorage.clearKeys(userId);

      // Also clear from localStorage (for backward compatibility during migration period)
      localStorage.removeItem(`publicKey_${userId}`);
      localStorage.removeItem(`privateKey_${userId}`);
      localStorage.removeItem(`encryptionPublicKey_${userId}`);
      localStorage.removeItem(`encryptionPrivateKey_${userId}`);

      // Only notify that keys have been cleared after successful operation
      this.keysChangedSubject.next({userId, action: "cleared"});
    } catch (error) {
      console.error("Error clearing keys:", error);
      // Re-throw to allow caller to handle the error
      throw error;
    }
  }

  /**
   * Encrypt data with derived key using AES-GCM
   * @param data - Data to encrypt (as string)
   * @param key - Derived encryption key from PBKDF2
   * @returns Encrypted data and IV
   */
  async encryptWithDerivedKey(
    data: string,
    key: CryptoKey,
  ): Promise<{encryptedData: string; iv: string}> {
    // Generate random IV (12 bytes for AES-GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Convert data to bytes
    const dataBytes = new TextEncoder().encode(data);

    // Encrypt
    const encryptedBytes = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      dataBytes,
    );

    // Convert to base64
    const encryptedData = btoa(
      String.fromCharCode(...new Uint8Array(encryptedBytes)),
    );
    const ivString = btoa(String.fromCharCode(...iv));

    return {encryptedData, iv: ivString};
  }

  /**
   * Decrypt data with derived key using AES-GCM
   * @param encryptedData - Base64-encoded encrypted data
   * @param key - Derived encryption key from PBKDF2
   * @param ivString - Base64-encoded IV
   * @returns Decrypted data as string
   */
  async decryptWithDerivedKey(
    encryptedData: string,
    key: CryptoKey,
    ivString: string,
  ): Promise<string> {
    try {
      // Convert from base64
      const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) =>
        c.charCodeAt(0),
      );
      const iv = Uint8Array.from(atob(ivString), (c) => c.charCodeAt(0));

      // Decrypt
      const decryptedBytes = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        encryptedBytes,
      );

      // Convert back to string
      return new TextDecoder().decode(decryptedBytes);
    } catch (error) {
      console.error("Failed to decrypt with derived key:", error);
      throw new Error(
        "Decryption failed. Password/passphrase may be incorrect.",
      );
    }
  }
}
