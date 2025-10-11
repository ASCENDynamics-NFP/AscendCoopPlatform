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
import {formatPhoneNumber} from "../../../../../../core/utils/phone.util";
import {
  FirebaseFunctionsService,
  UpdateAccountRequest,
} from "../../../../../../core/services/firebase-functions.service";
import {firstValueFrom} from "rxjs";
import {AccountSectionsService} from "../../../../services/account-sections.service";
import {take} from "rxjs/operators";
import {ToastController} from "@ionic/angular";

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
    private firebaseFunctions: FirebaseFunctionsService,
    private toastController: ToastController,
    private sections: AccountSectionsService,
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

  // Format phone number as user types
  formatPhoneNumber(event: any): void {
    const input = event.target;
    const formattedValue = formatPhoneNumber(input.value);

    // Update the input display value
    input.value = formattedValue;

    // Update the form control value
    this.registrationForm
      .get("contactInformation.primaryPhone")
      ?.setValue(formattedValue);
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
        primaryPhone: [
          "",
          Validators.pattern("^(?=(?:\\D*\\d){10,15}$)[+]?[0-9()\\s-]+$"),
        ],
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

  async onSubmit() {
    // Check if user is authenticated
    const user = await import("firebase/auth").then(
      ({getAuth}) => getAuth().currentUser,
    );
    if (!user) {
      const toast = await this.toastController.create({
        message: "Please sign in to update your account",
        duration: 3000,
        color: "warning",
      });
      await toast.present();
      return;
    }

    // Test authentication before proceeding
    try {
      await firstValueFrom(this.firebaseFunctions.testAuthentication());
    } catch (authError) {
      const toast = await this.toastController.create({
        message:
          "Authentication issue detected. Please sign out and sign in again.",
        duration: 4000,
        color: "warning",
      });
      await toast.present();
      return;
    }

    const formValue = this.registrationForm.value;

    try {
      const accountId = this.account?.id || user.uid;

      const updateRequest: UpdateAccountRequest = {
        accountId,
        updates: {
          type: this.accountType as "user" | "group",
          name: formValue.name!,
          tagline: formValue.tagline || "New and looking to help!",
        },
      };

      const result = await firstValueFrom(
        this.firebaseFunctions.updateAccount(updateRequest),
      );
      const successMessage = "Account updated successfully!";

      // Persist private contact info via callable (AccountService handles subdoc write)
      try {
        const contactInfoPayload = {
          emails: this.buildEmailsFromForm(formValue),
          phoneNumbers: this.buildPhoneNumbersFromForm(formValue),
        } as any;
        await firstValueFrom(
          this.firebaseFunctions.updateAccount({
            accountId,
            updates: {contactInformation: contactInfoPayload},
          }),
        );
      } catch (e) {
        console.warn("Failed to save contact info:", e);
      }

      // Show success message
      const toast = await this.toastController.create({
        message: successMessage,
        duration: 2000,
        color: "success",
      });
      await toast.present();

      if (this.redirectSubmit) {
        // Proactively update auth user type to reflect completed registration.
        // This avoids relying on deprecated claim updates and enables navigation.
        this.store.dispatch(
          AuthActions.updateAuthUser({
            user: {type: this.accountType as any} as any,
          }),
        );

        // Ensure the latest account document is in the store before any
        // refresh-based auth user reconstruction runs.
        try {
          const auth = await import("firebase/auth").then((m) => m.getAuth());
          const currentUser = auth.currentUser;
          if (currentUser?.uid) {
            this.store.dispatch(
              AccountActions.loadAccount({accountId: currentUser.uid}),
            );
          }
        } catch {}

        // Also attempt a token refresh to sync any server-side changes.
        setTimeout(() => {
          this.store.dispatch(AuthActions.refreshToken({forceRefresh: true}));
        }, 500);
      }
    } catch (error: any) {
      // Handle specific authentication errors
      let errorMessage = this.account?.id
        ? "Account update failed"
        : "Account creation failed";
      if (
        error.message?.includes("Unauthenticated") ||
        error.message?.includes("Authentication failed")
      ) {
        errorMessage =
          "Authentication expired. Please sign out and sign in again.";

        // Optional: Automatically redirect to login
        setTimeout(() => {
          this.router.navigate(["/auth/login"]);
        }, 2000);
      } else if (error.message?.includes("User not authenticated")) {
        errorMessage = "Please sign in to continue";
        setTimeout(() => {
          this.router.navigate(["/auth/login"]);
        }, 2000);
      } else if (error.message?.includes("already exists")) {
        errorMessage =
          "An account already exists for this user. Try updating your profile instead.";
      } else if (error.message?.includes("not found")) {
        errorMessage = "Account not found. Please try creating a new account.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      const toast = await this.toastController.create({
        message: errorMessage,
        duration: 5000,
        color: "danger",
      });
      await toast.present();
    }
  }

  private buildEmailsFromFormForAPI(
    formValue: any,
  ): Array<{email: string; type?: string}> {
    const emails: Array<{email: string; type?: string}> = [];

    if (formValue.contactInformation?.primaryEmail) {
      emails.push({
        email: formValue.contactInformation.primaryEmail,
        type: "contact",
      });
    }

    return emails;
  }

  private buildPhoneNumbersFromFormForAPI(
    formValue: any,
  ): Array<{number: string; type?: string}> {
    const phones: Array<{number: string; type?: string}> = [];

    if (formValue.contactInformation?.primaryPhone) {
      phones.push({
        number: formValue.contactInformation.primaryPhone,
        type: "mobile",
      });
    }

    return phones;
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
    // Pull primary email/phone from gated sections/contactInfo (no base account fallback)
    let primaryEmail = "";
    let primaryPhone = "";

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

    // Update primary email/phone asynchronously from sections/contactInfo when available
    if (this.account.id) {
      this.sections
        .contactInfo$(this.account.id)
        .pipe(take(1))
        .subscribe((ci) => {
          const email = ci?.emails?.[0]?.email || "";
          const phone = ci?.phoneNumbers?.[0]?.number || "";
          this.registrationForm.patchValue({
            contactInformation: {
              primaryEmail: email,
              primaryPhone: phone,
            },
          });
        });
    }

    // Handle group-specific data
    if (this.isGroupRegistration && this.account.groupDetails) {
      this.registrationForm.patchValue({
        groupType: this.account.groupDetails.groupType || "",
      });
    }
  }
}
