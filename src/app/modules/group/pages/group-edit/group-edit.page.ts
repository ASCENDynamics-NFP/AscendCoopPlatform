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
  account: Partial<Account> | null = {}; // define your user here
  groupId: string | null = null;

  editGroupForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    description: [""],
    tagline: [""],
    name: ["", Validators.required],
    supportedlanguages: [["en"]],
    groupDetails: this.fb.group({
      dateFounded: [new Date().toISOString(), [Validators.required]],
      supportedLanguages: [["en"]],
    }),
    address: this.fb.group({
      name: [""],
      street: ["", Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
      city: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
      state: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
      zipcode: ["", Validators.pattern("^[0-9]*$")],
      country: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
    }),
    phone: this.fb.group({
      number: ["", [Validators.pattern("^\\d{10}$")]],
      countryCode: ["", [Validators.pattern("^[0-9]*$")]],
      type: [""],
    }),
  });

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account =
          accounts.find((account) => account.id === this.groupId) || null;
        if (this.account) {
          // Update the form with the group data
          this.editGroupForm.patchValue({
            name: this.account.name,
            email: this.account.email,
            description: this.account.description,
            tagline: this.account.tagline,
            groupDetails: {
              ...this.account.groupDetails,
              // admins: this.account.groupDetails?.admins ?? [],
              dateFounded: this.account.groupDetails?.dateFounded
                ?.toDate()
                .toISOString(), // Make sure dateFounded is a Date object
            },
            address: {
              ...this.account.address,
              street: this.editGroupForm.value.address?.street ?? "",
              city: this.editGroupForm.value.address?.city ?? "",
              state: this.editGroupForm.value.address?.state ?? "",
              zipcode: this.editGroupForm.value.address?.zipcode ?? "",
              country: this.editGroupForm.value.address?.country ?? "",
              name: this.editGroupForm.value.address?.name ?? "",
              // formatted: this.account.address?.formatted ?? "",
              // geopoint: this.account.address?.geopoint ?? "",
            },
            phone: {
              ...this.account.phone,
              number: this.editGroupForm.value.phone?.number ?? "",
              type: this.editGroupForm.value.phone?.type ?? "",
              countryCode: this.editGroupForm.value.phone?.countryCode ?? "",
            },
          });
        }
      },
    );
  }

  ionViewWillLeave() {
    // Unsubscribe from the accounts$ observable when the component is destroyed
    this.accountsSubscription?.unsubscribe();
  }

  onSubmit() {
    // Call the API to save changes
    if (this.account) {
      this.account.id = this.account.id
        ? this.account.id
        : this.groupId
        ? this.groupId
        : "";
      this.account.email = this.editGroupForm.value.email || "";
      this.account.phone = {
        countryCode: this.editGroupForm.value.phone?.countryCode || "",
        number: this.editGroupForm.value.phone?.number || "",
        type: this.editGroupForm.value.phone?.type || "",
      };
      this.account.description = this.editGroupForm.value.description || "";
      this.account.tagline = this.editGroupForm.value.tagline || "";
      this.account.name = this.editGroupForm.value.name || "";
      this.account.groupDetails = {
        admins: this.account.groupDetails?.admins || [],
        dateFounded: Timestamp.fromDate(
          new Date(this.editGroupForm.value.groupDetails?.dateFounded || ""),
        ),
        supportedLanguages:
          this.editGroupForm.value.groupDetails?.supportedLanguages || [],
      };
      this.account.address = {
        street: this.editGroupForm.value.address?.street ?? "",
        city: this.editGroupForm.value.address?.city ?? "",
        state: this.editGroupForm.value.address?.state ?? "",
        zipcode: this.editGroupForm.value.address?.zipcode ?? "",
        country: this.editGroupForm.value.address?.country ?? "",
        name: this.editGroupForm.value.address?.name ?? "",
        formatted: this.account.address?.formatted ?? "",
        geopoint: this.account.address?.geopoint ?? "",
      };

      this.storeService.updateDoc("accounts", this.account);
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
