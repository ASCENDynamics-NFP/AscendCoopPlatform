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
import {Component, OnInit} from "@angular/core";
import {ModalController, AlertController} from "@ionic/angular";
import {
  KeyBackupService,
  BackupStatus,
} from "../../services/key-backup.service";
import {EncryptionService} from "../../services/encryption.service";
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
  hasLocalKeys = false;

  constructor(
    private keyBackupService: KeyBackupService,
    private encryptionService: EncryptionService,
    private modalController: ModalController,
    private alertController: AlertController,
    private store: Store,
  ) {}

  async ngOnInit() {
    await this.checkBackupStatus();
    await this.checkLocalKeys();
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

    const alert = await this.alertController.create({
      header: "Generate New Keys",
      message:
        "Are you sure? Generating new keys will prevent you from reading previous encrypted messages.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Generate",
          role: "destructive",
          handler: async () => {
            try {
              this.isLoading = true;
              const keyPair = await this.encryptionService.generateKeyPair();
              await this.encryptionService.storeKeyPair(keyPair, authUser.uid);
              await this.showSuccess("New keys generated successfully");
              await this.checkLocalKeys();
            } catch (error) {
              await this.showError("Failed to generate new keys");
            } finally {
              this.isLoading = false;
            }
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
          handler: async () => {
            const authUser = await firstValueFrom(
              this.store.select(selectAuthUser),
            );
            if (authUser?.uid) {
              this.encryptionService.clearStoredKeys(authUser.uid);
              await this.showSuccess("Local keys cleared");
              await this.checkLocalKeys();
            }
          },
        },
      ],
    });

    await alert.present();
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
}
