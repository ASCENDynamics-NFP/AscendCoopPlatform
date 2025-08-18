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
import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AuthUser} from "@shared/models/auth-user.model";
import {Account} from "@shared/models/account.model";
import {Store} from "@ngrx/store";
import {AlertController} from "@ionic/angular";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import * as AuthActions from "../../../../../../state/actions/auth.actions";

@Component({
  selector: "app-settings-form",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnChanges {
  @Input() authUser?: AuthUser | null;
  @Input() account?: Account;
  @Output() languageChange = new EventEmitter<string>();

  isDeleting = false;

  settingsForm: FormGroup<{
    privacy: FormControl<
      "public" | "accepted-users-only" | "accepted-groups-only" | "private"
    >;
    language: FormControl<string>;
  }>;

  languageList = [
    {code: "en", name: "english", text: "English"},
    {code: "fr", name: "french", text: "Français"},
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private translateService: TranslateService,
    private alertController: AlertController,
  ) {
    this.settingsForm = this.fb.group({
      privacy: ["public", Validators.required],
      language: ["en"],
    }) as FormGroup<{
      privacy: FormControl<
        "public" | "accepted-users-only" | "accepted-groups-only" | "private"
      >;
      language: FormControl<string>;
    }>;
  }

  ngOnChanges() {
    this.loadFormData();
  }

  onLanguageChange() {
    const lang = this.settingsForm.value.language ?? "en";
    this.translateService.use(lang);
    this.languageChange.emit(lang);
  }

  updateSetting() {
    if (this.authUser?.uid && this.account) {
      const formValue = this.settingsForm.value;

      const updatedAccount: Account = {
        ...this.account,
        privacy: formValue.privacy || "public",
        accessibility: {preferredLanguage: formValue.language},
        settings: {
          theme: this.account.settings?.theme || "light",
          language: formValue.language || "en",
        },
      };

      // Dispatch action to update the account
      this.store.dispatch(
        AccountActions.updateAccount({account: updatedAccount}),
      );
    }
  }

  loadFormData() {
    if (!this.account) return;
    // Update the form with the account data
    this.settingsForm.patchValue({
      privacy: this.account.privacy || "public",
      language: this.account.accessibility?.preferredLanguage ?? "en",
    });
  }

  toggleDarkTheme(event: CustomEvent) {
    const isDarkModeEnabled = event.detail.checked;
    document.body.classList.toggle("dark", isDarkModeEnabled);
  }

  async onDeleteAccount() {
    const alert = await this.alertController.create({
      header: "Delete Account",
      message: `
        <p><strong>This action cannot be undone!</strong></p>
        <p>Deleting your account will permanently remove:</p>
        <ul style="text-align: left; margin: 10px 0;">
          <li>Your profile and account information</li>
          <li>All your listings and postings</li>
          <li>Your connections and relationships</li>
          <li>Your chat messages and conversations</li>
        </ul>
        <p><strong>Note:</strong> Your volunteer time entries will be preserved for organizational records but anonymized.</p>
        <p>Are you absolutely sure you want to delete your account?</p>
      `,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Delete Account",
          cssClass: "danger",
          handler: () => {
            this.confirmDeleteAccount();
          },
        },
      ],
    });

    await alert.present();
  }

  private async confirmDeleteAccount() {
    // Second confirmation for extra safety
    const confirmAlert = await this.alertController.create({
      header: "Final Confirmation",
      message: 'Type "DELETE" below to confirm permanent account deletion:',
      inputs: [
        {
          name: "confirmation",
          type: "text",
          placeholder: "Type DELETE here",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete Account",
          cssClass: "danger",
          handler: (data) => {
            if (data.confirmation === "DELETE") {
              this.executeDeleteAccount();
              return true;
            } else {
              this.showErrorAlert(
                'Please type "DELETE" exactly as shown to confirm.',
              );
              return false;
            }
          },
        },
      ],
    });

    await confirmAlert.present();
  }

  private executeDeleteAccount() {
    if (!this.authUser?.uid) {
      this.showErrorAlert("Unable to delete account: User not authenticated");
      return;
    }

    this.isDeleting = true;

    // Dispatch the delete account action with confirmation text
    this.store.dispatch(
      AuthActions.deleteAccount({confirmationText: "DELETE"}),
    );
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: "Error",
      message,
      buttons: ["OK"],
    });
    await alert.present();
  }
}
