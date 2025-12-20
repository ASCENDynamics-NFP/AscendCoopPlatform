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
import {Component, OnInit, Input} from "@angular/core";
import {ModalController, AlertController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {KeyBackupService} from "../../services/key-backup.service";

@Component({
  selector: "app-key-restore-modal",
  templateUrl: "./key-restore-modal.component.html",
  styleUrls: ["./key-restore-modal.component.scss"],
})
export class KeyRestoreModalComponent implements OnInit {
  @Input() authMethod: "password" | "sso" = "password";

  restoreForm: FormGroup;
  showPassword = false;
  isLoading = false;
  attemptCount = 0;
  maxAttempts = 3;
  isLocked = false;
  lockoutTime = 300000; // 5 minutes in milliseconds

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private keyBackupService: KeyBackupService,
    private alertController: AlertController,
  ) {
    this.restoreForm = this.formBuilder.group({
      password: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    // Check if there's an active lockout
    const lockoutEnd = localStorage.getItem("keyRestoreLockout");
    if (lockoutEnd) {
      const lockoutEndTime = parseInt(lockoutEnd, 10);
      const now = Date.now();

      if (now < lockoutEndTime) {
        this.isLocked = true;
        const remainingTime = Math.ceil((lockoutEndTime - now) / 60000);

        setTimeout(() => {
          this.isLocked = false;
          this.attemptCount = 0;
          localStorage.removeItem("keyRestoreLockout");
        }, lockoutEndTime - now);
      } else {
        localStorage.removeItem("keyRestoreLockout");
      }
    }
  }

  /**
   * Get label text based on auth method
   */
  get passwordLabel(): string {
    return this.authMethod === "password"
      ? "Account Password"
      : "Encryption Passphrase";
  }

  /**
   * Get placeholder text based on auth method
   */
  get passwordPlaceholder(): string {
    return this.authMethod === "password"
      ? "Enter your account password"
      : "Enter your encryption passphrase";
  }

  /**
   * Get help text based on auth method
   */
  get helpText(): string {
    return this.authMethod === "password"
      ? "Enter the password you use to log in to your account."
      : "Enter the passphrase you set up for encrypting your messages.";
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Dismiss modal without restoring
   */
  dismiss(): void {
    this.modalController.dismiss(null, "cancel");
  }

  /**
   * Generate new keys (skip restore)
   */
  async generateNewKeys(): Promise<void> {
    const alert = await this.alertController.create({
      header: "Generate New Keys",
      message:
        "Are you sure? If you generate new keys, you will not be able to read your previous encrypted messages.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Generate New Keys",
          role: "destructive",
          handler: () => {
            this.modalController.dismiss(null, "skip");
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Restore keys with password/passphrase
   */
  async restore(): Promise<void> {
    if (this.isLocked) {
      await this.showError("Too many failed attempts. Please try again later.");
      return;
    }

    if (this.restoreForm.invalid) {
      return;
    }

    this.isLoading = true;
    const password = this.restoreForm.get("password")?.value;

    try {
      const keyPair = await this.keyBackupService.restoreKeys(password);

      if (keyPair) {
        this.modalController.dismiss(keyPair, "restore");
      } else {
        throw new Error("No backup found");
      }
    } catch (error) {
      this.attemptCount++;

      if (this.attemptCount >= this.maxAttempts) {
        // Lock for 5 minutes
        this.isLocked = true;
        const lockoutEnd = Date.now() + this.lockoutTime;
        localStorage.setItem("keyRestoreLockout", lockoutEnd.toString());

        await this.showError(
          `Too many failed attempts. Please try again in 5 minutes.`,
        );

        setTimeout(() => {
          this.isLocked = false;
          this.attemptCount = 0;
          localStorage.removeItem("keyRestoreLockout");
        }, this.lockoutTime);
      } else {
        const remainingAttempts = this.maxAttempts - this.attemptCount;
        await this.showError(
          `Incorrect ${this.authMethod === "password" ? "password" : "passphrase"}. ${remainingAttempts} attempt(s) remaining.`,
        );
      }
    } finally {
      this.isLoading = false;
    }
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
