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
import {Store} from "@ngrx/store";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat/app";
import {EncryptionService, KeyPair} from "./encryption.service";
import {EncryptionKeyBackup} from "../../../../../shared/models/account.model";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {firstValueFrom} from "rxjs";
import {ModalController, AlertController} from "@ionic/angular";

export interface BackupStatus {
  hasBackup: boolean;
  authMethod?: "password" | "sso";
  lastBackupAt?: Date;
}

@Injectable({
  providedIn: "root",
})
export class KeyBackupService {
  private capturedPassword: string | null = null;
  private readonly PASSWORD_CAPTURE_TIMEOUT = 5000; // 5 seconds

  constructor(
    private store: Store,
    private firestore: AngularFirestore,
    private encryptionService: EncryptionService,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {}

  /**
   * Temporarily capture password during login for email/password users
   * Password is cleared after timeout or after backup
   */
  capturePasswordOnLogin(password: string): void {
    this.capturedPassword = password;

    // Clear password after timeout for security
    setTimeout(() => {
      this.capturedPassword = null;
    }, this.PASSWORD_CAPTURE_TIMEOUT);
  }

  /**
   * Get the captured password if available
   */
  private getCapturedPassword(): string | null {
    const password = this.capturedPassword;
    this.capturedPassword = null; // Clear after retrieval
    return password;
  }

  /**
   * Detect authentication method for current user
   */
  async getAuthMethod(): Promise<"password" | "sso"> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!authUser) {
      throw new Error("No authenticated user");
    }

    // Check if user has password provider
    const hasPasswordProvider = authUser.providerData?.some(
      (provider: any) => provider.providerId === "password",
    );

