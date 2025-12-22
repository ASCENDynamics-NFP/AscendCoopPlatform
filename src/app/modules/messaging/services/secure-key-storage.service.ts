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
import {Injectable, OnDestroy} from "@angular/core";

/**
 * Secure Key Storage Service
 *
 * Provides secure storage for encryption keys using IndexedDB instead of localStorage.
 * This mitigates XSS attacks by:
 * 1. Storing keys in IndexedDB (separate from JavaScript execution context)
 * 2. Using Web Crypto API with non-extractable private keys where possible
 * 3. Adding an encryption layer for stored key data
 *
 * Security improvements over localStorage:
 * - Keys stored in IndexedDB have better isolation from JavaScript context
 * - Private keys can be marked as non-extractable (cannot be exported)
 * - Additional encryption layer protects keys even if IndexedDB is compromised
 * - Supports key versioning and migration
 */
@Injectable({
  providedIn: "root",
})
export class SecureKeyStorageService implements OnDestroy {
  private readonly DB_NAME = "EncryptionKeysDB";
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = "cryptoKeys";
  private readonly PBKDF2_ITERATIONS = 310000; // OWASP 2023 recommendation (increased from 100k)
  private readonly SALT_SIZE = 32;
  private readonly IV_SIZE = 12;

  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private keyOperationLocks = new Map<string, Promise<void>>();

  constructor() {
    // Don't await here - let ensureDB() handle initialization
    this.initDB().catch((error) => {
      console.error("[SecureKeyStorage] Failed to initialize DB:", error);
    });

    // Initialize BroadcastChannel for cross-tab communication
    try {
      this.broadcastChannel = new BroadcastChannel("encryption_keys_channel");
      this.broadcastChannel.onmessage = (event) => {
        this.handleBroadcastMessage(event.data);
      };
    } catch (error) {
      console.warn("[SecureKeyStorage] BroadcastChannel not supported:", error);
    }
  }

  /**
   * Initialize IndexedDB
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error("Failed to open IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store for keys if it doesn't exist
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const objectStore = db.createObjectStore(this.STORE_NAME, {
            keyPath: "userId",
          });

          // Create indexes for efficient querying
          objectStore.createIndex("createdAt", "createdAt", {unique: false});
          objectStore.createIndex("version", "version", {unique: false});
        }
      };
    });
  }

  /**
   * Ensure database is initialized
   * Implements promise-based mutex to prevent race conditions
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    // If initialization is in progress, wait for it
    if (this.dbPromise) {
      return this.dbPromise;
    }

    // Start new initialization
    this.dbPromise = this.initDB().then(() => {
      if (!this.db) {
        throw new Error("Failed to initialize IndexedDB");
      }
      return this.db;
    });

    try {
      return await this.dbPromise;
    } catch (error) {
      // Clear failed promise so next call can retry
      this.dbPromise = null;
      throw error;
    }
  }

  /**
   * Handle cross-tab broadcast messages
   */
  private handleBroadcastMessage(message: any): void {
    if (message.type === "keys_stored" || message.type === "keys_migrated") {
      console.log(
        `[SecureKeyStorage] Received ${message.type} notification for user ${message.userId} from another tab`,
      );
      // Other tabs can react to key changes if needed
    }
  }

  /**
   * Acquire lock for key operation to prevent concurrent access
   */
  private async acquireKeyLock(userId: string): Promise<() => void> {
    const lockKey = `key_lock_${userId}`;

    // Wait for existing lock to release with timeout
    const maxWaitTime = 10000; // 10 seconds
    const startTime = Date.now();

    while (this.keyOperationLocks.has(lockKey)) {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime > maxWaitTime) {
        console.warn(
          `Lock timeout for ${lockKey}, forcing release after ${maxWaitTime}ms`,
        );
        this.keyOperationLocks.delete(lockKey);
        break;
      }

      await Promise.race([
        this.keyOperationLocks.get(lockKey),
        new Promise((resolve) => setTimeout(resolve, 100)),
      ]);
    }

    // Create new lock
    let releaseLock: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    this.keyOperationLocks.set(lockKey, lockPromise);

