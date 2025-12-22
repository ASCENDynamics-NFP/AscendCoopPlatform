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
import {Component, OnInit, ChangeDetectorRef, NgZone} from "@angular/core";
import {ModalController, AlertController} from "@ionic/angular";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {
  KeyBackupService,
  BackupStatus,
} from "../../services/key-backup.service";
import {EncryptionService} from "../../services/encryption.service";
import {EncryptedChatService} from "../../services/encrypted-chat.service";
import {KeyRestoreModalComponent} from "../key-restore-modal/key-restore-modal.component";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {firstValueFrom} from "rxjs";

@Component({
  selector: "app-encryption-settings",
  templateUrl: "./encryption-settings.component.html",
  styleUrls: ["./encryption-settings.component.scss"],
})
export class EncryptionSettingsComponent implements OnInit {
  backupStatus: BackupStatus = {hasBackup: false};
  isLoading = false;
  loadingMessage = "";
  hasLocalKeys = false;
  publicKeyFingerprint: string | null = null;

  constructor(
    private keyBackupService: KeyBackupService,
    private encryptionService: EncryptionService,
    private encryptedChatService: EncryptedChatService,
    private modalController: ModalController,
    private alertController: AlertController,
    private store: Store,
    private firestore: AngularFirestore,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  async ngOnInit() {
    await this.checkBackupStatus();
    await this.checkLocalKeys();
    await this.loadPublicKeyFingerprint();
  }

  /**
   * Ionic lifecycle hook - refresh state when modal reopens
   */
  async ionViewWillEnter() {
    await this.checkBackupStatus();
    await this.checkLocalKeys();
    await this.loadPublicKeyFingerprint();
  }

  /**
   * Check if user has a backup
   */
  async checkBackupStatus(): Promise<void> {
    this.isLoading = true;
    try {
      this.backupStatus = await this.keyBackupService.hasBackup();
    } catch (error) {
      console.error("Error checking backup status:", error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Check if user has local keys
   */
  async checkLocalKeys(): Promise<void> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (authUser?.uid) {
      const keyPair = await this.encryptionService.getStoredKeyPair(
        authUser.uid,
      );
      this.hasLocalKeys = keyPair !== null;
    }
  }

  /**
   * Load public key fingerprint for verification
   */
  async loadPublicKeyFingerprint(): Promise<void> {
    try {
      const authUser = await firstValueFrom(this.store.select(selectAuthUser));
      if (authUser?.uid && this.hasLocalKeys) {
        this.publicKeyFingerprint =
          await this.encryptionService.getStoredPublicKeyFingerprint(
            authUser.uid,
          );
      }
    } catch (error) {
      console.error("Error loading key fingerprint:", error);
    }
  }

  /**
   * Copy fingerprint to clipboard
   */
  async copyFingerprint(): Promise<void> {
    if (!this.publicKeyFingerprint) return;

    try {
      await navigator.clipboard.writeText(this.publicKeyFingerprint);
      await this.showSuccess("Fingerprint copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      await this.showError("Failed to copy fingerprint");
    }
  }

  /**
   * Show fingerprint info
   */
  async showFingerprintInfo(): Promise<void> {
    const alert = await this.alertController.create({
      header: "🔐 Public Key Fingerprint",
      message: `Your fingerprint:\n\n${this.publicKeyFingerprint}\n\nWhat is this?\n\nYour public key fingerprint is a short code that uniquely identifies your encryption key. Share it with your contacts to verify you're communicating securely.\n\nHow to verify:\n\n1. Share your fingerprint with your contact via a different channel (phone, in person, etc.)\n\n2. Ask them to check if the fingerprint matches what they see in your chat\n\n3. If it matches, your connection is secure! 🔒`,
      buttons: [
        {
          text: "Copy",
          handler: () => {
            this.copyFingerprint();
          },
        },
        {
          text: "Close",
          role: "cancel",
        },
      ],
    });
    await alert.present();
  }

  /**
   * Check key health and show diagnostics
   */
  async checkKeyHealth(): Promise<void> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!authUser?.uid) {
      await this.showError("No authenticated user");
      return;
    }

    if (!this.hasLocalKeys) {
      await this.showInfo(
        "No local keys found. Enable encryption or restore from backup.",
      );
      return;
    }

    this.isLoading = true;
    try {
      const health = await this.encryptedChatService.checkKeyHealth(
        authUser.uid,
      );

      if (health.healthy) {
        await this.showSuccess(
          "✅ Your encryption keys are working correctly!",
        );
      } else {
        const alert = await this.alertController.create({
          header: "⚠️ Key Issue Detected",
          message: `Problem: ${health.error}\n\nRecommendation: ${health.recommendation}`,
          buttons: [
            {
              text: "OK",
              role: "cancel",
            },
            {
              text: "Restore Backup",
              handler: () => {
                this.restoreKeys();
              },
            },
          ],
        });
        await alert.present();
      }
    } catch (error) {
      console.error("Error checking key health:", error);
      await this.showError("Failed to check key health");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get auth method display text
   */
  get authMethodText(): string {
    if (!this.backupStatus.authMethod) {
      return "Not set up";
    }
    return this.backupStatus.authMethod === "password"
      ? "Password-protected"
      : "Passphrase-protected";
  }

  /**
   * Get last backup date text
   */
  get lastBackupText(): string {
    if (!this.backupStatus.lastBackupAt) {
      return "Never";
    }
    return this.backupStatus.lastBackupAt.toLocaleString();
  }

  /**
   * Backup keys now
   */
  async backupNow(): Promise<void> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!authUser?.uid) {
      await this.showError("No authenticated user");
      return;
    }

    // Check if user has local keys
    const keyPair = await this.encryptionService.getStoredKeyPair(authUser.uid);

    if (!keyPair) {
      await this.showError(
        "No encryption keys found. Send an encrypted message first.",
      );
      return;
    }

    // Get auth method
    const authMethod = await this.keyBackupService.getAuthMethod();

    // Prompt for password/passphrase
    const alert = await this.alertController.create({
      header: "Backup Encryption Keys",
      message:
        authMethod === "password"
          ? "Enter your account password to backup your encryption keys."
          : "Enter your encryption passphrase to backup your keys.",
      inputs: [
        {
          name: "password",
          type: "password",
          placeholder:
            authMethod === "password"
              ? "Enter account password"
              : "Enter encryption passphrase",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Backup",
          handler: async (data) => {
            if (data.password) {
              try {
                this.isLoading = true;
                await this.keyBackupService.backupKeys(data.password, keyPair);
                await this.showSuccess("Keys backed up successfully");
                await this.checkBackupStatus();
              } catch (error) {
                await this.showError(
                  "Failed to backup keys. Check your password/passphrase.",
                );
              } finally {
                this.isLoading = false;
              }
            }
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Restore keys from backup
   */
  async restoreKeys(): Promise<void> {
    if (!this.backupStatus.hasBackup) {
      await this.showError("No backup found");
      return;
    }

    const modal = await this.modalController.create({
      component: KeyRestoreModalComponent,
      componentProps: {
        authMethod: this.backupStatus.authMethod || "password",
      },
    });

    await modal.present();

    const {data, role} = await modal.onDidDismiss();

    if (role === "restore" && data) {
      // Store the restored keys locally
      const authUser = await firstValueFrom(this.store.select(selectAuthUser));
      if (authUser?.uid) {
        await this.encryptionService.storeKeyPair(data, authUser.uid);
        await this.showSuccess("Keys restored successfully");
        await this.checkLocalKeys();
        await this.loadPublicKeyFingerprint(); // Refresh fingerprint
      }
    } else if (role === "skip") {
      // User chose to generate new keys
      await this.generateNewKeys();
    }
  }

  /**
   * Generate new encryption keys
   */
  async generateNewKeys(): Promise<void> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!authUser?.uid) {
      await this.showError("No authenticated user");
      return;
    }

    // If backup exists, offer to restore instead
    if (this.backupStatus.hasBackup) {
      const restoreFirst = await this.alertController.create({
        header: "Backup Available",
        message:
          "You have a backup of your encryption keys. Would you like to restore them instead? This will preserve access to your old messages.",
        buttons: [
          {
            text: "Restore Backup",
            handler: async () => {
              await this.restoreKeys();
              return true;
            },
          },
          {
            text: "Generate New Keys",
            role: "destructive",
            handler: async () => {
              await this.confirmAndGenerateNewKeys(authUser.uid);
              return true;
            },
          },
          {
            text: "Cancel",
            role: "cancel",
          },
        ],
      });
      await restoreFirst.present();
    } else {
      await this.confirmAndGenerateNewKeys(authUser.uid);
    }
  }

  /**
   * Confirm and proceed with new key generation
   */
  private async confirmAndGenerateNewKeys(userId: string): Promise<void> {
    const alert = await this.alertController.create({
      header: "⚠️ Generate New Keys",
      message:
        "Warning: Generating new keys will prevent you from reading previous encrypted messages. This action cannot be undone.\n\nOnly proceed if:\n• Your current keys are corrupted\n• You've lost access to your backup\n• You understand old messages will be unreadable",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "I Understand, Generate",
          role: "destructive",
          handler: () => {
            // Execute key generation inside NgZone to ensure change detection works
            this.ngZone.run(async () => {
              try {
                this.isLoading = true;
                this.loadingMessage = "Generating encryption keys...";

                // Step 1: Generate keys locally
                const keyPair = await this.encryptionService.generateKeyPair();
                await this.encryptionService.storeKeyPair(keyPair, userId);

                // Step 2: Upload public key to Firestore
                this.loadingMessage = "Uploading public key to server...";
                const publicKeyString =
                  await this.encryptionService.exportPublicKey(
                    keyPair.publicKey,
                  );

                await this.firestore.collection("userKeys").doc(userId).set({
                  publicKey: publicKeyString,
                  createdAt: new Date(),
                  userId: userId,
                });

                // Step 3: Refresh UI state
                await this.checkLocalKeys();
                await this.loadPublicKeyFingerprint();

                // Clear loading
                this.isLoading = false;
                this.loadingMessage = "";

                // Show success
                await this.showSuccess(
                  "New keys generated successfully. You should backup these keys now.",
                );

                // Prompt for backup
                setTimeout(() => this.backupNow(), 500);
              } catch (error: any) {
                console.error("Error during key generation:", error);
                this.isLoading = false;
                this.loadingMessage = "";
                await this.showError(
                  `Failed to generate new keys: ${error?.message || "Unknown error"}. Please check the console for details.`,
                );
              }
            });

            return true; // Allow alert to close
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Change password/passphrase
   */
  async changePassword(): Promise<void> {
    if (!this.backupStatus.hasBackup) {
      await this.showError("No backup found");
      return;
    }

    const authMethod = this.backupStatus.authMethod || "password";

    const alert = await this.alertController.create({
      header:
        authMethod === "password"
          ? "Change Backup Password"
          : "Change Encryption Passphrase",
      message:
        authMethod === "password"
          ? "This will update your backup to use your new account password."
          : "Enter your old and new encryption passphrase.",
      inputs: [
        {
          name: "oldPassword",
          type: "password",
          placeholder:
            authMethod === "password" ? "Old password" : "Old passphrase",
        },
        {
          name: "newPassword",
          type: "password",
          placeholder:
            authMethod === "password" ? "New password" : "New passphrase",
        },
        {
          name: "confirmPassword",
          type: "password",
          placeholder:
            "Confirm new " +
            (authMethod === "password" ? "password" : "passphrase"),
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Change",
          handler: async (data) => {
            if (!data.oldPassword || !data.newPassword) {
              await this.showError("All fields are required");
              return false;
            }

            if (data.newPassword !== data.confirmPassword) {
              await this.showError("New passwords/passphrases do not match");
              return false;
            }

            if (authMethod === "sso" && data.newPassword.length < 8) {
              await this.showError("Passphrase must be at least 8 characters");
              return false;
            }

            try {
              this.isLoading = true;
              await this.keyBackupService.changePassword(
                data.oldPassword,
                data.newPassword,
              );
              await this.showSuccess(
                "Password/passphrase updated successfully",
              );
              await this.checkBackupStatus();
            } catch (error) {
              await this.showError(
                "Failed to update. Check your old password/passphrase.",
              );
            } finally {
              this.isLoading = false;
            }
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Clear local keys
   */
  async clearLocalKeys(): Promise<void> {
    const alert = await this.alertController.create({
      header: "Clear Local Keys",
      message:
        "This will remove encryption keys from this device. You can restore them later from your backup.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Clear",
          role: "destructive",
          handler: () => {
            // Execute in NgZone to ensure change detection
            this.ngZone.run(async () => {
              try {
                this.isLoading = true;
                this.loadingMessage = "Clearing local keys...";

                const authUser = await firstValueFrom(
                  this.store.select(selectAuthUser),
                );

                if (authUser?.uid) {
                  await this.encryptionService.clearStoredKeys(authUser.uid);

                  await this.checkLocalKeys();
                  await this.loadPublicKeyFingerprint();

                  this.isLoading = false;
                  this.loadingMessage = "";

                  await this.showSuccess("Local keys cleared");
                } else {
                  console.error("No authenticated user");
                  this.isLoading = false;
                  this.loadingMessage = "";
                  await this.showError("No authenticated user found");
                }
              } catch (error: any) {
                console.error("Error clearing keys:", error);
                this.isLoading = false;
                this.loadingMessage = "";
                await this.showError(
                  `Failed to clear keys: ${error?.message || "Unknown error"}`,
                );
              }
            });

            return true; // Allow alert to close
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Dismiss the modal
   */
  dismiss(): void {
    this.modalController.dismiss();
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
}
