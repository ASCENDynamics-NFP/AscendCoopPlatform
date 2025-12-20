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
import {Component} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";

@Component({
  selector: "app-encryption-passphrase-modal",
  templateUrl: "./encryption-passphrase-modal.component.html",
  styleUrls: ["./encryption-passphrase-modal.component.scss"],
})
export class EncryptionPassphraseModalComponent {
  passphraseForm: FormGroup;
  showPassphrase = false;
  showConfirmPassphrase = false;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
  ) {
    this.passphraseForm = this.formBuilder.group(
      {
        passphrase: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            this.passphraseStrengthValidator,
          ],
        ],
        confirmPassphrase: ["", [Validators.required]],
      },
      {
        validators: this.passphraseMatchValidator,
      },
    );
  }

  /**
   * Validator to ensure passphrase has at least one number or special character
   */
  private passphraseStrengthValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumberOrSpecial = /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      value,
    );

    return hasNumberOrSpecial ? null : {weakPassphrase: true};
  }

  /**
   * Validator to ensure passphrase and confirm passphrase match
   */
  private passphraseMatchValidator(
    group: AbstractControl,
  ): ValidationErrors | null {
    const passphrase = group.get("passphrase")?.value;
    const confirmPassphrase = group.get("confirmPassphrase")?.value;

    if (!passphrase || !confirmPassphrase) {
      return null;
    }

    return passphrase === confirmPassphrase ? null : {mismatch: true};
  }

  /**
   * Get passphrase strength indicator
   */
  getPassphraseStrength(): {
    strength: string;
    color: string;
    percentage: number;
  } {
    const passphrase = this.passphraseForm.get("passphrase")?.value || "";

    if (passphrase.length === 0) {
      return {strength: "", color: "medium", percentage: 0};
    }

    let strength = 0;

    // Length check
    if (passphrase.length >= 8) strength += 1;
    if (passphrase.length >= 12) strength += 1;

    // Has lowercase
    if (/[a-z]/.test(passphrase)) strength += 1;

    // Has uppercase
    if (/[A-Z]/.test(passphrase)) strength += 1;

    // Has number
    if (/\d/.test(passphrase)) strength += 1;

    // Has special character
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passphrase)) strength += 1;

    if (strength <= 2) {
      return {strength: "Weak", color: "danger", percentage: 33};
    } else if (strength <= 4) {
      return {strength: "Medium", color: "warning", percentage: 66};
    } else {
      return {strength: "Strong", color: "success", percentage: 100};
    }
  }

  /**
   * Toggle passphrase visibility
   */
  togglePassphraseVisibility(): void {
    this.showPassphrase = !this.showPassphrase;
  }

  /**
   * Toggle confirm passphrase visibility
   */
  toggleConfirmPassphraseVisibility(): void {
    this.showConfirmPassphrase = !this.showConfirmPassphrase;
  }

  /**
   * Dismiss modal without setting passphrase
   */
  dismiss(): void {
    this.modalController.dismiss(null, "cancel");
  }

  /**
   * Submit passphrase
   */
  submit(): void {
    if (this.passphraseForm.valid) {
      const passphrase = this.passphraseForm.get("passphrase")?.value;
      this.modalController.dismiss(passphrase, "confirm");
    }
  }
}
