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

import {AppGroup} from "../../../../models/group.model";
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
  private groupsSubscription: Subscription | undefined;
  group: Partial<AppGroup> | null = {}; // define your user here
  groupId: string | null = null;

  editGroupForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    description: [""],
    tagline: [""],
    name: ["", Validators.required],
    supportedlanguages: [["en"]],
    phoneCountryCode: ["", [Validators.pattern("^[0-9]*$")]],
    number: ["", [Validators.pattern("^\\d{10}$")]],
    addressName: [""],
    addressStreet: ["", Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
    addressCity: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
    addressState: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
    addressZipcode: ["", Validators.pattern("^[0-9]*$")],
    addressCountry: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
    dateFounded: [new Date().toISOString()], //, [Validators.required, this.ageValidator(18)]],
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
    this.groupsSubscription = this.storeService.accounts$.subscribe(
      (groups) => {
        this.group = groups.find((group) => group.id === this.groupId) || null;
        if (this.group) {
          // Update the form with the group data
          this.editGroupForm.patchValue({
            name: this.group.name,
            email: this.group.email,
            number: this.group.number,
            description: this.group.description,
            tagline: this.group.tagline,
            supportedlanguages: this.group.supportedlanguages,
            phoneCountryCode: this.group.phoneCountryCode,
            addressName: this.group.addressName,
            addressStreet: this.group.addressStreet,
            addressCity: this.group.addressCity,
            addressState: this.group.addressState,
            addressZipcode: this.group.addressZipcode,
            addressCountry: this.group.addressCountry,
            dateFounded: this.group.dateFounded?.toDate().toISOString(), // Make sure dateFounded is a Date object
          });
        }
      },
    );
  }

  ionViewWillLeave() {
    // Unsubscribe from the accounts$ observable when the component is destroyed
    this.groupsSubscription?.unsubscribe();
  }

  onSubmit() {
    // Call the API to save changes
    if (this.group) {
      this.group.id = this.group.id
        ? this.group.id
        : this.groupId
        ? this.groupId
        : "";
      this.group.email = this.editGroupForm.value.email || "";
      this.group.number = this.editGroupForm.value.number || "";
      this.group.description = this.editGroupForm.value.description || "";
      this.group.tagline = this.editGroupForm.value.tagline || "";
      this.group.name = this.editGroupForm.value.name || "";
      this.group.supportedlanguages =
        this.editGroupForm.value.supportedlanguages || [];
      this.group.phoneCountryCode =
        this.editGroupForm.value.phoneCountryCode || "";
      this.group.addressName = this.editGroupForm.value.addressName || "";
      this.group.addressStreet = this.editGroupForm.value.addressStreet || "";
      this.group.addressCity = this.editGroupForm.value.addressCity || "";
      this.group.addressState = this.editGroupForm.value.addressState || "";
      this.group.addressZipcode = this.editGroupForm.value.addressZipcode || "";
      this.group.addressCountry = this.editGroupForm.value.addressCountry || "";
      this.group.dateFounded = Timestamp.fromDate(
        new Date(this.editGroupForm.value.dateFounded || ""),
      );

      this.storeService.updateDoc("groups", this.group);
    }
  }

  deleteGroup() {
    if (this.groupId) this.storeService.deleteDoc("groups", this.groupId);
    this.router.navigate(["/group-list"]);
  }

  toGroupPage() {
    this.router.navigateByUrl(`/group/${this.groupId}/${this.groupId}/details`);
  }
}
