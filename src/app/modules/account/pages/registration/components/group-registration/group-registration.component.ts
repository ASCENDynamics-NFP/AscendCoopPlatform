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
// group-registration.component.ts
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

@Component({
  selector: "app-group-registration",
  templateUrl: "./group-registration.component.html",
  styleUrls: ["./group-registration.component.scss"],
})
export class GroupRegistrationComponent implements OnChanges {
  @Input() account?: Account;
  @Input() redirectSubmit: boolean = false;
  public maxAddresses = 3; // Set maximum number of addresses
  public maxEmails = 5;
  public maxLinks = 10;
  public maxPhoneNumbers = 5;
  public countries = countries; // List of countries for the address
  public countryCodes = countryCodes.sort((a, b) =>
    Number(a.value) > Number(b.value) ? 1 : -1,
  ); // List of country codes for phone numbers
  public statesProvinces = statesProvinces; // List of states/provinces for the selected country

  editAccountForm!: FormGroup; // Declare the form but don't initialize it yet

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
  ) {
    // Initialize the form in ngOnInit after fb is initialized
    this.editAccountForm = this.fb.group({
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
      groupDetails: this.fb.group({
        groupType: [],
        googleCalendarUrl: [],
      }),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["account"] && this.account) {
      this.loadFormData();
    }
  }

  get addressesFormArray(): FormArray {
    return this.editAccountForm.get(
      "contactInformation.addresses",
    ) as FormArray;
  }

  get phoneNumbersFormArray(): FormArray {
    return this.editAccountForm.get(
      "contactInformation.phoneNumbers",
    ) as FormArray;
  }

  get emailsFormArray(): FormArray {
    return this.editAccountForm.get("contactInformation.emails") as FormArray;
  }

  /**
   * Returns the FormArray for the webLinks control in the editAccountForm.
   * @returns {FormArray} The FormArray for the webLinks control.
   */
  get webLinksFormArray(): FormArray {
    return this.editAccountForm.get("webLinks") as FormArray;
  }

  onSubmit() {
    if (this.account) {
      const formValue = this.editAccountForm.value;

      const updatedAccount: Account = {
        ...this.account,
        ...formValue,
        type: "group",
        name: formValue.name!,
        tagline: formValue.tagline!,
        description: formValue.description || "",
        webLinks:
          formValue.webLinks?.map((link: Partial<WebLink>) => ({
            name: link.name,
            url: link.url,
            category: link.category || "",
          })) || [],
        groupDetails: {
          ...this.account.groupDetails,
          ...formValue.groupDetails,
          groupType: formValue.groupDetails?.groupType || "Nonprofit",
        },
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
          phoneNumbers: formValue.contactInformation!.phoneNumbers?.map(
            (phone: Partial<PhoneNumber>) => ({
              countryCode: phone.countryCode ?? null,
              number: phone.number ?? null,
              type: phone.type ?? null,
              isEmergencyNumber: phone.isEmergencyNumber || false,
            }),
          ) ?? [
            {
              countryCode: null,
              number: null,
              type: null,
              isEmergencyNumber: false,
            },
          ],
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
          preferredMethodOfContact: "Email",
        },
      };

      this.store.dispatch(
        AccountActions.updateAccount({account: updatedAccount}),
      );

      if (this.redirectSubmit) {
        this.router.navigateByUrl(`/account/${this.account.id}/details`);
      }
    }
  }

  loadFormData() {
    if (!this.account) return;

    // Reset form arrays
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

    // Load data from account into form arrays and form controls
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

    this.editAccountForm.patchValue({
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
      groupDetails: {
        groupType: this.account.groupDetails?.groupType,
        googleCalendarUrl: this.account.groupDetails?.googleCalendarUrl,
      },
    });
  }

  /**
   * Adds a new email form group to the emails form array, up to a max of maxEmails.
   * This allows an additional email input to be displayed in the form.
   */
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
    // Remove the link at the given index
    this.webLinksFormArray.removeAt(index);
  }

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
