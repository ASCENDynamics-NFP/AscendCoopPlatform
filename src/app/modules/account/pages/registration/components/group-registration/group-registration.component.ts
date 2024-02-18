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
import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {
  Account,
  Email,
  PhoneNumber,
} from "../../../../../../models/account.model";
import {StoreService} from "../../../../../../core/services/store.service";

@Component({
  selector: "app-group-registration",
  templateUrl: "./group-registration.component.html",
  styleUrls: ["./group-registration.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class GroupRegistrationComponent {
  @Input() account?: Partial<Account>;
  public maxEmails = 5;
  public maxLinks = 10;
  public maxPhoneNumbers = 5;

  editAccountForm = this.fb.group({
    description: [""],
    tagline: ["", Validators.required],
    name: ["", Validators.required],
    webLinks: this.fb.array([this.createWebLinkFormGroup()]),
    contactInformation: this.fb.group({
      emails: this.fb.array([this.createEmailFormGroup()]),
      phoneNumbers: this.fb.array([this.createPhoneNumberFormGroup()]),
      address: this.fb.group({
        name: [""],
        street: ["", Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
        city: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
        state: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
        zipcode: ["", Validators.pattern("^[0-9]*$")],
        country: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
        // Include formatted and geopoint if needed here, or handle them in your backend logic
      }),
      preferredMethodOfContact: ["Email"],
    }),
    groupDetails: this.fb.group({
      // dateFounded: [new Date().toISOString(), [Validators.required]],
      // supportedLanguages: [["en"]], // Assuming 'en' as a default supported language
      groupType: [],
    }),
  });

  constructor(private fb: FormBuilder, private storeService: StoreService) {}

  get phoneNumbersFormArray(): FormArray {
    return this.editAccountForm.get(
      "contactInformation.phoneNumbers",
    ) as FormArray;
  }

  get emailsFormArray(): FormArray {
    return this.editAccountForm.get("contactInformation.emails") as FormArray;
  }

  get webLinksFormArray(): FormArray {
    return this.editAccountForm.get("webLinks") as FormArray;
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
      countryCode: ["", [Validators.pattern("^[0-9]*$")]],
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
    // Remove the phone number form group at the given index
    this.phoneNumbersFormArray.removeAt(index);
  }

  createWebLinkFormGroup(): FormGroup {
    return this.fb.group({
      name: ["", []],
      url: ["", []],
      category: [""],
    });
  }

  addWebLink(): void {
    if (this.webLinksFormArray.length < this.maxLinks) {
      this.webLinksFormArray.push(this.createPhoneNumberFormGroup());
    }
  }

  removeWebLink(index: number): void {
    // Remove the phone number form group at the given index
    this.webLinksFormArray.removeAt(index);
  }

  onSubmit() {
    // Call the API to save changes
    if (this.account) {
      // Prepare the account object with form values
      const formValue = this.editAccountForm.value;

      // Prepare the account object for update
      const updatedAccount: Partial<Account> = {
        ...this.account,
        ...formValue,
        name: formValue.name!,
        tagline: formValue.tagline!,
        description: formValue.description ?? "",
        type: this.account.type ?? "group",
        groupDetails: {
          ...formValue.groupDetails,
          // Only convert dateFounded to Timestamp if it exists and is a valid date string
          // dateFounded: formValue.groupDetails?.dateFounded
          //   ? Timestamp.fromDate(new Date(formValue.groupDetails.dateFounded))
          //   : Timestamp.fromDate(new Date()), // Handle null or undefined appropriately
          // supportedLanguages: formValue.groupDetails?.supportedLanguages
          //   ? [...formValue.groupDetails.supportedLanguages]
          //   : ["en"], // Use an empty array as fallback
          groupType: formValue.groupDetails?.groupType || "Nonprofit",
        },
        contactInformation: {
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
          address: formValue.contactInformation!.address,
          preferredMethodOfContact: "Email",
        },
      };

      // Now update the document with the updatedAccount
      this.storeService.updateDoc("accounts", updatedAccount);
      // .then(() => {
      //   console.log("Group updated successfully");
      //   this.toGroupPage(); // Navigate to the group page or show a success message
      // }).catch(error => {
      //   console.error("Error updating group:", error);
      // });
    }
  }
}
