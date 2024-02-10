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
import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Account, Email, PhoneNumber} from "../../../../models/account.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Timestamp} from "firebase/firestore";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";

@Component({
  selector: "app-edit-user-profile",
  templateUrl: "./edit-user-profile.page.html",
  styleUrls: ["./edit-user-profile.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, AppHeaderComponent],
})
export class EditUserProfilePage {
  private accountId: string | null = null;
  private accountsSubscription?: Subscription;
  public account?: Partial<Account>;

  editAccountForm = this.fb.group({
    name: ["", Validators.required],
    tagline: [""],
    description: [""],
    accessibility: this.fb.group({preferredLanguage: [""]}),
    userDetails: this.fb.group({
      dateOfBirth: [new Date().toISOString(), [Validators.required]],
    }),
    contactInformation: this.fb.group({
      emails: this.fb.array([
        this.fb.group({
          name: [""],
          email: ["", [Validators.required, Validators.email]],
        }),
      ]),
      phoneNumbers: this.fb.array([
        this.fb.group({
          countryCode: ["", [Validators.pattern("^[0-9]*$")]],
          number: ["", [Validators.pattern("^\\d{10}$")]],
          type: [""],
          isEmergencyNumber: [false],
        }),
      ]),
      address: this.fb.group({
        name: [""],
        street: ["", Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
        city: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
        state: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
        zipcode: ["", Validators.pattern("^[0-9]*$")],
        country: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
      }),
      preferredMethodOfContact: ["Email"],
    }),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private storeService: StoreService,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find(
          (account) => account.id === this.accountId,
        );
        if (this.account) {
          this.loadFormData();
        }
      },
    );
    if (!this.account) {
      this.storeService.getDocById("accounts", this.accountId);
    }
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  get phoneNumbersFormArray(): FormArray {
    return this.editAccountForm.get(
      "contactInformation.phoneNumbers",
    ) as FormArray;
  }

  get emailsFormArray(): FormArray {
    return this.editAccountForm.get("contactInformation.emails") as FormArray;
  }

  onSubmit() {
    if (this.account) {
      // Prepare the account object with form values
      const formValue = this.editAccountForm.value;
      const updatedAccount: Partial<Account> = {
        ...this.account,
        name: formValue.name ?? "",
        tagline: formValue.tagline ?? "",
        description: formValue.description ?? "",
        accessibility: {
          ...this.account.accessibility,
          preferredLanguage:
            formValue.accessibility?.preferredLanguage || "English",
        },
        contactInformation: {
          ...formValue.contactInformation,
          emails:
            formValue.contactInformation?.emails?.map(
              (email: Partial<Email>) => ({
                name: email.name ?? "Primary",
                email: email.email ?? "",
              }),
            ) ?? [],
          phoneNumbers: formValue.contactInformation?.phoneNumbers?.map(
            (phone: Partial<PhoneNumber>) => ({
              countryCode: phone.countryCode || "",
              number: phone.number || "",
              type: phone.type || "",
              isEmergencyNumber: phone.isEmergencyNumber || false,
            }),
          ) ?? [
            {countryCode: "", number: "", type: "", isEmergencyNumber: false},
          ],
          address: formValue.contactInformation?.address
            ? {
                ...formValue.contactInformation.address,
                name: formValue.contactInformation.address?.name || "", // Assign default or calculated value
                street: formValue.contactInformation.address?.street || "", // Assign default or calculated value
                city: formValue.contactInformation.address?.city || "", // Assign default or calculated value
                state: formValue.contactInformation.address?.state || "", // Assign default or calculated value
                zipcode: formValue.contactInformation.address?.zipcode || "", // Assign default or calculated value
                country: formValue.contactInformation.address?.country || "", // Assign default or calculated value
                formatted: formValue.contactInformation.address?.street || "", // Assign default or calculated value
                geopoint: formValue.contactInformation.address?.street || "", // Assign default or calculated value
              }
            : null, // Ensure address is null if undefined or not provided
          preferredMethodOfContact: "Email",
        },
        userDetails: {
          ...this.account.userDetails,
          dateOfBirth: Timestamp.fromDate(
            new Date(this.editAccountForm.value.userDetails?.dateOfBirth ?? ""),
          ),
        },
      };

      // Update the Firestore document
      this.storeService.updateDoc("accounts", updatedAccount);
      // .then(() => {
      //   console.log("Account updated successfully");
      //   this.backToProfile();
      // })
      // .catch((error) => {
      //   console.error("Error updating account:", error);
      // });
    }
  }

  backToProfile() {
    this.router.navigate(["/user-profile/", this.account?.id]);
  }

  // ageValidator(minAge: number): ValidatorFn {
  //   return (control: AbstractControl): {[key: string]: any} | null => {
  //     if (!control.value) {
  //       return null;
  //     }
  //     const dateOfBirth = new Date(control.value);
  //     const today = new Date();
  //     let age = today.getFullYear() - dateOfBirth.getFullYear();
  //     if (
  //       today.getMonth() < dateOfBirth.getMonth() ||
  //       (today.getMonth() == dateOfBirth.getMonth() &&
  //         today.getDate() < dateOfBirth.getDate())
  //     ) {
  //       age--;
  //     }
  //     return age >= minAge ? null : {ageInvalid: {value: control.value}};
  //   };
  // }

  loadFormData() {
    if (!this.account) return;
    this.editAccountForm.patchValue({
      name: this.account.name,
      tagline: this.account.tagline,
      description: this.account.description,
      accessibility: {
        preferredLanguage: this.account.accessibility?.preferredLanguage,
      },
      userDetails: {
        dateOfBirth:
          this.account.userDetails?.dateOfBirth?.toDate().toISOString() ??
          new Date().toISOString(),
      },
      contactInformation: {
        emails: this.account.contactInformation?.emails?.map((email) => ({
          name: email.name,
          email: email.email,
        })) || [{name: "Primary", email: ""}],
        phoneNumbers: this.account.contactInformation?.phoneNumbers?.map(
          (phone) => ({
            countryCode: phone.countryCode,
            number: phone.number,
            type: phone.type,
            isEmergencyNumber: phone.isEmergencyNumber,
          }),
        ) || [
          {countryCode: "", number: "", type: "", isEmergencyNumber: false},
        ],
        address: this.account.contactInformation?.address ?? {},
        preferredMethodOfContact:
          this.account.contactInformation?.preferredMethodOfContact,
      },
    });
  }
}