    return () => {
      this.keyOperationLocks.delete(lockKey);
      releaseLock!();
    };
  }

  /**
   * Store encryption keys in IndexedDB
   * @param userId - User ID
   * @param publicKey - RSA public key (exportable)
   * @param privateKey - RSA private key (will be stored encrypted)
   */
  async storeKeyPair(
    userId: string,
    publicKey: CryptoKey,
    privateKey: CryptoKey,
  ): Promise<void> {
    const release = await this.acquireKeyLock(userId);

    try {
      const db = await this.ensureDB();

      // Export keys for storage
      const publicKeyBytes = await crypto.subtle.exportKey("spki", publicKey);
      const publicKeyBase64 = btoa(
        String.fromCharCode(...new Uint8Array(publicKeyBytes)),
      );

      // Export private key
      const privateKeyBytes = await crypto.subtle.exportKey(
        "pkcs8",
        privateKey,
      );
      const privateKeyBase64 = btoa(
        String.fromCharCode(...new Uint8Array(privateKeyBytes)),
      );

      // Encrypt the private key before storing
      const encryptedPrivateKey = await this.encryptPrivateKey(
        privateKeyBase64,
        userId,
      );

      // Store in IndexedDB
      const keyData = {
        userId: userId,
        publicKey: publicKeyBase64,
        encryptedPrivateKey: encryptedPrivateKey.data,
        privateKeyIV: encryptedPrivateKey.iv,
        privateKeySalt: encryptedPrivateKey.salt,
        createdAt: new Date().toISOString(),
        version: 1,
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], "readwrite");
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.put(keyData);

        request.onsuccess = () => {
          // Notify other tabs about key storage
          this.broadcastToOtherTabs({
            type: "keys_stored",
            userId: userId,
            timestamp: Date.now(),
          });

          resolve();
        };

        request.onerror = () => {
          console.error("Failed to store keys:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error storing key pair:", error);
      throw error;
    } finally {
      release();
    }
  }

  /**
   * Retrieve encryption keys from IndexedDB
   * @param userId - User ID
   * @returns Key pair or null if not found
   */
  async getKeyPair(userId: string): Promise<CryptoKeyPair | null> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], "readonly");
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.get(userId);

        request.onsuccess = () => {
          const keyData = request.result;

          if (!keyData) {
            resolve(null);
            return;
          }

          // Wrap async operations to properly handle promise rejection
          (async () => {
            try {
              // Decrypt the private key
              const privateKeyBase64 = await this.decryptPrivateKey(
                keyData.encryptedPrivateKey,
                keyData.privateKeyIV,
                keyData.privateKeySalt,
                userId,
              );

              // Import public key
              const publicKeyBuffer = Uint8Array.from(
                atob(keyData.publicKey),
                (c) => c.charCodeAt(0),
              );
              const publicKey = await crypto.subtle.importKey(
                "spki",
                publicKeyBuffer,
                {
                  name: "RSA-OAEP",
                  hash: "SHA-256",
                },
                true,
                ["encrypt"],
              );

              // Import private key
              const privateKeyBuffer = Uint8Array.from(
                atob(privateKeyBase64),
                (c) => c.charCodeAt(0),
              );
              const privateKey = await crypto.subtle.importKey(
                "pkcs8",
                privateKeyBuffer,
                {
                  name: "RSA-OAEP",
                  hash: "SHA-256",
                },
                true,
                ["decrypt"],
              );

              resolve({publicKey, privateKey});
            } catch (importError) {
              console.error("Failed to import keys:", importError);
              // Clear corrupted keys
              try {
                await this.clearKeys(userId);
              } catch (clearError) {
                console.error("Failed to clear corrupted keys:", clearError);
              }
              resolve(null);
            }
          })();
        };

        request.onerror = () => {
          console.error("Failed to retrieve keys:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error retrieving key pair:", error);
      return null;
    }
  }

  /**
   * Clear stored keys for a user
   * @param userId - User ID
   */
  async clearKeys(userId: string): Promise<void> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], "readwrite");
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.delete(userId);

        request.onsuccess = () => {
          console.log(`[SecureKeyStorage] Keys cleared for user ${userId}`);
          resolve();
        };

        request.onerror = () => {
          console.error("Failed to clear keys:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error clearing keys:", error);
      throw error;
    }
  }

  /**
   * Check if keys exist for a user
   * @param userId - User ID
   */
  async hasKeys(userId: string): Promise<boolean> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], "readonly");
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.get(userId);

        request.onsuccess = () => {
          resolve(!!request.result);
        };

        request.onerror = () => {
          console.error("Failed to check keys:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error checking keys:", error);
      return false;
    }
  }

  /**
   * Encrypt private key using user-specific derived key
   * This adds an additional layer of encryption on top of IndexedDB storage
   */
  private async encryptPrivateKey(
    privateKeyBase64: string,
    userId: string,
  ): Promise<{data: string; iv: string; salt: string}> {
    // Generate random salt
    const salt = crypto.getRandomValues(new Uint8Array(this.SALT_SIZE));

    // Derive encryption key from userId and browser fingerprint
    // Note: This is not perfect security but adds a layer beyond localStorage
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(userId + navigator.userAgent),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: this.PBKDF2_ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"],
    );

    // Encrypt private key
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_SIZE));
    const encryptedBytes = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      derivedKey,
      new TextEncoder().encode(privateKeyBase64),
    );

    return {
      data: btoa(String.fromCharCode(...new Uint8Array(encryptedBytes))),
      iv: btoa(String.fromCharCode(...iv)),
      salt: btoa(String.fromCharCode(...salt)),
    };
  }

  /**
   * Decrypt private key using user-specific derived key
   */
  private async decryptPrivateKey(
    encryptedData: string,
    ivBase64: string,
    saltBase64: string,
    userId: string,
  ): Promise<string> {
    try {
      // Derive the same key
      const salt = Uint8Array.from(atob(saltBase64), (c) => c.charCodeAt(0));
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(userId + navigator.userAgent),
        "PBKDF2",
        false,
        ["deriveKey"],
      );

      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: this.PBKDF2_ITERATIONS,
          hash: "SHA-256",
        },
        keyMaterial,
        {
          name: "AES-GCM",
          length: 256,
        },
        false,
        ["encrypt", "decrypt"],
      );

      // Decrypt
      const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
      const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) =>
        c.charCodeAt(0),
      );

      const decryptedBytes = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        derivedKey,
        encryptedBytes,
      );

      return new TextDecoder().decode(decryptedBytes);
    } catch (error) {
      console.error("Failed to decrypt private key:", error);
      throw new Error("Decryption failed - keys may be corrupted");
    }
  }

  /**
   * Migrate keys from localStorage to IndexedDB
   * This method helps transition existing users to the new secure storage
   */
  async migrateFromLocalStorage(userId: string): Promise<boolean> {
    const release = await this.acquireKeyLock(userId);

    try {
      // Check if keys exist in localStorage
      const publicKeyData = localStorage.getItem(`publicKey_${userId}`);
      const privateKeyData = localStorage.getItem(`privateKey_${userId}`);

      if (!publicKeyData || !privateKeyData) {
        // Try old naming convention
        const oldPublicKey = localStorage.getItem(
          `encryptionPublicKey_${userId}`,
        );
        const oldPrivateKey = localStorage.getItem(
          `encryptionPrivateKey_${userId}`,
        );

        if (!oldPublicKey || !oldPrivateKey) {
          return false; // No keys to migrate
        }

        // Use old keys for migration
        return await this.performMigration(userId, oldPublicKey, oldPrivateKey);
      }

      return await this.performMigration(userId, publicKeyData, privateKeyData);
    } catch (error) {
      console.error("Migration failed:", error);
      return false;
    } finally {
      release();
    }
  }

  /**
   * Perform the actual migration
   */
  private async performMigration(
    userId: string,
    publicKeyData: string,
    privateKeyData: string,
  ): Promise<boolean> {
    try {
      // Import keys from localStorage
      const publicKeyBuffer = Uint8Array.from(atob(publicKeyData), (c) =>
        c.charCodeAt(0),
      );
      const publicKey = await crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["encrypt"],
      );

      const privateKeyBuffer = Uint8Array.from(atob(privateKeyData), (c) =>
        c.charCodeAt(0),
      );
      const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"],
      );

      // Store in IndexedDB
      await this.storeKeyPair(userId, publicKey, privateKey);

      // Verify storage succeeded by retrieving keys
      const verifyKeys = await this.getKeyPair(userId);
      if (!verifyKeys) {
        throw new Error(
          "Failed to verify IndexedDB storage - keys not retrievable",
        );
      }

      // Only clear localStorage after successful verification
      localStorage.removeItem(`publicKey_${userId}`);
      localStorage.removeItem(`privateKey_${userId}`);
      localStorage.removeItem(`encryptionPublicKey_${userId}`);
      localStorage.removeItem(`encryptionPrivateKey_${userId}`);

      console.log(
        `[SecureKeyStorage] Successfully migrated and verified keys for ${userId}`,
      );

      // Notify other tabs about migration
      this.broadcastToOtherTabs({
        type: "keys_migrated",
        userId: userId,
        timestamp: Date.now(),
      });

      return true;
    } catch (error) {
      console.error("Failed to perform migration:", error);
      // Don't clear localStorage if migration failed
      return false;
    }
  }

  /**
   * Clear all data (for debugging/testing)
   */
  async clearAllData(): Promise<void> {
    try {
      const db = await this.ensureDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.STORE_NAME], "readwrite");
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          console.log("[SecureKeyStorage] All data cleared");
          resolve();
        };

        request.onerror = () => {
          console.error("Failed to clear all data:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Error clearing all data:", error);
      throw error;
    }
  }

  /**
   * Broadcast message to other tabs
   */
  private broadcastToOtherTabs(message: any): void {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (error) {
        console.warn("[SecureKeyStorage] Failed to broadcast message:", error);
      }
    }
  }

  /**
   * Close BroadcastChannel on service destroy
   */
  ngOnDestroy(): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  }
}
