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
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Account} from "../../../../../../../../shared/models/account.model";
import {Timestamp} from "firebase/firestore";
import {Store} from "@ngrx/store";
import {AccountSectionsService} from "../../../../services/account-sections.service";
import {take} from "rxjs/operators";
import {AccountsService} from "../../../../../../core/services/accounts.service";
import {firstValueFrom} from "rxjs";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {formatPhoneNumber} from "../../../../../../core/utils/phone.util";

@Component({
  standalone: false,
  selector: "app-admin-group-profile-form",
  templateUrl: "./admin-group-profile-form.component.html",
  styleUrls: ["./admin-group-profile-form.component.scss"],
})
export class AdminGroupProfileFormComponent implements OnInit, OnChanges {
  @Input() account: Account | null = null;

  profileForm: FormGroup;
  isSubmitting = false;
  maxLinks = 10; // Maximum number of web links allowed
  maxAddresses = 3; // Maximum number of addresses allowed
  private skipNextContactInfoReload = false; // Flag to prevent reload after save
  /** Tracks which account ID's contact info has already been fetched so
   * repeated emissions of the same account (common with NgRx store + Ionic
   * view caching) don't fire redundant Firestore reads. Reset to null on
   * component destruction when @if recreates the component. */
  private loadedContactInfoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private sections: AccountSectionsService,
    private accountsService: AccountsService,
    private cdr: ChangeDetectorRef,
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit() {
    // populateForm and contactInfo load are both handled by ngOnChanges,
    // which fires before ngOnInit on first creation with the initial @Input value.
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["account"] && changes["account"].currentValue) {
      const acc = changes["account"].currentValue as Account;
      // Skip if form has unsaved changes (user is editing)
      if (this.profileForm?.dirty) {
        return;
      }

      if (this.skipNextContactInfoReload) {
        this.skipNextContactInfoReload = false;
        // Still populate main form fields but not contact info
        this.populateForm(acc);
        return;
      }

      // Only repopulate the form when the account ID changes (first load per
      // component instance, or when navigating to a different account).
      // Subsequent emissions of the same account (store updates, relatedAccounts
      // load completing, etc.) must NOT call populateForm again — that setTimeout
      // inside populateForm fires after populateAddresses has already run and
      // triggers updateValueAndValidity which resets the @for loop rendering.
      if (acc?.id && acc.id !== this.loadedContactInfoId) {
        this.loadedContactInfoId = acc.id;
        this.populateForm(acc);
        this.sections
          .contactInfo$(acc.id)
          .pipe(take(1))
          .subscribe((ci) => {
            const fallback = acc?.contactInformation;
            if (ci) {
              this.populateEmails(ci.emails || []);
              this.populatePhoneNumbers(ci.phoneNumbers || []);
              this.populateAddresses(ci.addresses || []);
            } else if (fallback) {
              this.populateEmails((fallback.emails as any[]) || []);
              this.populatePhoneNumbers((fallback.phoneNumbers as any[]) || []);
              this.populateAddresses((fallback.addresses as any[]) || []);
            }
          });
      } else {
        // Same account ID — form already populated, no re-fetch needed
      }
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
        foundingDate: ["", [Validators.required]],
      }),

      // Contact Information
      contactInformation: this.fb.group({
        emails: this.fb.array([this.createEmailGroup()]),
        phoneNumbers: this.fb.array([this.createPhoneGroup()]),
        addresses: this.fb.array([this.createAddressGroup()]),
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

    // Do not populate contact info from base account document.
    // Contact info is loaded from sections/contactInfo via AccountSectionsService.

    // Populate web links
    this.populateWebLinks(account.webLinks || []);
  }
  private populateEmails(emails: any[]) {
    const arr = this.emailsArray;
    const items = emails.length > 0 ? emails : [{}];
    while (arr.length < items.length) arr.push(this.createEmailGroup());
    while (arr.length > items.length) arr.removeAt(arr.length - 1);
    // detectChanges() creates DOM nodes for any newly-pushed controls so
    // Stencil's ion-input Shadow DOM is initialized before patchValue runs.
    this.cdr.detectChanges();
    items.forEach((email, i) =>
      arr.at(i).patchValue({name: email.name || "", email: email.email || ""}),
    );
  }

  private populatePhoneNumbers(phoneNumbers: any[]) {
    const arr = this.phoneNumbersArray;
    const items = phoneNumbers.length > 0 ? phoneNumbers : [{}];
    while (arr.length < items.length) arr.push(this.createPhoneGroup());
    while (arr.length > items.length) arr.removeAt(arr.length - 1);
    this.cdr.detectChanges();
    items.forEach((phone, i) =>
      arr
        .at(i)
        .patchValue({type: phone.type || "Mobile", number: phone.number || ""}),
    );
  }

  private populateAddresses(addresses: any[]) {
    const arr = this.addressesArray;
    const items = addresses.length > 0 ? addresses : [{}];
    while (arr.length < items.length) arr.push(this.createAddressGroup());
    while (arr.length > items.length) arr.removeAt(arr.length - 1);
    this.cdr.detectChanges();
    items.forEach((address, i) =>
      arr.at(i).patchValue({
        name: address.name || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipcode: address.zipcode || "",
        country: address.country || "",
        isPrimaryAddress: address.isPrimaryAddress || false,
      }),
    );
  }

  private populateWebLinks(webLinks: any[]) {
    const arr = this.profileForm.get("webLinks") as FormArray;
    if (!arr) return;
    const createLinkGroup = (link: any) =>
      this.fb.group({
        category: [link.category || "Website"],
        url: [link.url || "", [Validators.pattern(/^https?:\/\/.+/)]],
        name: [link.name || ""],
      });
    const items = webLinks.length > 0 ? webLinks : [{}];
    while (arr.length < items.length)
      arr.push(createLinkGroup(items[arr.length]));
    while (arr.length > items.length) arr.removeAt(arr.length - 1);
    items.forEach((link, i) =>
      arr.at(i).patchValue({
        category: link.category || "Website",
        url: link.url || "",
        name: link.name || "",
      }),
    );
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

  createAddressGroup(): FormGroup {
    return this.fb.group({
      name: [""],
      street: [""],
      city: [""],
      state: [""],
      zipcode: [""],
      country: [""],
      isPrimaryAddress: [false],
    });
  }

  get emailsArray(): FormArray {
    return this.profileForm.get("contactInformation.emails") as FormArray;
  }

  get phoneNumbersArray(): FormArray {
    return this.profileForm.get("contactInformation.phoneNumbers") as FormArray;
  }

  get addressesArray(): FormArray {
    return this.profileForm.get("contactInformation.addresses") as FormArray;
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

  addAddress(): void {
    if (this.addressesArray.length < this.maxAddresses) {
      this.addressesArray.push(this.createAddressGroup());
    }
  }

  removeAddress(index: number): void {
    if (this.addressesArray.length > 1) {
      this.addressesArray.removeAt(index);
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
      category: ["Website"],
      url: ["", [Validators.pattern(/^https?:\/\/.+/)]],
      name: [""],
    });
    this.webLinksArray.push(webLinkGroup);
  }

  removeWebLink(index: number) {
    this.webLinksArray.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.profileForm.value;

      // Convert form data to Account structure (exclude private contact info)
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
          ...(formValue.groupDetails.foundingDate && {
            dateFounded: this.safeToTimestamp(
              formValue.groupDetails.foundingDate,
            ),
          }),
        },
        webLinks: formValue.webLinks
          .filter((link: any) => link.url?.trim())
          .map((link: any) => ({
            name: link.name || link.category || "Website",
            url: link.url,
            category: link.category || "Website",
          })),
      };

      // Save private contact info in subcollection
      try {
        const payload = {
          emails: formValue.contactInformation.emails || [],
          phoneNumbers: formValue.contactInformation.phoneNumbers || [],
          addresses:
            formValue.contactInformation.addresses
              ?.filter((addr: any) => addr.street?.trim() || addr.city?.trim())
              .map((addr: any) => ({
                name: addr.name || null,
                street: addr.street || null,
                city: addr.city || null,
                state: addr.state || null,
                zipcode: addr.zipcode || null,
                country: addr.country || null,
                isPrimaryAddress: addr.isPrimaryAddress || false,
              })) || [],
          preferredMethodOfContact: "Email",
        } as any;
        await firstValueFrom(
          this.accountsService.updateAccount(this.account!.id, {
            contactInformation: payload,
          } as any),
        );
      } catch (e) {
        console.error(
          "[AdminGroupProfileForm] Failed to save contact info:",
          e,
        );
      }

      // Set flag to prevent ngOnChanges from reloading contactInfo and overwriting user's edits
      this.skipNextContactInfoReload = true;

      // IMPORTANT: Remove contactInformation from the account update
      // It was already saved via the callable function above
      // If we include it here, it will overwrite with stale data from NgRx store
      const accountForNgrx = {...updatedAccount};
      delete (accountForNgrx as any).contactInformation;

      this.store.dispatch(
        AccountActions.updateAccount({
          account: accountForNgrx,
        }),
      );

      // Mark form as pristine after successful save
      this.profileForm.markAsPristine();

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
    const formatted = formatPhoneNumber(input);

    // Update the form control value
    const phoneControl = this.phoneNumbersArray.at(index);
    phoneControl.get("number")?.setValue(formatted, {emitEvent: false});
  }
}
