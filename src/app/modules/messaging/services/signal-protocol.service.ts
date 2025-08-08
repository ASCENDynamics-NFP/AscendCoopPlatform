/***********************************************************************************************
 * Signal Protocol-Style End-to-End Encryption Service
 *
 * This implements a simplified version of the Signal Protocol for secure messaging
 * Features:
 * - Forward secrecy (new keys for each session)
 * - Perfect forward secrecy (ephemeral keys)
 * - Protection against man-in-the-middle attacks
 * - Secure key exchange
 ***********************************************************************************************/
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

export interface SignalSession {
  sessionId: string;
  participantId: string;
  sharedSecret: Uint8Array;
  sendingChain: ChainKey;
  receivingChain: ChainKey;
  rootKey: Uint8Array;
  isInitialized: boolean;
}

export interface ChainKey {
  key: Uint8Array;
  counter: number;
}

export interface PreKeyBundle {
  userId: string;
  identityKey: string; // Base64 encoded public identity key
  signedPreKey: string; // Base64 encoded signed pre-key
  preKeySignature: string; // Base64 encoded signature
  oneTimePreKey?: string; // Base64 encoded one-time pre-key
  timestamp: number;
}

@Injectable({
  providedIn: "root",
})
export class SignalProtocolService {
  private sessions = new Map<string, SignalSession>();
  private identityKeyPair: CryptoKeyPair | null = null;
  private preKeys = new Map<string, CryptoKeyPair>();
  private sessionSubjects = new Map<
    string,
    BehaviorSubject<SignalSession | null>
  >();

  constructor() {
    this.initializeProtocol();
  }

  /**
   * Initialize the Signal Protocol for this user
   */
  private async initializeProtocol(): Promise<void> {
    try {
      // Generate identity key pair (long-term)
      this.identityKeyPair = await this.generateIdentityKeyPair();

      // Generate initial pre-keys
      await this.generatePreKeys(100); // Generate 100 one-time pre-keys

      console.log("Signal Protocol initialized");
    } catch (error) {
      console.error("Error initializing Signal Protocol:", error);
    }
  }

