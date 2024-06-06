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
  FormArray,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {
  Account,
  Email,
  PhoneNumber,
  Address,
} from "../../../../../../models/account.model";
import {StoreService} from "../../../../../../core/services/store.service";
import {countryCodes} from "../../../../../../core/data/phone";
import {countries, statesProvinces} from "../../../../../../core/data/country";

@Component({
  selector: "app-contact-info",
  templateUrl: "./contact-info.component.html",
  styleUrls: ["./contact-info.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class ContactInfoComponent implements OnChanges {
  public countries = countries;
  public countryCodes = countryCodes.sort((a, b) =>
    Number(a.value) > Number(b.value) ? 1 : -1,
  );
  public statesProvinces = statesProvinces;
  public maxAddresses = 3; // Set maximum number of addresses
  public maxEmails = 5;
  public maxPhoneNumbers = 5;
  @Input() account: Partial<Account> | null = null;

  contactInfoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
  ) {
    this.contactInfoForm = this.fb.group({
      contactInformation: this.fb.group({
        emails: this.fb.array([this.createEmailFormGroup()]),
        phoneNumbers: this.fb.array([this.createPhoneNumberFormGroup()]),
        addresses: this.fb.array([this.createAddressFormGroup()]),
        preferredMethodOfContact: ["Email"],
      }),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["account"] && this.account) {
      this.loadFormData();
    }
  }

  get phoneNumbersFormArray(): FormArray {
    return this.contactInfoForm.get(
      "contactInformation.phoneNumbers",
    ) as FormArray;
  }

  get emailsFormArray(): FormArray {
    return this.contactInfoForm.get("contactInformation.emails") as FormArray;
  }

  get addressesFormArray(): FormArray {
    return this.contactInfoForm.get(
      "contactInformation.addresses",
    ) as FormArray;
  }

  onSubmit() {
    if (this.contactInfoForm.valid && this.account) {
      const formValue = this.contactInfoForm.value.contactInformation;

      const updatedAccount: Partial<Account> = {
        ...this.account,
        contactInformation: {
          ...formValue,
          emails: formValue.emails.map((email: Partial<Email>) => ({
            name: email.name ?? null,
            email: email.email!,
          })),
          phoneNumbers: formValue.phoneNumbers.map(
            (phone: Partial<PhoneNumber>) => ({
              countryCode: phone.countryCode ?? null,
              number: phone.number ?? null,
              type: phone.type ?? null,
              isEmergencyNumber: phone.isEmergencyNumber || false,
            }),
          ),
          addresses: formValue.addresses.map((address: Partial<Address>) => ({
            name: address?.name ?? null,
            street: address?.street ?? null,
            city: address?.city ?? null,
            state: address?.state ?? null,
            zipcode: address?.zipcode ?? null,
            country: address?.country ?? null,
            isPrimaryAddress: address?.isPrimaryAddress || false,
          })),
        },
      };

      this.storeService.updateDoc("accounts", updatedAccount);
    }
  }

  loadFormData() {
    if (!this.account) return;

    const contactInfo = this.account.contactInformation;

    this.resetFormArrays();

    contactInfo?.emails?.forEach((email) => {
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

    contactInfo?.phoneNumbers?.forEach((phone) => {
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

    contactInfo?.addresses?.forEach((address) => {
      this.addressesFormArray.push(
        this.fb.group({
          name: [address?.name],
          street: [address?.street, Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
          city: [address?.city, Validators.pattern("^[a-zA-Z\\s]*$")],
          state: [address?.state],
          zipcode: [address?.zipcode, Validators.pattern("^[0-9]*$")],
          country: [address?.country],
          isPrimaryAddress: [address?.isPrimaryAddress],
        }),
      );
    });

    if (this.addressesFormArray.length === 0) {
      this.addAddress();
    }

    this.contactInfoForm.patchValue({
      contactInformation: {
        preferredMethodOfContact:
          contactInfo?.preferredMethodOfContact || "Email",
      },
    });
  }

  resetFormArrays() {
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

  createAddressFormGroup(): FormGroup {
    return this.fb.group({
      name: [""],
      street: ["", Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
      city: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
      state: [""],
      zipcode: ["", Validators.pattern("^[0-9]*$")],
      country: [""],
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
