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
import * as AccountActions from "../../../../../../state/actions/account.actions";

@Component({
  selector: "app-settings-form",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnChanges {
  @Input() authUser?: AuthUser | null;
  @Input() account?: Account;
  @Output() languageChange = new EventEmitter<string>();

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
}
