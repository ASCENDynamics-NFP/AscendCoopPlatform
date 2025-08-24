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
      number: ["", [Validators.pattern("^[+]?[0-9()\\s-]{10,25}$")]],
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
   * Format phone number to (###) ###-#### or +# (###) ###-#### pattern
   */
  private formatPhoneNumberString(value: string): string {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Don't format if empty
    if (!digits) return "";

    // Limit to 16 digits
    const limitedDigits = digits.slice(0, 16);

    // Determine if it's an international number (starts with country code other than 1)
    const isInternational =
      limitedDigits.length > 10 ||
      (limitedDigits.length === 11 && limitedDigits[0] !== "1");

    if (isInternational) {
      // International format: +# (###) ###-#### or +## (###) ###-#### etc.
      if (limitedDigits.length <= 1) {
        return `+${limitedDigits}`;
      } else if (limitedDigits.length <= 4) {
        return `+${limitedDigits}`;
      } else if (limitedDigits.length <= 7) {
        const countryCode = limitedDigits.slice(0, -6);
        const areaCode = limitedDigits.slice(-6, -3);
        return `+${countryCode} (${areaCode})`;
      } else if (limitedDigits.length <= 10) {
        const countryCode = limitedDigits.slice(0, -6);
        const areaCode = limitedDigits.slice(-6, -3);
        const firstPart = limitedDigits.slice(-3);
        return `+${countryCode} (${areaCode}) ${firstPart}`;
      } else {
        const countryCode = limitedDigits.slice(0, -10);
        const areaCode = limitedDigits.slice(-10, -7);
        const firstPart = limitedDigits.slice(-7, -4);
        const lastPart = limitedDigits.slice(-4);
        return `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`;
      }
    } else {
      // Domestic US format: (###) ###-####
      if (limitedDigits.length <= 3) {
        return limitedDigits.length === 0 ? "" : `(${limitedDigits}`;
      } else if (limitedDigits.length <= 6) {
        return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
      } else {
        const areaCode = limitedDigits.slice(0, 3);
        const firstPart = limitedDigits.slice(3, 6);
        const lastPart = limitedDigits.slice(6, 10);
        return `(${areaCode}) ${firstPart}-${lastPart}`;
      }
    }
  }
}
