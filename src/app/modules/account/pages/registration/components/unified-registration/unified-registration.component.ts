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
import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import {Router} from "@angular/router";
import {
  Account,
  Email,
  PhoneNumber,
  WebLink,
} from "../../../../../../../../shared/models/account.model";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import * as AuthActions from "../../../../../../state/actions/auth.actions";

@Component({
  selector: "app-unified-registration",
  templateUrl: "./unified-registration.component.html",
  styleUrls: ["./unified-registration.component.scss"],
})
export class UnifiedRegistrationComponent implements OnChanges {
  @Input() account?: Account;
  @Input() accountType: "user" | "group" = "user";
  @Input() redirectSubmit: boolean = false;

  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
  ) {
    this.initializeForm();
  }

  // Custom URL validator
  private urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Allow empty values for optional fields
    }

    const url = control.value.trim();

    // Check if URL starts with http:// or https://
    const urlPattern = /^https?:\/\/.+/i;

    if (!urlPattern.test(url)) {
      return {invalidUrl: {message: "URL must start with http:// or https://"}};
    }

    // Additional validation to ensure there's content after the protocol
    const domainPattern = /^https?:\/\/.{3,}/i;
    if (!domainPattern.test(url)) {
      return {
        invalidUrl: {
          message: "Please enter a complete URL (e.g., https://example.com)",
        },
      };
    }

    return null;
  }

  // Helper method to get validation error message
  getUrlErrorMessage(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field?.errors?.["invalidUrl"]) {
      return field.errors["invalidUrl"].message;
    }
    return "";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["account"] && this.account) {
      this.loadFormData();
    }
    if (changes["accountType"]) {
      this.initializeForm();
      if (this.account) {
        this.loadFormData();
      }
    }
  }

  private initializeForm(): void {
    const baseForm = {
      name: ["", Validators.required],
      tagline: ["", Validators.required],
      description: [""],
      website: ["", this.urlValidator.bind(this)],
      socialMedia: ["", this.urlValidator.bind(this)],
      contactInformation: this.fb.group({
        primaryEmail: ["", [Validators.email]],
        primaryPhone: [""],
      }),
    };

    // Add group-specific fields if account type is group
    if (this.accountType === "group") {
      (baseForm as any).groupType = ["", Validators.required];
    }

    this.registrationForm = this.fb.group(baseForm);
  }

  get isGroupRegistration(): boolean {
    return this.accountType === "group";
  }

  get nameLabel(): string {
    return this.isGroupRegistration ? "Group Name" : "Name";
  }

  onSubmit() {
    if (this.account) {
      const formValue = this.registrationForm.value;

      const baseAccount: Account = {
        ...this.account,
        type: this.accountType,
        name: formValue.name!,
        tagline: formValue.tagline!,
        description: formValue.description || "",
        webLinks: this.buildWebLinksFromForm(formValue),
        contactInformation: {
          ...this.account.contactInformation,
          emails: this.buildEmailsFromForm(formValue),
          phoneNumbers: this.buildPhoneNumbersFromForm(formValue),
          addresses: [], // Keep existing addresses
          preferredMethodOfContact: "Email",
        },
      };

      // Add group-specific details if it's a group
      if (this.isGroupRegistration && formValue.groupType) {
        baseAccount.groupDetails = {
          ...this.account.groupDetails,
          groupType: formValue.groupType,
        };
      }

      this.store.dispatch(AccountActions.updateAccount({account: baseAccount}));

      if (this.redirectSubmit && this.account?.id) {
        // Force token refresh after account update to get updated custom claims
        // The auth effects will handle navigation after the token is refreshed
        setTimeout(() => {
          this.store.dispatch(AuthActions.refreshToken({forceRefresh: true}));
        }, 1000); // Small delay to allow server-side function to complete
      }
    }
  }

  private buildWebLinksFromForm(formValue: any): WebLink[] {
    const links: WebLink[] = [];

    if (formValue.website) {
      links.push({
        name: "Website",
        url: formValue.website,
        category: "Website",
      });
    }

    if (formValue.socialMedia) {
      links.push({
        name: "Social Media",
        url: formValue.socialMedia,
        category: "Social Media",
      });
    }

    return links;
  }

  private buildEmailsFromForm(formValue: any): Email[] {
    const emails: Email[] = [];

    if (formValue.contactInformation?.primaryEmail) {
      emails.push({
        name: "Contact",
        email: formValue.contactInformation.primaryEmail,
      });
    }

    return emails;
  }

  private buildPhoneNumbersFromForm(formValue: any): PhoneNumber[] {
    const phones: PhoneNumber[] = [];

    if (formValue.contactInformation?.primaryPhone) {
      phones.push({
        number: formValue.contactInformation.primaryPhone,
        type: "mobile",
        isEmergencyNumber: false,
      });
    }

    return phones;
  }

  loadFormData() {
    if (!this.account) return;

    // Extract data from existing account structure
    const website =
      this.account.webLinks?.find((link) => link.category === "Website")?.url ||
      "";
    const socialMedia =
      this.account.webLinks?.find((link) => link.category === "Social Media")
        ?.url || "";
    const primaryEmail =
      this.account.contactInformation?.emails?.[0]?.email || "";
    const primaryPhone =
      this.account.contactInformation?.phoneNumbers?.[0]?.number || "";

    // Patch the form with existing data
    this.registrationForm.patchValue({
      name: this.account.name || "",
      tagline: this.account.tagline || "",
      description: this.account.description || "",
      website: website,
      socialMedia: socialMedia,
      contactInformation: {
        primaryEmail: primaryEmail,
        primaryPhone: primaryPhone,
      },
    });

    // Handle group-specific data
    if (this.isGroupRegistration && this.account.groupDetails) {
      this.registrationForm.patchValue({
        groupType: this.account.groupDetails.groupType || "",
      });
    }
  }
}
