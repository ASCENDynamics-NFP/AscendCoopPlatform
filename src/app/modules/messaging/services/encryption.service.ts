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

  constructor() {}

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
   * Store keys securely in browser
   */
  async storeKeyPair(keyPair: KeyPair, userId: string): Promise<void> {
    try {
      // Export keys
      const publicKeyString = await this.exportPublicKey(keyPair.publicKey);
      const privateKeyBytes = await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey,
      );
      const privateKeyString = btoa(
        String.fromCharCode(...new Uint8Array(privateKeyBytes)),
      );

      // Store in localStorage (in production, consider more secure storage)
      localStorage.setItem(`publicKey_${userId}`, publicKeyString);
      localStorage.setItem(`privateKey_${userId}`, privateKeyString);
    } catch (error) {
      console.error("Error storing key pair:", error);
      throw error;
    }
  }

  /**
   * Get stored key pair for a user, with enhanced error handling and corruption detection
   */
  async getStoredKeyPair(userId: string): Promise<CryptoKeyPair | null> {
    try {
      // Check both old and new naming conventions for backward compatibility
      let publicKeyData = localStorage.getItem(`publicKey_${userId}`);
      let privateKeyData = localStorage.getItem(`privateKey_${userId}`);

      // Fallback to old naming convention if new one doesn't exist
      if (!publicKeyData || !privateKeyData) {
        publicKeyData = localStorage.getItem(`encryptionPublicKey_${userId}`);
        privateKeyData = localStorage.getItem(`encryptionPrivateKey_${userId}`);

        // If we found keys with old naming, migrate them to new naming
        if (publicKeyData && privateKeyData) {
          console.log(
            `Migrating keys from old naming convention for user ${userId}`,
          );
          localStorage.setItem(`publicKey_${userId}`, publicKeyData);
          localStorage.setItem(`privateKey_${userId}`, privateKeyData);
          // Remove old keys
          localStorage.removeItem(`encryptionPublicKey_${userId}`);
          localStorage.removeItem(`encryptionPrivateKey_${userId}`);
        }
      }

      if (!publicKeyData || !privateKeyData) {
        return null;
      }

      // Import each key separately with individual error handling
      let publicKey: CryptoKey;
      let privateKey: CryptoKey;

      try {
        // Import public key
        const publicKeyBuffer = Uint8Array.from(atob(publicKeyData), (c) =>
          c.charCodeAt(0),
        );
        publicKey = await window.crypto.subtle.importKey(
          "spki",
          publicKeyBuffer,
          {
            name: "RSA-OAEP",
            hash: "SHA-256",
          },
          true,
          ["encrypt"],
        );
      } catch (publicKeyError) {
        console.error("Failed to import public key:", publicKeyError);
        // Clear corrupted keys and return null
        await this.clearStoredKeys(userId);
        return null;
      }

      try {
        // Import private key
        const privateKeyBuffer = Uint8Array.from(atob(privateKeyData), (c) =>
          c.charCodeAt(0),
        );
        privateKey = await window.crypto.subtle.importKey(
          "pkcs8",
          privateKeyBuffer,
          {
            name: "RSA-OAEP",
            hash: "SHA-256",
          },
          true,
          ["decrypt"],
        );
      } catch (privateKeyError) {
        console.error("Failed to import private key:", privateKeyError);
        // Clear corrupted keys and return null
        await this.clearStoredKeys(userId);
        return null;
      }

      return {publicKey, privateKey};
    } catch (error) {
      console.error("Error retrieving stored keys:", error);
      // Clear potentially corrupted keys
      await this.clearStoredKeys(userId);
      return null;
    }
  }

  /**
   * Clear stored keys (for logout) - clears both old and new naming conventions
   */
  clearStoredKeys(userId: string): void {
    // Clear new naming convention
    localStorage.removeItem(`publicKey_${userId}`);
    localStorage.removeItem(`privateKey_${userId}`);

    // Clear old naming convention for backward compatibility
    localStorage.removeItem(`encryptionPublicKey_${userId}`);
    localStorage.removeItem(`encryptionPrivateKey_${userId}`);
  }
}
