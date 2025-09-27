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
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
} from "@angular/core";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AuthUser} from "@shared/models/auth-user.model";
import {
  Account,
  PrivacySettings,
  RelatedAccount,
} from "@shared/models/account.model";
import {Store} from "@ngrx/store";
import {AlertController} from "@ionic/angular";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import * as AuthActions from "../../../../../../state/actions/auth.actions";
import {Observable, of, Subscription} from "rxjs";
import {debounceTime, map} from "rxjs/operators";
import {selectRelatedAccountsByAccountId} from "../../../../../../state/selectors/account.selectors";

@Component({
  selector: "app-settings-form",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() authUser?: AuthUser | null;
  @Input() account?: Account;
  @Input() privacyOnly: boolean = false;
  @Output() languageChange = new EventEmitter<string>();

  isDeleting = false;
  showDeleteExpanded = false;
  relatedAccountsOptions$?: Observable<{id: string; name: string}[]>;
  selectedAllow: {[section: string]: string[]} = {};
  selectedBlock: {[section: string]: string[]} = {};

  settingsForm: FormGroup<{
    privacy: FormControl<"public" | "private">;
    language: FormControl<string>;
    // flattened privacySettings controls for simplicity
    contactInformationVisibility: FormControl<string>;
    professionalInformationVisibility: FormControl<string>;
    laborRightsVisibility: FormControl<string>;
    userListVisibility: FormControl<string>;
    organizationListVisibility: FormControl<string>;
    roleHierarchyVisibility: FormControl<string>;
    projectsVisibility: FormControl<string>;
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
      contactInformationVisibility: ["private"],
      professionalInformationVisibility: ["private"],
      laborRightsVisibility: ["private"],
      userListVisibility: ["related"],
      organizationListVisibility: ["related"],
      roleHierarchyVisibility: ["related"],
      projectsVisibility: ["related"],
    }) as FormGroup<{
      privacy: FormControl<"public" | "private">;
      language: FormControl<string>;
      contactInformationVisibility: FormControl<string>;
      professionalInformationVisibility: FormControl<string>;
      laborRightsVisibility: FormControl<string>;
      userListVisibility: FormControl<string>;
      organizationListVisibility: FormControl<string>;
      roleHierarchyVisibility: FormControl<string>;
      projectsVisibility: FormControl<string>;
    }>;
  }

  private autoSaveSub?: Subscription;

  ngOnInit() {
    // Auto-save on form value changes with a small debounce
    this.autoSaveSub = this.settingsForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => this.updateSetting());
  }

  ngOnDestroy() {
    this.autoSaveSub?.unsubscribe();
  }

  ngOnChanges() {
    this.loadFormData();
    if (this.account?.id) {
      this.store.dispatch(
        AccountActions.loadRelatedAccounts({accountId: this.account.id}),
      );
      this.relatedAccountsOptions$ = this.store
        .select(selectRelatedAccountsByAccountId(this.account.id))
        .pipe(
          map((list: Partial<RelatedAccount>[]) =>
            list.map((ra) => ({
              id: ra.id as string,
              name: ra.name || (ra.id as string),
            })),
          ),
        );
    } else {
      this.relatedAccountsOptions$ = of([]);
    }
  }

  onAllowlistIdsChange(section: string, ids: string[]) {
    this.selectedAllow[section] = ids || [];
    // Auto-save when allowlist changes
    this.updateSetting();
  }

  onBlocklistIdsChange(section: string, ids: string[]) {
    this.selectedBlock[section] = ids || [];
    // Auto-save when blocklist changes
    this.updateSetting();
  }

  onLanguageChange() {
    const lang = this.settingsForm.value.language ?? "en";
    this.translateService.use(lang);
    this.languageChange.emit(lang);
  }

  updateSetting() {
    if (this.authUser?.uid && this.account) {
      const formValue = this.settingsForm.value;

      const pickIds = (section: string) => this.selectedAllow[section] || [];
      const pickBlock = (section: string) => this.selectedBlock[section] || [];

      const privacySettings: PrivacySettings = {
        profile: {
          visibility: (formValue.privacy as any) || "public",
        },
        contactInformation: {
          visibility:
            (formValue.contactInformationVisibility as any) || "private",
          allowlist: pickIds("contactInformation"),
          blocklist: pickBlock("contactInformation"),
        },
        professionalInformation: {
          visibility:
            (formValue.professionalInformationVisibility as any) || "private",
          allowlist: pickIds("professionalInformation"),
          blocklist: pickBlock("professionalInformation"),
        },
        laborRights: {
          visibility: (formValue.laborRightsVisibility as any) || "private",
          allowlist: pickIds("laborRights"),
          blocklist: pickBlock("laborRights"),
        },
        userList: {
          visibility: (formValue.userListVisibility as any) || "related",
          allowlist: pickIds("userList"),
          blocklist: pickBlock("userList"),
        },
        organizationList: {
          visibility:
            (formValue.organizationListVisibility as any) || "related",
          allowlist: pickIds("organizationList"),
          blocklist: pickBlock("organizationList"),
        },
        roleHierarchy: {
          visibility: (formValue.roleHierarchyVisibility as any) || "related",
        },
        projects: {
          visibility: (formValue.projectsVisibility as any) || "related",
        },
        messaging: {receiveFrom: "related"},
        discoverability: {searchable: true},
      };

      const updatedAccount: Account = {
        ...this.account,
        accessibility: {preferredLanguage: formValue.language},
        settings: {
          theme: this.account.settings?.theme || "light",
          language: formValue.language || "en",
        },
        privacySettings,
      };

      // Dispatch action to update the account
      this.store.dispatch(
        AccountActions.updateAccount({account: updatedAccount}),
      );
    }
  }

  // --- Group-only administrative controls ---
  get membershipPolicy(): "open" | "approval" | "invitation" {
    return (
      (this.account?.administrativeSettings as any)?.membershipPolicy ||
      "approval"
    );
  }

  updateMembershipPolicy(value: "open" | "approval" | "invitation") {
    if (!this.account) return;
    const updatedAccount: Account = {
      ...this.account,
      administrativeSettings: {
        ...(this.account.administrativeSettings || {}),
        membershipPolicy: value,
      },
    } as Account;
    this.store.dispatch(
      AccountActions.updateAccount({account: updatedAccount}),
    );
  }

  get accountStatus(): "active" | "inactive" | "suspended" {
    return (this.account?.status as any) || "active";
  }

  setAccountStatus(status: "active" | "inactive") {
    if (!this.account) return;
    const updatedAccount: Account = {
      ...this.account,
      status,
    } as Account;
    this.store.dispatch(
      AccountActions.updateAccount({account: updatedAccount}),
    );
  }

  loadFormData() {
    if (!this.account) return;
    const isUser = this.account.type === "user";
    const isGroup = this.account.type === "group";

    // Unified allowed set for both users and groups.
    const sanitize = (v: string | undefined, fallback: string) => {
      const allowed = ["public", "authenticated", "related", "private"];
      return v && allowed.includes(v) ? v : fallback;
    };

    // Update the form with the account data
    this.settingsForm.patchValue(
      {
        privacy:
          (this.account.privacySettings as any)?.profile?.visibility ||
          "public",
        language: this.account.accessibility?.preferredLanguage ?? "en",
        contactInformationVisibility: sanitize(
          this.account.privacySettings?.contactInformation?.visibility,
          "related",
        ),
        professionalInformationVisibility: sanitize(
          this.account.privacySettings?.professionalInformation?.visibility,
          "private",
        ),
        laborRightsVisibility: sanitize(
          this.account.privacySettings?.laborRights?.visibility,
          "private",
        ),
        userListVisibility: sanitize(
          (this.account.privacySettings as any)?.userList?.visibility ??
            (this.account.type === "user"
              ? (this.account.privacySettings as any)?.friendsList?.visibility
              : (this.account.privacySettings as any)?.membersList?.visibility),
          "related",
        ),
        organizationListVisibility: sanitize(
          (this.account.privacySettings as any)?.organizationList?.visibility ??
            (this.account.type === "user"
              ? (this.account.privacySettings as any)?.membersList?.visibility
              : (this.account.privacySettings as any)?.partnersList
                  ?.visibility),
          "related",
        ),
        roleHierarchyVisibility: sanitize(
          this.account.privacySettings?.roleHierarchy?.visibility,
          "related",
        ),
        projectsVisibility: sanitize(
          this.account.privacySettings?.projects?.visibility,
          "related",
        ),
      },
      {emitEvent: false},
    );

    // Initialize picker selections from existing privacySettings arrays
    this.selectedAllow["contactInformation"] =
      this.account.privacySettings?.contactInformation?.allowlist || [];
    this.selectedBlock["contactInformation"] =
      this.account.privacySettings?.contactInformation?.blocklist || [];
    this.selectedAllow["professionalInformation"] =
      this.account.privacySettings?.professionalInformation?.allowlist || [];
    this.selectedBlock["professionalInformation"] =
      this.account.privacySettings?.professionalInformation?.blocklist || [];
    this.selectedAllow["laborRights"] =
      this.account.privacySettings?.laborRights?.allowlist || [];
    this.selectedBlock["laborRights"] =
      this.account.privacySettings?.laborRights?.blocklist || [];
    this.selectedAllow["userList"] =
      (this.account.privacySettings as any)?.userList?.allowlist ??
      (this.account.type === "user"
        ? (this.account.privacySettings as any)?.friendsList?.allowlist
        : (this.account.privacySettings as any)?.membersList?.allowlist) ??
      [];
    this.selectedBlock["userList"] =
      (this.account.privacySettings as any)?.userList?.blocklist ??
      (this.account.type === "user"
        ? (this.account.privacySettings as any)?.friendsList?.blocklist
        : (this.account.privacySettings as any)?.membersList?.blocklist) ??
      [];
    this.selectedAllow["organizationList"] =
      (this.account.privacySettings as any)?.organizationList?.allowlist ??
      (this.account.type === "user"
        ? (this.account.privacySettings as any)?.membersList?.allowlist
        : (this.account.privacySettings as any)?.partnersList?.allowlist) ??
      [];
    this.selectedBlock["organizationList"] =
      (this.account.privacySettings as any)?.organizationList?.blocklist ??
      (this.account.type === "user"
        ? (this.account.privacySettings as any)?.membersList?.blocklist
        : (this.account.privacySettings as any)?.partnersList?.blocklist) ??
      [];
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
        <p><strong>Note:</strong> Your volunteer time entries will be preserved for organizational records.</p>
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

  toggleDeleteExpanded() {
    this.showDeleteExpanded = !this.showDeleteExpanded;
  }
}