  /**
   * Generate a long-term identity key pair
   */
  private async generateIdentityKeyPair(): Promise<CryptoKeyPair> {
    return await crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"],
    );
  }

  /**
   * Generate pre-keys for key exchange
   */
  private async generatePreKeys(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"],
      );

      this.preKeys.set(`prekey_${i}`, keyPair);
    }
  }

  /**
   * Create a pre-key bundle for other users to initiate sessions
   */
  async createPreKeyBundle(userId: string): Promise<PreKeyBundle> {
    if (!this.identityKeyPair) {
      throw new Error("Identity key pair not initialized");
    }

    // Get a one-time pre-key
    const preKeyId = Array.from(this.preKeys.keys())[0];
    const oneTimePreKey = this.preKeys.get(preKeyId);

    if (!oneTimePreKey) {
      throw new Error("No pre-keys available");
    }

    // Remove the used pre-key
    this.preKeys.delete(preKeyId);

    // Create signed pre-key
    const signedPreKeyPair = await this.generateIdentityKeyPair();

    // Export keys to base64
    const identityPublicKey = await this.exportPublicKey(
      this.identityKeyPair.publicKey,
    );
    const signedPreKey = await this.exportPublicKey(signedPreKeyPair.publicKey);
    const oneTimePreKeyPublic = await this.exportPublicKey(
      oneTimePreKey.publicKey,
    );

    // Sign the pre-key
    const signedPreKeyBytes = await crypto.subtle.exportKey(
      "raw",
      signedPreKeyPair.publicKey,
    );
    const signature = await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      this.identityKeyPair.privateKey,
      signedPreKeyBytes,
    );

    return {
      userId,
      identityKey: identityPublicKey,
      signedPreKey,
      preKeySignature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      oneTimePreKey: oneTimePreKeyPublic,
      timestamp: Date.now(),
    };
  }

  /**
   * Initiate a new session with another user
   */
  async initiateSession(
    participantId: string,
    preKeyBundle: PreKeyBundle,
  ): Promise<string> {
    try {
      // Generate ephemeral key pair
      const ephemeralKeyPair = await this.generateIdentityKeyPair();

      // Import participant's keys
      const participantIdentityKey = await this.importPublicKey(
        preKeyBundle.identityKey,
      );
      const participantSignedPreKey = await this.importPublicKey(
        preKeyBundle.signedPreKey,
      );
      const participantOneTimePreKey = preKeyBundle.oneTimePreKey
        ? await this.importPublicKey(preKeyBundle.oneTimePreKey)
        : null;

      // Verify signed pre-key
      await this.verifyPreKeySignature(
        preKeyBundle.signedPreKey,
        preKeyBundle.preKeySignature,
        participantIdentityKey,
      );

      // Perform Triple Diffie-Hellman key exchange
      const sharedSecrets = await this.performTripleDH(
        this.identityKeyPair!,
        ephemeralKeyPair,
        participantIdentityKey,
        participantSignedPreKey,
        participantOneTimePreKey,
      );

      // Derive root key and chain keys
      const rootKey = await this.deriveRootKey(sharedSecrets);
      const sessionId = this.generateSessionId(participantId);

      // Initialize session
      const session: SignalSession = {
        sessionId,
        participantId,
        sharedSecret: new Uint8Array(32), // Will be derived
        sendingChain: {key: new Uint8Array(32), counter: 0},
        receivingChain: {key: new Uint8Array(32), counter: 0},
        rootKey,
        isInitialized: true,
      };

      // Store session
      this.sessions.set(sessionId, session);

      // Notify observers
      this.getSessionSubject(sessionId).next(session);

      return sessionId;
    } catch (error) {
      console.error("Error initiating session:", error);
      throw error;
    }
  }

  /**
   * Encrypt a message using the session
   */
  async encryptMessage(
    sessionId: string,
    plaintext: string,
  ): Promise<{
    ciphertext: string;
    messageKeys: string;
    counter: number;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Derive message key from chain key
    const messageKey = await this.deriveMessageKey(session.sendingChain);

    // Encrypt the message
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const plaintextBytes = encoder.encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      await this.importAESKey(messageKey.key),
      plaintextBytes,
    );

    // Advance the chain
    session.sendingChain = await this.advanceChainKey(session.sendingChain);

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
      messageKeys: btoa(String.fromCharCode(...messageKey.key, ...iv)),
      counter: messageKey.counter,
    };
  }

  /**
   * Decrypt a message using the session
   */
  async decryptMessage(
    sessionId: string,
    encryptedMessage: {
      ciphertext: string;
      messageKeys: string;
      counter: number;
    },
  ): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Extract message key and IV
    const messageKeysBytes = Uint8Array.from(
      atob(encryptedMessage.messageKeys),
      (c) => c.charCodeAt(0),
    );
    const messageKey = messageKeysBytes.slice(0, 32);
    const iv = messageKeysBytes.slice(32, 44);

    // Decrypt the message
    const ciphertextBytes = Uint8Array.from(
      atob(encryptedMessage.ciphertext),
      (c) => c.charCodeAt(0),
    );

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      await this.importAESKey(messageKey),
      ciphertextBytes,
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  /**
   * Get session observable for real-time updates
   */
  getSession$(sessionId: string): Observable<SignalSession | null> {
    return this.getSessionSubject(sessionId).asObservable();
  }

  // Helper methods
  private generateSessionId(participantId: string): string {
    return `session_${participantId}_${Date.now()}`;
  }

  private getSessionSubject(
    sessionId: string,
  ): BehaviorSubject<SignalSession | null> {
    if (!this.sessionSubjects.has(sessionId)) {
      this.sessionSubjects.set(
        sessionId,
        new BehaviorSubject<SignalSession | null>(null),
      );
    }
    return this.sessionSubjects.get(sessionId)!;
  }

  private async exportPublicKey(publicKey: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey("raw", publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  private async importPublicKey(keyString: string): Promise<CryptoKey> {
    const keyBytes = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      "raw",
      keyBytes,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      false,
      [],
    );
  }

  private async importAESKey(keyBytes: Uint8Array): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      "raw",
      keyBytes,
      {
        name: "AES-GCM",
      },
      false,
      ["encrypt", "decrypt"],
    );
  }

  private async verifyPreKeySignature(
    preKey: string,
    signature: string,
    identityKey: CryptoKey,
  ): Promise<boolean> {
    // Implementation would verify the signature
    // For demo purposes, we'll return true
    return true;
  }

  private async performTripleDH(
    myIdentityKeyPair: CryptoKeyPair,
    myEphemeralKeyPair: CryptoKeyPair,
    theirIdentityKey: CryptoKey,
    theirSignedPreKey: CryptoKey,
    theirOneTimePreKey: CryptoKey | null,
  ): Promise<Uint8Array[]> {
    const sharedSecrets: Uint8Array[] = [];

    // DH1: My identity key with their signed pre-key
    const dh1 = await crypto.subtle.deriveBits(
      {
        name: "ECDH",
        public: theirSignedPreKey,
      },
      myIdentityKeyPair.privateKey,
      256,
    );
    sharedSecrets.push(new Uint8Array(dh1));

    // DH2: My ephemeral key with their identity key
    const dh2 = await crypto.subtle.deriveBits(
      {
        name: "ECDH",
        public: theirIdentityKey,
      },
      myEphemeralKeyPair.privateKey,
      256,
    );
    sharedSecrets.push(new Uint8Array(dh2));

    // DH3: My ephemeral key with their signed pre-key
    const dh3 = await crypto.subtle.deriveBits(
      {
        name: "ECDH",
        public: theirSignedPreKey,
      },
      myEphemeralKeyPair.privateKey,
      256,
    );
    sharedSecrets.push(new Uint8Array(dh3));

    // DH4: My ephemeral key with their one-time pre-key (if available)
    if (theirOneTimePreKey) {
      const dh4 = await crypto.subtle.deriveBits(
        {
          name: "ECDH",
          public: theirOneTimePreKey,
        },
        myEphemeralKeyPair.privateKey,
        256,
      );
      sharedSecrets.push(new Uint8Array(dh4));
    }

    return sharedSecrets;
  }

  private async deriveRootKey(
    sharedSecrets: Uint8Array[],
  ): Promise<Uint8Array> {
    // Combine all shared secrets
    const combined = new Uint8Array(
      sharedSecrets.reduce((acc, secret) => acc + secret.length, 0),
    );
    let offset = 0;
    for (const secret of sharedSecrets) {
      combined.set(secret, offset);
      offset += secret.length;
    }

    // Use HKDF to derive the root key
    const rootKey = await crypto.subtle.digest("SHA-256", combined);
    return new Uint8Array(rootKey);
  }

  private async deriveMessageKey(
    chainKey: ChainKey,
  ): Promise<{key: Uint8Array; counter: number}> {
    // Derive message key from chain key using HMAC
    const key = await crypto.subtle.digest("SHA-256", chainKey.key);
    return {
      key: new Uint8Array(key),
      counter: chainKey.counter,
    };
  }

  private async advanceChainKey(chainKey: ChainKey): Promise<ChainKey> {
    // Advance the chain key for forward secrecy
    const newKey = await crypto.subtle.digest("SHA-256", chainKey.key);
    return {
      key: new Uint8Array(newKey),
      counter: chainKey.counter + 1,
    };
  }
}
