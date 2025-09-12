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
// volunteer-preference-info.component.ts

import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Account, VolunteerPreferences} from "@shared/models/account.model";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {areasOfInterestOptions} from "../../../../../../core/data/options";

@Component({
  selector: "app-volunteer-preference-info-form",
  templateUrl: "./volunteer-preference-info-form.component.html",
  styleUrls: ["./volunteer-preference-info-form.component.scss"],
})
export class VolunteerPreferenceInfoFormComponent implements OnInit {
  @Input() account?: Account;
  volunteerPreferencesForm: FormGroup;
  areasOfInterestOptions: string[] = areasOfInterestOptions;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.volunteerPreferencesForm = this.fb.group({
      areasOfInterest: [[], Validators.required],
      availability: [[], Validators.required],
      preferredVolunteerRoles: ["", Validators.required],
      previousVolunteerExperience: [""],
      willingnessToTravel: [false],
      desiredLevelOfCommitment: ["", Validators.required],
    });
  }

  ngOnInit() {
    if (this.account?.volunteerPreferences) {
      this.loadFormData();
    }
  }

  loadFormData() {
    if (this.account?.volunteerPreferences) {
      const vp = this.account.volunteerPreferences as any;
      // Normalize roles to a comma-separated string for input
      const rolesVal = Array.isArray(vp.preferredVolunteerRoles)
        ? vp.preferredVolunteerRoles
        : typeof vp.preferredVolunteerRoles === "string"
          ? (vp.preferredVolunteerRoles as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      // Normalize availability to array for multi-select
      const availabilityVal = Array.isArray(vp.availability)
        ? vp.availability
        : vp.availability
          ? [vp.availability]
          : [];
      // Normalize areasOfInterest to array
      const areasVal = Array.isArray(vp.areasOfInterest)
        ? vp.areasOfInterest
        : vp.areasOfInterest
          ? [vp.areasOfInterest]
          : [];
      this.volunteerPreferencesForm.patchValue({
        areasOfInterest: areasVal,
        availability: availabilityVal,
        preferredVolunteerRoles: rolesVal.join(", "),
        previousVolunteerExperience: vp.previousVolunteerExperience || "",
        willingnessToTravel: !!vp.willingnessToTravel,
        desiredLevelOfCommitment: vp.desiredLevelOfCommitment || "",
      });
    }
  }

  onSubmit() {
    if (this.volunteerPreferencesForm.valid && this.account) {
      const formValue = this.volunteerPreferencesForm.value as any;
      // Convert comma-separated roles string back to array
      const rolesArray = (formValue.preferredVolunteerRoles || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => !!s);
      const updatedVolunteerPreferences: VolunteerPreferences = {
        areasOfInterest: Array.isArray(formValue.areasOfInterest)
          ? formValue.areasOfInterest
          : [],
        availability: Array.isArray(formValue.availability)
          ? formValue.availability
          : [],
        preferredVolunteerRoles: rolesArray,
        previousVolunteerExperience:
          formValue.previousVolunteerExperience || "",
        willingnessToTravel: !!formValue.willingnessToTravel,
        desiredLevelOfCommitment: formValue.desiredLevelOfCommitment || "",
      };
      const updatedAccount: Account = {
        ...this.account,
        volunteerPreferences: updatedVolunteerPreferences,
      };

      this.store.dispatch(
        AccountActions.updateAccount({account: updatedAccount}),
      );
    }
  }
}
