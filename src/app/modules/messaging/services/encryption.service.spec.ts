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
import {TestBed} from "@angular/core/testing";
import {
  EncryptionService,
  KeyPair,
  EncryptedMessage,
} from "./encryption.service";
import {SecureKeyStorageService} from "./secure-key-storage.service";

describe("EncryptionService", () => {
  let service: EncryptionService;
  let secureKeyStorage: jasmine.SpyObj<SecureKeyStorageService>;

  beforeEach(async () => {
    // Create spy object for SecureKeyStorageService
    const secureKeyStorageSpy = jasmine.createSpyObj(
      "SecureKeyStorageService",
      ["storeKeyPair", "getKeyPair", "clearKeys", "migrateFromLocalStorage"],
    );

    await TestBed.configureTestingModule({
      providers: [
        EncryptionService,
        {provide: SecureKeyStorageService, useValue: secureKeyStorageSpy},
      ],
    });

    service = TestBed.inject(EncryptionService);
    secureKeyStorage = TestBed.inject(
      SecureKeyStorageService,
    ) as jasmine.SpyObj<SecureKeyStorageService>;
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("AES Key Generation", () => {
    it("should generate a valid AES-256-GCM message key", async () => {
      const messageKey = await service.generateMessageKey();

      expect(messageKey).toBeTruthy();
      expect(messageKey.type).toBe("secret");
      expect(messageKey.algorithm.name).toBe("AES-GCM");
      expect((messageKey.algorithm as AesKeyAlgorithm).length).toBe(256);
      expect(messageKey.extractable).toBe(true);
      expect(messageKey.usages).toContain("encrypt");
      expect(messageKey.usages).toContain("decrypt");
    });

    it("should generate unique keys each time", async () => {
      const key1 = await service.generateMessageKey();
      const key2 = await service.generateMessageKey();

      const key1Bytes = await crypto.subtle.exportKey("raw", key1);
      const key2Bytes = await crypto.subtle.exportKey("raw", key2);

      expect(new Uint8Array(key1Bytes)).not.toEqual(new Uint8Array(key2Bytes));
    });
  });

  describe("RSA Key Pair Generation", () => {
    it("should generate a valid RSA-OAEP-2048 key pair", async () => {
      const keyPair = await service.generateKeyPair();

      expect(keyPair).toBeTruthy();
      expect(keyPair.publicKey).toBeTruthy();
      expect(keyPair.privateKey).toBeTruthy();
      expect(keyPair.publicKey.type).toBe("public");
      expect(keyPair.privateKey.type).toBe("private");
      expect(keyPair.publicKey.algorithm.name).toBe("RSA-OAEP");
      expect(keyPair.privateKey.algorithm.name).toBe("RSA-OAEP");
      expect(
        (keyPair.publicKey.algorithm as RsaHashedKeyAlgorithm).modulusLength,
      ).toBe(2048);
    });

    it("should generate extractable keys", async () => {
      const keyPair = await service.generateKeyPair();

      expect(keyPair.publicKey.extractable).toBe(true);
      expect(keyPair.privateKey.extractable).toBe(true);
    });

    it("should generate keys with correct usages", async () => {
      const keyPair = await service.generateKeyPair();

      expect(keyPair.publicKey.usages).toContain("encrypt");
      expect(keyPair.privateKey.usages).toContain("decrypt");
    });
  });

  describe("Public Key Export/Import", () => {
    let keyPair: KeyPair;

    beforeEach(async () => {
      keyPair = await service.generateKeyPair();
    });

    it("should export public key to base64 string", async () => {
      const exportedKey = await service.exportPublicKey(keyPair.publicKey);

      expect(exportedKey).toBeTruthy();
      expect(typeof exportedKey).toBe("string");
      expect(exportedKey.length).toBeGreaterThan(300); // RSA-2048 public key is ~300+ chars in base64
    });

    it("should import public key from base64 string", async () => {
      const exportedKey = await service.exportPublicKey(keyPair.publicKey);
      const importedKey = await service.importPublicKey(exportedKey);

      expect(importedKey).toBeTruthy();
      expect(importedKey.type).toBe("public");
      expect(importedKey.algorithm.name).toBe("RSA-OAEP");
      expect(importedKey.usages).toContain("encrypt");
    });

    it("should round-trip export and import correctly", async () => {
      const exportedKey = await service.exportPublicKey(keyPair.publicKey);
      const importedKey = await service.importPublicKey(exportedKey);

      // Verify by encrypting with imported key and decrypting with original private key
      const testData = new TextEncoder().encode("test data");
      const encrypted = await crypto.subtle.encrypt(
        {name: "RSA-OAEP"},
        importedKey,
        testData,
      );
      const decrypted = await crypto.subtle.decrypt(
        {name: "RSA-OAEP"},
        keyPair.privateKey,
        encrypted,
      );

      expect(new Uint8Array(decrypted)).toEqual(testData);
    });

    it("should throw error when importing invalid key string", async () => {
      await expectAsync(
        service.importPublicKey("invalid-key-string"),
      ).toBeRejected();
    });
  });

  describe("Message Encryption/Decryption", () => {
    let messageKey: CryptoKey;
    const testMessage = "This is a secret message 🔒";

    beforeEach(async () => {
      messageKey = await service.generateMessageKey();
    });

    it("should encrypt a message successfully", async () => {
      const encrypted = await service.encryptMessage(testMessage, messageKey);

      expect(encrypted).toBeTruthy();
      expect(encrypted.encryptedContent).toBeTruthy();
      expect(encrypted.iv).toBeTruthy();
      expect(encrypted.keyFingerprint).toBeTruthy();
      expect(encrypted.algorithm).toBe("AES-GCM");
      expect(encrypted.encryptedContent).not.toBe(testMessage);
    });

    it("should generate unique IV for each encryption", async () => {
      const encrypted1 = await service.encryptMessage(testMessage, messageKey);
      const encrypted2 = await service.encryptMessage(testMessage, messageKey);

      expect(encrypted1.iv).not.toBe(encrypted2.iv);
      expect(encrypted1.encryptedContent).not.toBe(encrypted2.encryptedContent);
    });

    it("should decrypt a message successfully", async () => {
      const encrypted = await service.encryptMessage(testMessage, messageKey);
      const decrypted = await service.decryptMessage(encrypted, messageKey);

      expect(decrypted).toBe(testMessage);
    });

    it("should handle Unicode characters correctly", async () => {
      const unicodeMessage = "Hello 世界 🌍 Привет مرحبا";
      const encrypted = await service.encryptMessage(
        unicodeMessage,
        messageKey,
      );
      const decrypted = await service.decryptMessage(encrypted, messageKey);

      expect(decrypted).toBe(unicodeMessage);
    });

    it("should handle empty strings", async () => {
      const emptyMessage = "";
      const encrypted = await service.encryptMessage(emptyMessage, messageKey);
      const decrypted = await service.decryptMessage(encrypted, messageKey);

      expect(decrypted).toBe(emptyMessage);
    });

    it("should throw error when decrypting with wrong key", async () => {
      const encrypted = await service.encryptMessage(testMessage, messageKey);
      const wrongKey = await service.generateMessageKey();

      await expectAsync(
        service.decryptMessage(encrypted, wrongKey),
      ).toBeRejectedWithError(/Key fingerprint mismatch/);
    });

    it("should throw error when decrypting corrupted data", async () => {
      const encrypted = await service.encryptMessage(testMessage, messageKey);
      encrypted.encryptedContent = "corrupted-data";

      await expectAsync(
        service.decryptMessage(encrypted, messageKey),
      ).toBeRejectedWithError(/Decryption failed/);
    });

    it("should throw error when IV is corrupted", async () => {
      const encrypted = await service.encryptMessage(testMessage, messageKey);
      encrypted.iv = "invalid-iv";

      await expectAsync(
        service.decryptMessage(encrypted, messageKey),
      ).toBeRejectedWithError(/Decryption failed/);
    });
  });

  describe("Key Wrapping (RSA-OAEP)", () => {
    let senderKeyPair: KeyPair;
    let recipientKeyPair: KeyPair;
    let messageKey: CryptoKey;

    beforeEach(async () => {
      senderKeyPair = await service.generateKeyPair();
      recipientKeyPair = await service.generateKeyPair();
      messageKey = await service.generateMessageKey();
    });

    it("should encrypt message key with recipient's public key", async () => {
      const encryptedKey = await service.encryptKeyForRecipient(
        messageKey,
        recipientKeyPair.publicKey,
      );

      expect(encryptedKey).toBeTruthy();
      expect(typeof encryptedKey).toBe("string");
      expect(encryptedKey.length).toBeGreaterThan(300);
    });

    it("should decrypt message key with recipient's private key", async () => {
      const encryptedKey = await service.encryptKeyForRecipient(
        messageKey,
        recipientKeyPair.publicKey,
      );
      const decryptedKey = await service.decryptKeyFromSender(
        encryptedKey,
        recipientKeyPair.privateKey,
      );

      expect(decryptedKey).toBeTruthy();
      expect(decryptedKey.type).toBe("secret");
      expect(decryptedKey.algorithm.name).toBe("AES-GCM");
    });

    it("should successfully use decrypted key to decrypt messages", async () => {
      const testMessage = "Secret message";

      // Encrypt the message with original key
      const encryptedMessage = await service.encryptMessage(
        testMessage,
        messageKey,
      );

      // Wrap the message key for recipient
      const encryptedKey = await service.encryptKeyForRecipient(
        messageKey,
        recipientKeyPair.publicKey,
      );

      // Recipient unwraps the key
      const unwrappedKey = await service.decryptKeyFromSender(
        encryptedKey,
        recipientKeyPair.privateKey,
      );

      // Recipient decrypts the message
      const decryptedMessage = await service.decryptMessage(
        encryptedMessage,
        unwrappedKey,
      );

      expect(decryptedMessage).toBe(testMessage);
    });

    it("should fail to decrypt with wrong private key", async () => {
      const encryptedKey = await service.encryptKeyForRecipient(
        messageKey,
        recipientKeyPair.publicKey,
      );

      await expectAsync(
        service.decryptKeyFromSender(encryptedKey, senderKeyPair.privateKey),
      ).toBeRejected();
    });
  });

  describe("Public Key Fingerprint", () => {
    let keyPair: KeyPair;

    beforeEach(async () => {
      keyPair = await service.generateKeyPair();
    });

    it("should generate fingerprint in correct format (XXXX XXXX XXXX XXXX)", async () => {
      const fingerprint = await service.getPublicKeyFingerprint(
        keyPair.publicKey,
      );

      expect(fingerprint).toBeTruthy();
      expect(fingerprint).toMatch(
        /^[0-9A-F]{4} [0-9A-F]{4} [0-9A-F]{4} [0-9A-F]{4}$/,
      );
    });

    it("should generate consistent fingerprints for same key", async () => {
      const fingerprint1 = await service.getPublicKeyFingerprint(
        keyPair.publicKey,
      );
      const fingerprint2 = await service.getPublicKeyFingerprint(
        keyPair.publicKey,
      );

      expect(fingerprint1).toBe(fingerprint2);
    });

    it("should generate different fingerprints for different keys", async () => {
      const keyPair2 = await service.generateKeyPair();

      const fingerprint1 = await service.getPublicKeyFingerprint(
        keyPair.publicKey,
      );
      const fingerprint2 = await service.getPublicKeyFingerprint(
        keyPair2.publicKey,
      );

      expect(fingerprint1).not.toBe(fingerprint2);
    });

    it("should have 16 hex characters (excluding spaces)", async () => {
      const fingerprint = await service.getPublicKeyFingerprint(
        keyPair.publicKey,
      );
      const hexChars = fingerprint.replace(/\s/g, "");

      expect(hexChars.length).toBe(16);
    });
  });

  describe("Key Storage (IndexedDB Integration)", () => {
    let keyPair: KeyPair;
    const userId = "test-user-123";

    beforeEach(async () => {
      keyPair = await service.generateKeyPair();
      secureKeyStorage.storeKeyPair.and.returnValue(Promise.resolve());
      secureKeyStorage.getKeyPair.and.returnValue(Promise.resolve(keyPair));
      secureKeyStorage.clearKeys.and.returnValue(Promise.resolve());
      secureKeyStorage.migrateFromLocalStorage.and.returnValue(
        Promise.resolve(false),
      );
    });

    it("should store key pair successfully", async () => {
      await service.storeKeyPair(keyPair, userId);

      expect(secureKeyStorage.storeKeyPair).toHaveBeenCalledWith(
        userId,
        keyPair.publicKey,
        keyPair.privateKey,
      );
    });

    it("should emit keysChanged event on successful storage", async () => {
      let emittedEvent: any = null;
      service.keysChanged$.subscribe((event) => {
        emittedEvent = event;
      });

      await service.storeKeyPair(keyPair, userId);

      expect(emittedEvent).toEqual({userId, action: "restored"});
    });

    it("should retrieve stored key pair", async () => {
      const retrievedKeyPair = await service.getStoredKeyPair(userId);

      expect(secureKeyStorage.getKeyPair).toHaveBeenCalledWith(userId);
      expect(retrievedKeyPair).toEqual(keyPair);
    });

    it("should attempt migration if keys not found in IndexedDB", async () => {
      secureKeyStorage.getKeyPair.and.returnValue(Promise.resolve(null));
      secureKeyStorage.migrateFromLocalStorage.and.returnValue(
        Promise.resolve(true),
      );
      secureKeyStorage.getKeyPair.and.returnValues(
        Promise.resolve(null),
        Promise.resolve(keyPair),
      );

      const retrievedKeyPair = await service.getStoredKeyPair(userId);

      expect(secureKeyStorage.migrateFromLocalStorage).toHaveBeenCalledWith(
        userId,
      );
      expect(retrievedKeyPair).toEqual(keyPair);
    });

    it("should return null if no keys found and migration fails", async () => {
      secureKeyStorage.getKeyPair.and.returnValue(Promise.resolve(null));
      secureKeyStorage.migrateFromLocalStorage.and.returnValue(
        Promise.resolve(false),
      );

      const retrievedKeyPair = await service.getStoredKeyPair(userId);

      expect(retrievedKeyPair).toBeNull();
    });

    it("should clear keys on error during retrieval", async () => {
      secureKeyStorage.getKeyPair.and.returnValue(
        Promise.reject(new Error("Corruption")),
      );
      secureKeyStorage.clearKeys.and.returnValue(Promise.resolve());

      const retrievedKeyPair = await service.getStoredKeyPair(userId);

      expect(secureKeyStorage.clearKeys).toHaveBeenCalledWith(userId);
      expect(retrievedKeyPair).toBeNull();
    });

    it("should get stored public key fingerprint", async () => {
      const fingerprint = await service.getStoredPublicKeyFingerprint(userId);

      expect(fingerprint).toBeTruthy();
      expect(fingerprint).toMatch(
        /^[0-9A-F]{4} [0-9A-F]{4} [0-9A-F]{4} [0-9A-F]{4}$/,
      );
    });

    it("should return null if no stored keys for fingerprint", async () => {
      secureKeyStorage.getKeyPair.and.returnValue(Promise.resolve(null));
      secureKeyStorage.migrateFromLocalStorage.and.returnValue(
        Promise.resolve(false),
      );

      const fingerprint = await service.getStoredPublicKeyFingerprint(userId);

      expect(fingerprint).toBeNull();
    });
  });

  describe("Key Clearing", () => {
    const userId = "test-user-123";

    beforeEach(() => {
      secureKeyStorage.clearKeys.and.returnValue(Promise.resolve());
      // Setup localStorage with test data
      localStorage.setItem(`publicKey_${userId}`, "test-public-key");
      localStorage.setItem(`privateKey_${userId}`, "test-private-key");
      localStorage.setItem(`encryptionPublicKey_${userId}`, "test-enc-public");
      localStorage.setItem(
        `encryptionPrivateKey_${userId}`,
        "test-enc-private",
      );
    });

    it("should clear keys from IndexedDB", async () => {
      await service.clearStoredKeys(userId);

      expect(secureKeyStorage.clearKeys).toHaveBeenCalledWith(userId);
    });

    it("should clear legacy localStorage keys", async () => {
      await service.clearStoredKeys(userId);

      expect(localStorage.getItem(`publicKey_${userId}`)).toBeNull();
      expect(localStorage.getItem(`privateKey_${userId}`)).toBeNull();
      expect(localStorage.getItem(`encryptionPublicKey_${userId}`)).toBeNull();
      expect(localStorage.getItem(`encryptionPrivateKey_${userId}`)).toBeNull();
    });

    it("should emit keysChanged event after clearing", async () => {
      let emittedEvent: any = null;
      service.keysChanged$.subscribe((event) => {
        emittedEvent = event;
      });

      await service.clearStoredKeys(userId);

      expect(emittedEvent).toEqual({userId, action: "cleared"});
    });

    it("should throw error if clearing fails", async () => {
      secureKeyStorage.clearKeys.and.returnValue(
        Promise.reject(new Error("Clear failed")),
      );

      await expectAsync(service.clearStoredKeys(userId)).toBeRejectedWithError(
        "Clear failed",
      );
    });
  });

  describe("PBKDF2 Key Derivation", () => {
    const password = "MySecurePassword123!";
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const iterations = 100000;

    it("should derive key from password using PBKDF2", async () => {
      const derivedKey = await service.deriveKeyFromPassword(
        password,
        salt,
        iterations,
      );

      expect(derivedKey).toBeTruthy();
      expect(derivedKey.type).toBe("secret");
      expect(derivedKey.algorithm.name).toBe("AES-GCM");
      expect((derivedKey.algorithm as AesKeyAlgorithm).length).toBe(256);
      expect(derivedKey.extractable).toBe(false); // Security: should not be extractable
      expect(derivedKey.usages).toContain("encrypt");
      expect(derivedKey.usages).toContain("decrypt");
    });

    it("should derive same key with same password and salt", async () => {
      const key1 = await service.deriveKeyFromPassword(
        password,
        salt,
        iterations,
      );
      const key2 = await service.deriveKeyFromPassword(
        password,
        salt,
        iterations,
      );

      // Test by encrypting/decrypting with both keys
      const testData = "test data";
      const encrypted = await service.encryptWithDerivedKey(testData, key1);
      const decrypted = await service.decryptWithDerivedKey(
        encrypted.encryptedData,
        key2,
        encrypted.iv,
      );

      expect(decrypted).toBe(testData);
    });

    it("should derive different keys with different passwords", async () => {
      const key1 = await service.deriveKeyFromPassword(
        password,
        salt,
        iterations,
      );
      const key2 = await service.deriveKeyFromPassword(
        "DifferentPassword",
        salt,
        iterations,
      );

      const testData = "test data";
      const encrypted = await service.encryptWithDerivedKey(testData, key1);

      await expectAsync(
        service.decryptWithDerivedKey(
          encrypted.encryptedData,
          key2,
          encrypted.iv,
        ),
      ).toBeRejectedWithError(/Password\/passphrase may be incorrect/);
    });

    it("should derive different keys with different salts", async () => {
      const salt2 = crypto.getRandomValues(new Uint8Array(32));
      const key1 = await service.deriveKeyFromPassword(
        password,
        salt,
        iterations,
      );
      const key2 = await service.deriveKeyFromPassword(
        password,
        salt2,
        iterations,
      );

      const testData = "test data";
      const encrypted = await service.encryptWithDerivedKey(testData, key1);

      await expectAsync(
        service.decryptWithDerivedKey(
          encrypted.encryptedData,
          key2,
          encrypted.iv,
        ),
      ).toBeRejectedWithError(/Password\/passphrase may be incorrect/);
    });
  });

  describe("Derived Key Encryption/Decryption", () => {
    let derivedKey: CryptoKey;
    const testData = "Sensitive data to protect 🔐";

    beforeEach(async () => {
      const password = "SecurePassword123!";
      const salt = crypto.getRandomValues(new Uint8Array(32));
      derivedKey = await service.deriveKeyFromPassword(password, salt, 100000);
    });

    it("should encrypt data with derived key", async () => {
      const result = await service.encryptWithDerivedKey(testData, derivedKey);

      expect(result).toBeTruthy();
      expect(result.encryptedData).toBeTruthy();
      expect(result.iv).toBeTruthy();
      expect(result.encryptedData).not.toBe(testData);
    });

    it("should generate unique IV for each encryption", async () => {
      const result1 = await service.encryptWithDerivedKey(testData, derivedKey);
      const result2 = await service.encryptWithDerivedKey(testData, derivedKey);

      expect(result1.iv).not.toBe(result2.iv);
      expect(result1.encryptedData).not.toBe(result2.encryptedData);
    });

    it("should decrypt data with derived key", async () => {
      const encrypted = await service.encryptWithDerivedKey(
        testData,
        derivedKey,
      );
      const decrypted = await service.decryptWithDerivedKey(
        encrypted.encryptedData,
        derivedKey,
        encrypted.iv,
      );

      expect(decrypted).toBe(testData);
    });

    it("should handle Unicode in derived key encryption", async () => {
      const unicodeData = "Hello 世界 🌍 مرحبا";
      const encrypted = await service.encryptWithDerivedKey(
        unicodeData,
        derivedKey,
      );
      const decrypted = await service.decryptWithDerivedKey(
        encrypted.encryptedData,
        derivedKey,
        encrypted.iv,
      );

      expect(decrypted).toBe(unicodeData);
    });

    it("should throw error when decrypting with wrong key", async () => {
      const encrypted = await service.encryptWithDerivedKey(
        testData,
        derivedKey,
      );

      // Create a different key
      const wrongKey = await service.deriveKeyFromPassword(
        "WrongPassword",
        crypto.getRandomValues(new Uint8Array(32)),
        100000,
      );

      await expectAsync(
        service.decryptWithDerivedKey(
          encrypted.encryptedData,
          wrongKey,
          encrypted.iv,
        ),
      ).toBeRejectedWithError(/Password\/passphrase may be incorrect/);
    });

    it("should throw error when IV is corrupted", async () => {
      const encrypted = await service.encryptWithDerivedKey(
        testData,
        derivedKey,
      );

      await expectAsync(
        service.decryptWithDerivedKey(
          encrypted.encryptedData,
          derivedKey,
          "invalid-iv",
        ),
      ).toBeRejectedWithError(/Password\/passphrase may be incorrect/);
    });
  });

  describe("Observable Events", () => {
    const userId = "test-user-123";
    let keyPair: KeyPair;

    beforeEach(async () => {
      keyPair = await service.generateKeyPair();
      secureKeyStorage.storeKeyPair.and.returnValue(Promise.resolve());
      secureKeyStorage.clearKeys.and.returnValue(Promise.resolve());
    });

    it("should emit restored event when keys are stored", (done) => {
      service.keysChanged$.subscribe((event) => {
        expect(event.userId).toBe(userId);
        expect(event.action).toBe("restored");
        done();
      });

      service.storeKeyPair(keyPair, userId);
    });

    it("should emit cleared event when keys are cleared", (done) => {
      service.keysChanged$.subscribe((event) => {
        expect(event.userId).toBe(userId);
        expect(event.action).toBe("cleared");
        done();
      });

      service.clearStoredKeys(userId);
    });

    it("should allow multiple subscribers", async () => {
      const events: any[] = [];

      service.keysChanged$.subscribe((event) =>
        events.push({subscriber: 1, ...event}),
      );
      service.keysChanged$.subscribe((event) =>
        events.push({subscriber: 2, ...event}),
      );

      await service.storeKeyPair(keyPair, userId);

      expect(events.length).toBe(2);
      expect(events[0].subscriber).toBe(1);
      expect(events[1].subscriber).toBe(2);
      expect(events[0].action).toBe("restored");
      expect(events[1].action).toBe("restored");
    });
  });

  describe("End-to-End Encryption Flow", () => {
    it("should complete full E2EE message flow", async () => {
      // Setup: Generate keys for sender and recipient
      const senderKeyPair = await service.generateKeyPair();
      const recipientKeyPair = await service.generateKeyPair();
      const message = "Top secret message 🔐";

      // Step 1: Sender generates message key
      const messageKey = await service.generateMessageKey();

      // Step 2: Sender encrypts message
      const encryptedMessage = await service.encryptMessage(
        message,
        messageKey,
      );

      // Step 3: Sender wraps message key for recipient
      const wrappedKey = await service.encryptKeyForRecipient(
        messageKey,
        recipientKeyPair.publicKey,
      );

      // Step 4: Recipient unwraps message key
      const unwrappedKey = await service.decryptKeyFromSender(
        wrappedKey,
        recipientKeyPair.privateKey,
      );

      // Step 5: Recipient decrypts message
      const decryptedMessage = await service.decryptMessage(
        encryptedMessage,
        unwrappedKey,
      );

      // Verify
      expect(decryptedMessage).toBe(message);
    });

    it("should fail if wrong recipient tries to decrypt", async () => {
      const senderKeyPair = await service.generateKeyPair();
      const recipientKeyPair = await service.generateKeyPair();
      const wrongRecipientKeyPair = await service.generateKeyPair();
      const message = "Secret";

      const messageKey = await service.generateMessageKey();
      const encryptedMessage = await service.encryptMessage(
        message,
        messageKey,
      );
      const wrappedKey = await service.encryptKeyForRecipient(
        messageKey,
        recipientKeyPair.publicKey,
      );

      // Wrong recipient tries to unwrap
      await expectAsync(
        service.decryptKeyFromSender(
          wrappedKey,
          wrongRecipientKeyPair.privateKey,
        ),
      ).toBeRejected();
    });
  });
});
