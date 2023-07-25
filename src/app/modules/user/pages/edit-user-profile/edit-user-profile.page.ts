/***********************************************************************************************
Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
Copyright (C) 2023  ASCENDynamics NFP

This file is part of Nonprofit Social Networking Platform.

Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  // AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  // ValidatorFn,
  Validators,
} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MenuService} from "../../../../core/services/menu.service";
import {AppUser} from "../../../../models/user.model";
import {UsersService} from "../../../../core/services/users.service";
import {ActivatedRoute} from "@angular/router";
import {Timestamp} from "firebase/firestore";

@Component({
  selector: "app-edit-user-profile",
  templateUrl: "./edit-user-profile.page.html",
  styleUrls: ["./edit-user-profile.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class EditUserProfilePage implements OnInit {
  user: Partial<AppUser> | null = null; // define your user here

  editProfileForm = this.fb.group({
    displayName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    bio: [""],
    tagline: [""],
    name: [""],
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
    dateOfBirth: [new Date().toISOString()], //, [Validators.required, this.ageValidator(18)]],
  });

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Load the user data, e.g. from a service
    this.userService
      .getUser(this.activatedRoute.snapshot.paramMap.get("uid"))
      .then((user) => {
        this.user = user as Partial<AppUser>;
        if (this.user) {
          // Update the form with the user data
          this.editProfileForm.patchValue({
            displayName: this.user.displayName,
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
      });
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  onSubmit() {
    console.log(this.editProfileForm.value);
    // Call the API to save changes
    const user: Partial<AppUser> = {
      id: this.user?.id,
      displayName: this.editProfileForm.value.displayName || "",
      email: this.editProfileForm.value.email || "",
      phoneNumber: this.editProfileForm.value.phoneNumber || "",
      bio: this.editProfileForm.value.bio || "",
      tagline: this.editProfileForm.value.tagline || "",
      name: this.editProfileForm.value.name || "",
      language: this.editProfileForm.value.language || "",
      phoneCountryCode: this.editProfileForm.value.phoneCountryCode || "",
      phoneType: this.editProfileForm.value.phoneType || "",
      addressName: this.editProfileForm.value.addressName || "",
      addressStreet: this.editProfileForm.value.addressStreet || "",
      addressCity: this.editProfileForm.value.addressCity || "",
      addressState: this.editProfileForm.value.addressState || "",
      addressZipcode: this.editProfileForm.value.addressZipcode || "",
      addressCountry: this.editProfileForm.value.addressCountry || "",
      dateOfBirth: Timestamp.fromDate(
        new Date(this.editProfileForm.value.dateOfBirth || ""),
      ),
    };

    this.userService.updateUser(user);
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
}
