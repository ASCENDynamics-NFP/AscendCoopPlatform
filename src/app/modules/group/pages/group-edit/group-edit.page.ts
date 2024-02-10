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
  // AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  // ValidatorFn,
  Validators,
} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../models/account.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Timestamp} from "firebase/firestore";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-group-edit",
  templateUrl: "./group-edit.page.html",
  styleUrls: ["./group-edit.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class GroupEditPage {
  private accountsSubscription?: Subscription;
  account: Partial<Account> | null = null;
  groupId: string | null = null;

  editAccountForm = this.fb.group({
    description: [""],
    tagline: [""],
    name: ["", Validators.required],
    contactInformation: this.fb.group({
      emails: this.fb.array([
        this.fb.group({
          name: ["Primary"],
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
        // Include formatted and geopoint if needed here, or handle them in your backend logic
      }),
      preferredMethodOfContact: ["Email"],
    }),
    groupDetails: this.fb.group({
      dateFounded: [new Date().toISOString(), [Validators.required]],
      supportedLanguages: [["en"]], // Assuming 'en' as a default supported language
    }),
  });

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account =
          accounts.find((account) => account.id === this.groupId) || null;
        if (this.account) {
          this.loadFormData();
        }
      },
    );
    if (!this.account) {
      this.storeService.getDocById("accounts", this.groupId);
    }
  }

  ionViewWillLeave() {
    // Unsubscribe from the accounts$ observable when the component is destroyed
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

  loadFormData() {
    if (!this.account) return;
    this.editAccountForm.patchValue({
      name: this.account.name,
      description: this.account.description,
      tagline: this.account.tagline,
      groupDetails: {
        dateFounded:
          this.account.groupDetails?.dateFounded?.toDate().toISOString() ||
          new Date().toISOString(),
        supportedLanguages: this.account.groupDetails?.supportedLanguages || [
          "en",
        ],
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
        address: this.account.contactInformation?.address || {},
        preferredMethodOfContact:
          this.account.contactInformation?.preferredMethodOfContact || "Email",
      },
      // Add other necessary field updates here
    });
  }

  onSubmit() {
    // Call the API to save changes
    if (this.account) {
      // Prepare the account object with form values
      const formValue = this.editAccountForm.value;
      this.storeService.updateDoc("accounts", {...this.account, ...formValue});
      // .then(() => {
      //   console.log("Group updated successfully");
      //   this.toGroupPage(); // Navigate to the group page or show a success message
      // }).catch(error => {
      //   console.error("Error updating group:", error);
      // });
    }
  }

  deleteGroup() {
    if (this.groupId) this.storeService.deleteDoc("accounts", this.groupId);
    this.router.navigate(["/group-list"]);
  }

  toGroupPage() {
    this.router.navigateByUrl(`/group/${this.groupId}/${this.groupId}/details`);
  }
}
