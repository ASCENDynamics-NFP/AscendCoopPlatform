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
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../models/account.model";
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
  private uid: string | null = null;
  private accountsSubscription?: Subscription;
  public account?: Partial<Account>;

  editProfileForm = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    description: [""],
    tagline: [""],
    language: [""],
    userDetails: this.fb.group({
      dateOfBirth: [new Date().toISOString(), [Validators.required]],
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
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private storeService: StoreService,
  ) {
    this.uid = this.activatedRoute.snapshot.paramMap.get("uid");
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find((account) => account.id === this.uid);
        if (this.account) {
          this.loadFormData();
        }
      },
    );
    if (!this.account) {
      this.storeService.getDocById("accounts", this.uid);
    }
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.account) {
      // Update the account object with form values
      this.account.email = this.editProfileForm.value.email ?? "";
      this.account.description = this.editProfileForm.value.description ?? "";
      this.account.tagline = this.editProfileForm.value.tagline ?? "";
      this.account.name = this.editProfileForm.value.name ?? "";
      this.account.language = this.editProfileForm.value.language ?? "";

      this.account.userDetails = {
        ...this.account.userDetails,
        firstName: this.account.userDetails?.firstName ?? "",
        lastName: this.account.userDetails?.lastName ?? "",
        username: this.account.userDetails?.username ?? "",
        dateOfBirth: Timestamp.fromDate(
          new Date(this.editProfileForm.value.userDetails?.dateOfBirth ?? ""),
        ),
      };
      this.account.address = {
        ...this.account.address,
        street: this.editProfileForm.value.address?.street ?? "",
        city: this.editProfileForm.value.address?.city ?? "",
        state: this.editProfileForm.value.address?.state ?? "",
        zipcode: this.editProfileForm.value.address?.zipcode ?? "",
        country: this.editProfileForm.value.address?.country ?? "",
        name: this.editProfileForm.value.address?.name ?? "",
        formatted: this.account.address?.formatted ?? "",
        geopoint: this.account.address?.geopoint ?? "",
      };
      this.account.phone = {
        ...this.account.phone,
        number: this.editProfileForm.value.phone?.number ?? "",
        type: this.editProfileForm.value.phone?.type ?? "",
        countryCode: this.editProfileForm.value.phone?.countryCode ?? "",
      };

      this.storeService.updateDoc("accounts", this.account);
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
    this.editProfileForm.patchValue({
      name: this.account.name,
      email: this.account.email,
      description: this.account.description,
      tagline: this.account.tagline,
      language: this.account.language,
      userDetails: {
        dateOfBirth: this.account.userDetails?.dateOfBirth
          .toDate()
          .toISOString(),
      },
      address: {
        ...this.account.address,
      },
      phone: {
        ...this.account.phone,
      },
    });
  }
}