    return hasPasswordProvider ? "password" : "sso";
  }

  /**
   * Prompt user to set encryption passphrase (for SSO users)
   */
  async promptForPassphrase(): Promise<string | null> {
    const alert = await this.alertController.create({
      header: "Set Encryption Passphrase",
      message:
        "Since you log in with a social provider, you need a separate passphrase to protect your encrypted messages. This passphrase is different from your login credentials.",
      inputs: [
        {
          name: "passphrase",
          type: "password",
          placeholder: "Enter passphrase (min 12 characters)",
          attributes: {
            minlength: 12,
          },
        },
        {
          name: "confirmPassphrase",
          type: "password",
          placeholder: "Confirm passphrase",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Set Passphrase",
          handler: (data) => {
            if (!data.passphrase || data.passphrase.length < 12) {
              this.showError("Passphrase must be at least 12 characters");
              return false;
            }
            if (data.passphrase !== data.confirmPassphrase) {
              this.showError("Passphrases do not match");
              return false;
            }
            // Validate passphrase strength
            if (!this.validatePassphraseStrength(data.passphrase)) {
              this.showError(
                "Passphrase must be at least 12 characters and contain a number or special character",
              );
              return false;
            }
            return true;
          },
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role === "cancel" || !result.data?.values) {
      return null;
    }

    return result.data.values.passphrase;
  }

  /**
   * Validate passphrase strength for SSO users
   * Requires minimum 12 characters and at least one number or special character
   */
  private validatePassphraseStrength(passphrase: string): boolean {
    // Minimum 12 characters AND at least one number or special character
    return (
      passphrase.length >= 12 &&
      /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passphrase)
    );
  }

  /**
   * Backup encryption keys with password/passphrase
   */
  async backupKeys(
    passwordOrPassphrase: string,
    keyPair: KeyPair,
  ): Promise<void> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!authUser?.uid) {
      throw new Error("No authenticated user");
    }

    try {
      // Get auth method
      const authMethod = await this.getAuthMethod();

      // Export private key
      const privateKeyBytes = await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey,
      );
      const privateKeyString = btoa(
        String.fromCharCode(...new Uint8Array(privateKeyBytes)),
      );

      // Export public key
      const publicKeyString = await this.encryptionService.exportPublicKey(
        keyPair.publicKey,
      );

      // Generate salt
      const salt = crypto.getRandomValues(new Uint8Array(32));
      const saltString = btoa(String.fromCharCode(...salt));

      // Derive key from password using PBKDF2
      const derivedKey = await this.encryptionService.deriveKeyFromPassword(
        passwordOrPassphrase,
        salt,
        100000,
      );

      // Encrypt private key
      const {encryptedData, iv} =
        await this.encryptionService.encryptWithDerivedKey(
          privateKeyString,
          derivedKey,
        );

      // Create backup object
      const backup: EncryptionKeyBackup = {
        encryptedPrivateKey: encryptedData,
        publicKey: publicKeyString,
        salt: saltString,
        iv: iv,
        iterations: 100000,
        authMethod: authMethod,
        createdAt: firebase.firestore.FieldValue.serverTimestamp() as any,
        lastBackupAt: firebase.firestore.FieldValue.serverTimestamp() as any,
      };

      // Save to Firestore
      await this.firestore.collection("accounts").doc(authUser.uid).update({
        encryptionKeyBackup: backup,
      });
    } catch (error) {
      console.error("Error backing up keys:", error);
      throw new Error("Failed to backup encryption keys");
    }
  }

  /**
   * Restore encryption keys from backup
   */
  async restoreKeys(passwordOrPassphrase: string): Promise<KeyPair | null> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!authUser?.uid) {
      throw new Error("No authenticated user");
    }

    try {
      // Get backup from Firestore
      const accountDoc = await firstValueFrom(
        this.firestore.collection("accounts").doc(authUser.uid).get(),
      );

      if (!accountDoc || !accountDoc.exists) {
        throw new Error("Account not found");
      }

      const data = accountDoc.data() as any;
      const backup = data?.["encryptionKeyBackup"] as
        | EncryptionKeyBackup
        | undefined;

      if (!backup) {
        return null;
      }

      // Convert salt from base64
      const salt = Uint8Array.from(atob(backup.salt), (c) => c.charCodeAt(0));

      // Derive key from password
      const derivedKey = await this.encryptionService.deriveKeyFromPassword(
        passwordOrPassphrase,
        salt,
        backup.iterations,
      );

      // Decrypt private key
      const privateKeyString =
        await this.encryptionService.decryptWithDerivedKey(
          backup.encryptedPrivateKey,
          derivedKey,
          backup.iv,
        );

      // Import private key
      const privateKeyBytes = Uint8Array.from(atob(privateKeyString), (c) =>
        c.charCodeAt(0),
      );
      const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        privateKeyBytes,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"],
      );

      // Import public key
      const publicKey = await this.encryptionService.importPublicKey(
        backup.publicKey,
      );

      return {publicKey, privateKey};
    } catch (error) {
      console.error("Error restoring keys:", error);
      throw new Error(
        "Failed to restore encryption keys. Please check your password/passphrase.",
      );
    }
  }

  /**
   * Check if user has a backup
   */
  async hasBackup(): Promise<BackupStatus> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!authUser?.uid) {
      return {hasBackup: false};
    }

    try {
      const accountDoc = await firstValueFrom(
        this.firestore.collection("accounts").doc(authUser.uid).get(),
      );

      if (!accountDoc || !accountDoc.exists) {
        return {hasBackup: false};
      }

      const data = accountDoc.data() as any;
      const backup = data?.["encryptionKeyBackup"] as
        | EncryptionKeyBackup
        | undefined;

      if (!backup) {
        return {hasBackup: false};
      }

      return {
        hasBackup: true,
        authMethod: backup.authMethod,
        lastBackupAt: backup.lastBackupAt?.toDate?.(),
      };
    } catch (error) {
      console.error("Error checking backup status:", error);
      return {hasBackup: false};
    }
  }

  /**
   * Change password/passphrase and re-encrypt keys
   */
  async changePassword(
    oldPasswordOrPassphrase: string,
    newPasswordOrPassphrase: string,
  ): Promise<void> {
    // Restore keys with old password
    const keyPair = await this.restoreKeys(oldPasswordOrPassphrase);

    if (!keyPair) {
      throw new Error("Could not restore keys with old password");
    }

    // Backup with new password
    await this.backupKeys(newPasswordOrPassphrase, keyPair);
  }

  /**
   * Handle first encrypted message - backup keys automatically
   */
  async handleFirstEncryptedMessage(keyPair: KeyPair): Promise<void> {
    const authMethod = await this.getAuthMethod();

    if (authMethod === "password") {
      // Try to use captured password
      const password = this.getCapturedPassword();

      if (password) {
        // Automatically backup with captured password
        await this.backupKeys(password, keyPair);
        await this.showSuccess(
          "🔐 Encryption Enabled! Your messages are now end-to-end encrypted and backed up securely for use on other devices.",
        );
      } else {
        // Password wasn't captured, prompt user
        const alert = await this.alertController.create({
          header: "🔐 Encryption Enabled",
          message:
            "Your messages are now end-to-end encrypted! To access them on other devices, backup your encryption keys by entering your account password.",
          inputs: [
            {
              name: "password",
              type: "password",
              placeholder: "Enter your password",
            },
          ],
          buttons: [
            {
              text: "Skip for Now",
              role: "cancel",
              handler: () => {
                this.showInfo(
                  "Encryption keys generated. You can backup later in Settings → Encryption.",
                );
              },
            },
            {
              text: "Backup Now",
              handler: async (data) => {
                if (data.password) {
                  try {
                    await this.backupKeys(data.password, keyPair);
                    this.showSuccess(
                      "Keys backed up successfully! You can now access encrypted messages on any device.",
                    );
                  } catch (error) {
                    this.showError(
                      "Failed to backup keys. Please try again in Settings.",
                    );
                  }
                }
                return true;
              },
            },
          ],
        });
        await alert.present();
      }
    } else {
      // SSO user - prompt for passphrase
      const passphrase = await this.promptForPassphrase();

      if (passphrase) {
        await this.backupKeys(passphrase, keyPair);
        await this.showSuccess(
          "🔐 Encryption Enabled! Your messages are now end-to-end encrypted and backed up securely for use on other devices.",
        );
      } else {
        // User skipped passphrase setup
        await this.showInfo(
          "Encryption keys generated. Remember to set up a passphrase in Settings → Encryption to enable multi-device access.",
        );
      }
    }
  }

  /**
   * Show success message
   */
  private async showSuccess(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: "Success",
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  /**
   * Show info message
   */
  private async showInfo(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: "Information",
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  /**
   * Show error message
   */
  private async showError(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: "Error",
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }
}
