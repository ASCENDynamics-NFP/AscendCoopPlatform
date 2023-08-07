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
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {AppUser} from "../../../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Timestamp} from "firebase/firestore";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-edit-user-profile",
  templateUrl: "./edit-user-profile.page.html",
  styleUrls: ["./edit-user-profile.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class EditUserProfilePage {
  private uid: string | null = null;
  private usersSubscription: Subscription | undefined;
  user: Partial<AppUser> | null = null; // define your user here

  editProfileForm = this.fb.group({
    displayName: [""],
    email: ["", [Validators.required, Validators.email]],
    bio: [""],
    tagline: [""],
    name: ["", Validators.required],
    language: [""],
    phoneCountryCode: ["", [Validators.pattern("^[0-9]*$")]],
    phoneNumber: ["", [Validators.pattern("^\\d{10}$")]],
    phoneType: [""],
    addressName: [""],
    addressStreet: ["", Validators.pattern("^[a-zA-Z0-9\\s,]*$")],
    addressCity: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
    addressState: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
    addressZipcode: ["", Validators.pattern("^[0-9]*$")],
    addressCountry: ["", Validators.pattern("^[a-zA-Z\\s]*$")],
    dateOfBirth: [
      new Date().toISOString(),
      [Validators.required], //, this.ageValidator(18)],
    ],
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
    this.usersSubscription = this.storeService.users$.subscribe((users) => {
      this.user = users.find((user) => user.id === this.uid) ?? null;
      if (this.user) {
        this.loadFormData();
      }
    });
    if (!this.user) {
      // console.log("User not found in store, fetching from server");
      this.storeService.getDocById("users", this.uid);
    }
  }

  ionViewWillLeave() {
    this.usersSubscription?.unsubscribe();
  }

  onSubmit() {
    // Call the API to save changes
    if (this.user) {
      this.user.email = this.editProfileForm.value.email || "";
      this.user.phoneNumber = this.editProfileForm.value.phoneNumber || "";
      this.user.bio = this.editProfileForm.value.bio || "";
      this.user.tagline = this.editProfileForm.value.tagline || "";
      this.user.name = this.editProfileForm.value.name || "";
      this.user.displayName = this.editProfileForm.value.name || "";
      this.user.language = this.editProfileForm.value.language || "";
      this.user.phoneCountryCode =
        this.editProfileForm.value.phoneCountryCode || "";
      this.user.phoneType = this.editProfileForm.value.phoneType || "";
      this.user.addressName = this.editProfileForm.value.addressName || "";
      this.user.addressStreet = this.editProfileForm.value.addressStreet || "";
      this.user.addressCity = this.editProfileForm.value.addressCity || "";
      this.user.addressState = this.editProfileForm.value.addressState || "";
      this.user.addressZipcode =
        this.editProfileForm.value.addressZipcode || "";
      this.user.addressCountry =
        this.editProfileForm.value.addressCountry || "";
      this.user.dateOfBirth = Timestamp.fromDate(
        new Date(this.editProfileForm.value.dateOfBirth || ""),
      );
      this.user.heroImage = this.user?.heroImage ?? "assets/image/userhero.png";
      this.user.profilePicture =
        this.user?.profilePicture ?? "assets/avatar/male1.png";

      this.storeService.updateDoc("users", this.user);
    }
  }

  backToProfile() {
    this.router.navigate(["/user-profile/", this.user?.id]);
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
    if (!this.user) return;
    // Update the form with the user data
    this.editProfileForm.patchValue({
      displayName: this.user.name,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      bio: this.user.bio,
      tagline: this.user.tagline,
      name: this.user.name,
      language: this.user.language,
      phoneCountryCode: this.user.phoneCountryCode,
      phoneType: this.user.phoneType,
      addressName: this.user.addressName,
      addressStreet: this.user.addressStreet,
      addressCity: this.user.addressCity,
      addressState: this.user.addressState,
      addressZipcode: this.user.addressZipcode,
      addressCountry: this.user.addressCountry,
      dateOfBirth: this.user.dateOfBirth?.toDate().toISOString(), // Make sure dateOfBirth is a Date object
    });
  }
}
