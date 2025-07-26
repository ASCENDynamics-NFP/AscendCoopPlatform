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
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {
  Account,
  Address,
  Email,
  PhoneNumber,
  WebLink,
} from "@shared/models/account.model";
import {countryCodes} from "../../../../../../core/data/phone";
import {countries, statesProvinces} from "../../../../../../core/data/country";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {selectAccountById} from "../../../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../../../state/selectors/auth.selectors";
import {filter, take} from "rxjs/operators";

@Component({
  selector: "app-unified-registration",
  templateUrl: "./unified-registration.component.html",
  styleUrls: ["./unified-registration.component.scss"],
})
export class UnifiedRegistrationComponent implements OnChanges {
  @Input() account?: Account;
  @Input() accountType: "user" | "group" = "user";
  @Input() redirectSubmit: boolean = false;

  public maxAddresses = 3;
  public maxEmails = 5;
  public maxLinks = 10;
  public maxPhoneNumbers = 5;
  public countries = countries;
  public countryCodes = countryCodes.sort((a, b) =>
    Number(a.value) > Number(b.value) ? 1 : -1,
  );
  public statesProvinces = statesProvinces;

  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
  ) {
    this.initializeForm();
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
      description: [""],
      tagline: ["", Validators.required],
      name: ["", Validators.required],
      webLinks: this.fb.array([this.createWebLinkFormGroup()]),
      contactInformation: this.fb.group({
        emails: this.fb.array([this.createEmailFormGroup()]),
        phoneNumbers: this.fb.array([this.createPhoneNumberFormGroup()]),
        addresses: this.fb.array([this.createAddressFormGroup()]),
        preferredMethodOfContact: ["Email"],
      }),
    };

    // Add group-specific fields if account type is group
    if (this.accountType === "group") {
      (baseForm as any).groupDetails = this.fb.group({
        groupType: [],
        googleCalendarUrl: [],
      });
    }

    this.registrationForm = this.fb.group(baseForm);
  }

  get addressesFormArray(): FormArray {
    return this.registrationForm.get(
      "contactInformation.addresses",
    ) as FormArray;
  }

  get phoneNumbersFormArray(): FormArray {
    return this.registrationForm.get(
      "contactInformation.phoneNumbers",
    ) as FormArray;
  }

  get emailsFormArray(): FormArray {
    return this.registrationForm.get("contactInformation.emails") as FormArray;
  }

  get webLinksFormArray(): FormArray {
    return this.registrationForm.get("webLinks") as FormArray;
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
        ...formValue,
        type: this.accountType,
        name: formValue.name!,
        tagline: formValue.tagline!,
        description: formValue.description || "",
        webLinks:
          formValue.webLinks?.map((link: Partial<WebLink>) => ({
            name: link.name,
            url: link.url,
            category: link.category || "",
          })) || [],
        contactInformation: {
          ...this.account.contactInformation,
          ...formValue.contactInformation,
          emails:
            formValue.contactInformation!.emails?.map(
              (email: Partial<Email>) => ({
                name: email.name ?? null,
                email: email.email!,
              }),
            ) ?? [],
          phoneNumbers:
            formValue.contactInformation!.phoneNumbers?.map(
              (phone: Partial<PhoneNumber>) => ({
                countryCode: phone.countryCode ?? null,
                number: phone.number ?? null,
                type: phone.type ?? null,
                isEmergencyNumber: phone.isEmergencyNumber || false,
              }),
            ) ?? [],
          addresses:
            formValue.contactInformation!.addresses?.map(
              (address: Partial<Address>) => ({
                name: address?.name ?? null,
                street: address?.street ?? null,
                city: address?.city ?? null,
                state: address?.state ?? null,
                zipcode: address?.zipcode ?? null,
                country: address?.country ?? null,
              }),
            ) ?? [],
          preferredMethodOfContact:
            formValue.contactInformation?.preferredMethodOfContact || "Email",
        },
      };

      // Add group-specific details if it's a group
      if (this.isGroupRegistration && formValue.groupDetails) {
        baseAccount.groupDetails = {
          ...this.account.groupDetails,
          ...formValue.groupDetails,
          groupType: formValue.groupDetails?.groupType || "Nonprofit",
        };
      }

      this.store.dispatch(AccountActions.updateAccount({account: baseAccount}));

      if (this.redirectSubmit && this.account?.id) {
        // Wait for the AuthUser to be synced with the updated account type before redirecting
        this.store
          .select(selectAuthUser)
          .pipe(
            filter(
              (authUser) =>
                authUser?.type !== undefined && authUser.type !== "new",
            ),
            take(1),
          )
          .subscribe(() => {
            const redirectPath = this.isGroupRegistration
              ? `/account/${this.account!.id}`
              : `/account/registration/${this.account!.id}`;
            this.router.navigateByUrl(redirectPath);
          });
      }
    }
  }

  loadFormData() {
    if (!this.account) return;

    // Reset form arrays
    this.clearFormArrays();

    // Load web links
    this.account.webLinks?.forEach((webLink) => {
      this.webLinksFormArray.push(
        this.fb.group({
          name: [webLink.name],
          url: [
            webLink.url,
            [
              Validators.pattern(
                /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/,
              ),
            ],
          ],
          category: [webLink.category],
        }),
      );
    });

    if (this.webLinksFormArray.length === 0) {
      this.addWebLink();
    }

    // Load emails
    this.account.contactInformation?.emails?.forEach((email) => {
      this.emailsFormArray.push(
        this.fb.group({
          name: [email.name],
          email: [email.email, Validators.email],
        }),
      );
    });
    if (this.emailsFormArray.length === 0) {
      this.addEmail();
    }

    // Load phone numbers
    this.account.contactInformation?.phoneNumbers?.forEach((phone) => {
      this.phoneNumbersFormArray.push(
        this.fb.group({
          countryCode: [phone.countryCode],
          number: [phone.number, [Validators.pattern("^\\d{10}$")]],
          type: [phone.type],
          isEmergencyNumber: [phone.isEmergencyNumber],
        }),
      );
    });
    if (this.phoneNumbersFormArray.length === 0) {
      this.addPhoneNumber();
    }

    // Load addresses
    this.account.contactInformation?.addresses?.forEach((address) => {
      this.addressesFormArray.push(
        this.fb.group({
          name: [address?.name],
          street: [address?.street, Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
          city: [address?.city, Validators.pattern("^[a-zA-Z\\s]*$")],
          state: [address?.state],
          zipcode: [address?.zipcode, Validators.pattern("^[0-9]*$")],
          country: [address?.country],
        }),
      );
    });
    if (this.addressesFormArray.length === 0) {
      this.addAddress();
    }

    // Patch form values
    const formValues: any = {
      name: this.account.name,
      description: this.account.description,
      tagline: this.account.tagline,
      contactInformation: {
        emails: this.account.contactInformation?.emails?.map((email) => ({
          name: email.name,
          email: email.email,
        })) || [this.createEmailFormGroup()],
        phoneNumbers: this.account.contactInformation?.phoneNumbers?.map(
          (phone) => ({
            countryCode: phone.countryCode,
            number: phone.number,
            type: phone.type,
            isEmergencyNumber: phone.isEmergencyNumber,
          }),
        ) || [this.createPhoneNumberFormGroup()],
        addresses: this.account.contactInformation?.addresses || [
          this.createAddressFormGroup(),
        ],
      },
    };

    // Add group details if it's a group
    if (this.isGroupRegistration && this.account.groupDetails) {
      formValues.groupDetails = {
        groupType: this.account.groupDetails.groupType,
        googleCalendarUrl: this.account.groupDetails.googleCalendarUrl,
      };
    }

    this.registrationForm.patchValue(formValues);
  }

  private clearFormArrays(): void {
    while (this.webLinksFormArray.length !== 0) {
      this.webLinksFormArray.removeAt(0);
    }
    while (this.emailsFormArray.length !== 0) {
      this.emailsFormArray.removeAt(0);
    }
    while (this.phoneNumbersFormArray.length !== 0) {
      this.phoneNumbersFormArray.removeAt(0);
    }
    while (this.addressesFormArray.length !== 0) {
      this.addressesFormArray.removeAt(0);
    }
  }

  // Email methods
  addEmail(): void {
    if (this.emailsFormArray.length < this.maxEmails) {
      this.emailsFormArray.push(this.createEmailFormGroup());
    }
  }

  removeEmail(index: number): void {
    this.emailsFormArray.removeAt(index);
  }

  private createEmailFormGroup(): FormGroup {
    return this.fb.group({
      name: [""],
      email: ["", [Validators.email]],
    });
  }

  // Phone number methods
  createPhoneNumberFormGroup(): FormGroup {
    return this.fb.group({
      countryCode: [""],
      number: ["", [Validators.pattern("^\\d{10}$")]],
      type: [""],
      isEmergencyNumber: [false],
    });
  }

  addPhoneNumber(): void {
    if (this.phoneNumbersFormArray.length < this.maxPhoneNumbers) {
      this.phoneNumbersFormArray.push(this.createPhoneNumberFormGroup());
    }
  }

  removePhoneNumber(index: number): void {
    this.phoneNumbersFormArray.removeAt(index);
  }

  // Web link methods
  createWebLinkFormGroup(): FormGroup {
    return this.fb.group({
      name: ["", []],
      url: [
        "",
        [
          Validators.pattern(
            /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/,
          ),
        ],
      ],
      category: [""],
    });
  }

  addWebLink(): void {
    if (this.webLinksFormArray.length < this.maxLinks) {
      this.webLinksFormArray.push(this.createWebLinkFormGroup());
    }
  }

  removeWebLink(index: number): void {
    this.webLinksFormArray.removeAt(index);
  }

  // Address methods
  createAddressFormGroup(): FormGroup {
    return this.fb.group({
      name: [""],
      street: ["", Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
      city: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
      state: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
      zipcode: ["", Validators.pattern("^[0-9]*$")],
      country: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
      isPrimaryAddress: [false],
    });
  }

  addAddress(): void {
    this.addressesFormArray.push(this.createAddressFormGroup());
  }

  removeAddress(index: number): void {
    this.addressesFormArray.removeAt(index);
  }
}
