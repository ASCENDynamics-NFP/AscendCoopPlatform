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
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  Account,
  WebLink,
} from "../../../../../../../../shared/models/account.model";
import {Timestamp} from "firebase/firestore";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../../../state/actions/account.actions";

@Component({
  selector: "app-admin-group-profile-form",
  templateUrl: "./admin-group-profile-form.component.html",
  styleUrls: ["./admin-group-profile-form.component.scss"],
})
export class AdminGroupProfileFormComponent implements OnInit, OnChanges {
  @Input() account: Account | null = null;

  profileForm: FormGroup;
  isSubmitting = false;
  maxLinks = 10; // Maximum number of web links allowed

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit() {
    if (this.account) {
      console.log("ngOnInit - account:", this.account);
      this.populateForm(this.account);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["account"] && changes["account"].currentValue) {
      console.log("ngOnChanges - account:", changes["account"].currentValue);
      this.populateForm(changes["account"].currentValue);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Basic Information
      name: ["", [Validators.required, Validators.maxLength(100)]],
      tagline: ["", [Validators.maxLength(200)]],
      description: ["", [Validators.maxLength(2000)]],

      // Group-specific details
      groupDetails: this.fb.group({
        groupType: [""],
        supportedLanguages: [""],
        googleCalendarUrl: [""],
        groupObjectivesMissionStatement: ["", [Validators.maxLength(2000)]],
        groupHistoryBackground: ["", [Validators.maxLength(2000)]],
        foundingDate: [""],
      }),

      // Contact Information
      contactInformation: this.fb.group({
        emails: this.fb.array([this.createEmailGroup()]),
        phoneNumbers: this.fb.array([this.createPhoneGroup()]),
        address: [""],
        city: [""],
        state: [""],
        zipCode: [""],
        country: [""],
      }),

      // Web Links
      webLinks: this.fb.array([]),
    });
  }

  private safeToDate(dateValue: any): Date | null {
    if (!dateValue) return null;

    // If it's already a Date object
    if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }

    // If it's a Firestore Timestamp with toDate method
    if (dateValue && typeof dateValue.toDate === "function") {
      try {
        const date = dateValue.toDate();
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    }

    // If it's a Firestore Timestamp object with seconds/nanoseconds properties
    if (dateValue && typeof dateValue.seconds === "number") {
      try {
        // Convert Firestore Timestamp to Date
        // Firestore Timestamp: { seconds: number, nanoseconds: number }
        const milliseconds =
          dateValue.seconds * 1000 +
          Math.floor((dateValue.nanoseconds || 0) / 1000000);
        const date = new Date(milliseconds);
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    }

    // If it's a string or number, try to parse it
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }
  private safeToTimestamp(dateValue: any): Timestamp | undefined {
    if (!dateValue) return undefined;

    // If it's already a Timestamp
    if (dateValue && typeof dateValue.toDate === "function") {
      return dateValue;
    }

    // If it's a Date object
    if (dateValue instanceof Date) {
      if (isNaN(dateValue.getTime())) {
        return undefined; // Invalid date
      }
      return Timestamp.fromDate(dateValue);
    }

    // Try to parse as Date first
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return undefined; // Invalid date
      }
      return Timestamp.fromDate(date);
    } catch {
      return undefined;
    }
  }

  private populateForm(account: Account) {
    if (!this.profileForm) {
      console.warn("Form not initialized yet");
      return;
    }

    const foundingDate = account.groupDetails?.dateFounded
      ? this.safeToDate(account.groupDetails.dateFounded)
      : null;

    // Convert date to ISO string for ion-datetime, but only if it's a valid date
    let foundingDateValue: string | null = null;
    if (foundingDate && !isNaN(foundingDate.getTime())) {
      // Use full ISO string for ion-datetime to ensure proper recognition
      foundingDateValue = foundingDate.toISOString();
    }

    console.log("Founding date conversion:", {
      original: account.groupDetails?.dateFounded,
      converted: foundingDate,
      isoValue: foundingDateValue,
    });

    // Update the form with the account data
    this.profileForm.patchValue({
      name: account.name || "",
      tagline: account.tagline || "",
      description: account.description || "",
      groupDetails: {
        groupType: account.groupDetails?.groupType || "",
        supportedLanguages: account.groupDetails?.supportedLanguages || "",
        googleCalendarUrl: account.groupDetails?.googleCalendarUrl || "",
        groupObjectivesMissionStatement:
          account.groupDetails?.groupObjectivesMissionStatement || "",
        groupHistoryBackground:
          account.groupDetails?.groupHistoryBackground || "",
        foundingDate: foundingDateValue,
      },
      contactInformation: {
        address: account.contactInformation?.addresses?.[0]?.street || "",
        city: account.contactInformation?.addresses?.[0]?.city || "",
        state: account.contactInformation?.addresses?.[0]?.state || "",
        zipCode: account.contactInformation?.addresses?.[0]?.zipcode || "",
        country: account.contactInformation?.addresses?.[0]?.country || "",
      },
    });

    // Force change detection for the founding date specifically
    setTimeout(() => {
      if (foundingDateValue) {
        this.profileForm
          .get("groupDetails.foundingDate")
          ?.setValue(foundingDateValue);
        this.profileForm
          .get("groupDetails.foundingDate")
          ?.updateValueAndValidity();
      }
    }, 100);

    // Populate email arrays
    this.populateEmails(account.contactInformation?.emails || []);

    // Populate phone arrays
    this.populatePhoneNumbers(account.contactInformation?.phoneNumbers || []);

    // Populate web links
    this.populateWebLinks(account.webLinks || []);
  }
  private populateEmails(emails: any[]) {
    const emailsArray = this.emailsArray;
    emailsArray.clear();

    if (emails.length === 0) {
      emailsArray.push(this.createEmailGroup());
    } else {
      emails.forEach((email) => {
        emailsArray.push(
          this.fb.group({
            name: [email.name || ""],
            email: [email.email || "", [Validators.email]],
          }),
        );
      });
    }
  }

  private populatePhoneNumbers(phoneNumbers: any[]) {
    const phoneNumbersArray = this.phoneNumbersArray;
    phoneNumbersArray.clear();

    if (phoneNumbers.length === 0) {
      phoneNumbersArray.push(this.createPhoneGroup());
    } else {
      phoneNumbers.forEach((phone) => {
        phoneNumbersArray.push(
          this.fb.group({
            type: [phone.type || "Mobile"],
            number: [phone.number || ""],
          }),
        );
      });
    }
  }

  private populateWebLinks(webLinks: any[]) {
    const webLinksArray = this.profileForm.get("webLinks") as FormArray;
    if (!webLinksArray) {
      console.warn("webLinksArray not found");
      return;
    }

    webLinksArray.clear();

    webLinks.forEach((link) => {
      const formGroup = this.fb.group({
        category: [link.category || "Personal Website"],
        url: [link.url || "", [Validators.pattern(/^https?:\/\/.+/)]],
        name: [link.name || ""],
      });
      webLinksArray.push(formGroup);
    });

    // Add empty link if none exist
    if (webLinks.length === 0) {
      this.addWebLink();
    }
  }

  createEmailGroup(): FormGroup {
    return this.fb.group({
      name: [""],
      email: ["", [Validators.email]],
    });
  }

  createPhoneGroup(): FormGroup {
    return this.fb.group({
      type: ["Mobile"],
      number: [""],
    });
  }

  get emailsArray(): FormArray {
    return this.profileForm.get("contactInformation.emails") as FormArray;
  }

  get phoneNumbersArray(): FormArray {
    return this.profileForm.get("contactInformation.phoneNumbers") as FormArray;
  }

  addEmail(): void {
    this.emailsArray.push(this.createEmailGroup());
  }

  removeEmail(index: number): void {
    if (this.emailsArray.length > 1) {
      this.emailsArray.removeAt(index);
    }
  }

  addPhoneNumber(): void {
    this.phoneNumbersArray.push(this.createPhoneGroup());
  }

  removePhoneNumber(index: number): void {
    if (this.phoneNumbersArray.length > 1) {
      this.phoneNumbersArray.removeAt(index);
    }
  }

  get webLinksArray(): FormArray {
    return this.profileForm.get("webLinks") as FormArray;
  }

  get webLinksFormArray(): FormArray {
    return this.webLinksArray;
  }

  addWebLink() {
    const webLinkGroup = this.fb.group({
      category: ["Personal Website"],
      url: ["", [Validators.pattern(/^https?:\/\/.+/)]],
      name: [""],
    });
    this.webLinksArray.push(webLinkGroup);
  }

  removeWebLink(index: number) {
    this.webLinksArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.profileForm.value;

      // Convert form data to Account structure
      const updatedAccount: Account = {
        ...this.account!,
        name: formValue.name,
        tagline: formValue.tagline,
        description: formValue.description,
        groupDetails: {
          ...this.account?.groupDetails,
          groupType: formValue.groupDetails.groupType,
          supportedLanguages: formValue.groupDetails.supportedLanguages,
          googleCalendarUrl: formValue.groupDetails.googleCalendarUrl,
          groupObjectivesMissionStatement:
            formValue.groupDetails.groupObjectivesMissionStatement,
          groupHistoryBackground: formValue.groupDetails.groupHistoryBackground,
          dateFounded: this.safeToTimestamp(
            formValue.groupDetails.foundingDate,
          ),
        },
        contactInformation: {
          ...this.account?.contactInformation,
          emails: formValue.contactInformation.emails || [],
          phoneNumbers: formValue.contactInformation.phoneNumbers || [],
          addresses: [
            {
              street: formValue.contactInformation.address,
              city: formValue.contactInformation.city,
              state: formValue.contactInformation.state,
              zipcode: formValue.contactInformation.zipCode,
              country: formValue.contactInformation.country,
              isPrimaryAddress: true,
            },
          ].filter((addr) => addr.street || addr.city), // Only include if has some address data
          preferredMethodOfContact: "Email",
        },
        webLinks: formValue.webLinks
          .filter((link: any) => link.url?.trim())
          .map((link: any) => ({
            name: link.name || link.category || "Website",
            url: link.url,
            category: link.category || "Personal Website",
          })),
      };

      this.store.dispatch(
        AccountActions.updateAccount({
          account: updatedAccount,
        }),
      );

      // Reset submitting state after a delay
      setTimeout(() => {
        this.isSubmitting = false;
      }, 1000);
    }
  }

  getFormattedFoundingDate(): string {
    const foundingDateValue = this.profileForm?.get(
      "groupDetails.foundingDate",
    )?.value;
    if (!foundingDateValue) return "";

    try {
      // Handle both full ISO strings and date-only strings
      const date = new Date(foundingDateValue);
      if (isNaN(date.getTime())) return "";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC", // Use UTC to avoid timezone shifts for date-only values
      });
    } catch {
      return "";
    }
  }

  onCancel(): void {
    if (this.account) {
      this.populateForm(this.account);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({onlySelf: true});

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((ctrl) => {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl);
          }
        });
      }
    });
  }

  getWebLinkTypes() {
    return [
      {value: "website", label: "Website"},
      {value: "facebook", label: "Facebook"},
      {value: "twitter", label: "Twitter"},
      {value: "linkedin", label: "LinkedIn"},
      {value: "instagram", label: "Instagram"},
      {value: "youtube", label: "YouTube"},
      {value: "donation", label: "Donation Page"},
      {value: "other", label: "Other"},
    ];
  }

  getGroupTypes() {
    return [
      {value: "nonprofit", label: "Nonprofit Organization"},
      {value: "cooperative", label: "Cooperative"},
      {value: "community", label: "Community Group"},
      {value: "advocacy", label: "Advocacy Organization"},
      {value: "educational", label: "Educational Institution"},
      {value: "other", label: "Other"},
    ];
  }

  /**
   * Format phone number input as user types
   */
  formatPhoneNumber(event: any, index: number): void {
    const input = event.target.value;
    const formatted = this.formatPhoneNumberString(input);

    // Update the form control value
    const phoneControl = this.phoneNumbersArray.at(index);
    phoneControl.get("number")?.setValue(formatted, {emitEvent: false});
  }

  /**
   * Format phone number to allow +##### country codes or (###) ###-#### format
   */
  private formatPhoneNumberString(value: string): string {
    // Remove all non-digit and non-plus characters except spaces for better UX
    const cleanValue = value.replace(/[^\d+\s]/g, "");

    // Don't format if empty
    if (!cleanValue) return "";

    // If it starts with +, handle international format
    if (cleanValue.startsWith("+")) {
      // Extract just the + and digits
      const plusAndDigits = cleanValue.replace(/[^\d+]/g, "");
      const digits = plusAndDigits.slice(1); // Remove the +

      if (digits.length === 0) return "+";
      if (digits.length <= 4) return `+${digits}`;

      // For longer numbers, format with country code + domestic format
      // Common country codes: +1 (US/CA), +44 (UK), +33 (FR), +49 (DE), etc.
      let countryCodeLength = 1; // Default for US

      // Determine country code length based on first digits
      if (digits.startsWith("1")) {
        countryCodeLength = 1;
      } else if (digits.length >= 2) {
        const firstTwo = digits.substring(0, 2);
        // Common 2-digit country codes
        if (["33", "44", "49", "81", "86", "91"].includes(firstTwo)) {
          countryCodeLength = 2;
        } else if (digits.length >= 3) {
          countryCodeLength = 3; // Assume 3-digit for others
        } else {
          countryCodeLength = 2;
        }
      }

      const countryCode = digits.slice(0, countryCodeLength);
      const remainder = digits.slice(countryCodeLength);

      if (remainder.length === 0) return `+${countryCode}`;
      if (remainder.length <= 3) return `+${countryCode} (${remainder}`;
      if (remainder.length <= 6)
        return `+${countryCode} (${remainder.slice(0, 3)}) ${remainder.slice(3)}`;

      // Full format: +## (###) ###-####
      const areaCode = remainder.slice(0, 3);
      const firstPart = remainder.slice(3, 6);
      const lastPart = remainder.slice(6, 10);
      return `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`;
    }

    // Domestic US format: (###) ###-####
    const digits = cleanValue.replace(/\D/g, "");
    if (digits.length <= 3) {
      return digits.length === 0 ? "" : `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      const areaCode = digits.slice(0, 3);
      const firstPart = digits.slice(3, 6);
      const lastPart = digits.slice(6, 10);
      return `(${areaCode}) ${firstPart}-${lastPart}`;
    }
  }
}
