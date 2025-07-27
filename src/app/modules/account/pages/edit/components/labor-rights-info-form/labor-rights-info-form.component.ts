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
import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Account} from "@shared/models/account.model";
import * as AccountActions from "../../../../../../state/actions/account.actions";

@Component({
  selector: "app-labor-rights-info-form",
  templateUrl: "./labor-rights-info-form.component.html",
  styleUrls: ["./labor-rights-info-form.component.scss"],
})
export class LaborRightsInfoFormComponent implements OnInit {
  @Input() account!: Account;
  laborRightsInfoForm: FormGroup;
  advocacyAreasOptions: string[] = [
    "Healthcare",
    "Education",
    "Environment",
    "Labor Rights",
    "Technology",
  ];
  laborRightsExperienceOptions: string[] = [
    "None",
    "Beginner",
    "Intermediate",
    "Expert",
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.laborRightsInfoForm = this.fb.group({
      unionMembership: [null, Validators.required],
      workplaceConcerns: ["", Validators.required],
      preferredAdvocacyAreas: [[], Validators.required],
      experienceWithLaborRightsIssues: [null, Validators.required],
    });
  }

  ngOnInit() {
    if (this.account.laborRights) {
      this.loadFormData();
    }
  }

  loadFormData() {
    this.laborRightsInfoForm.patchValue({
      unionMembership: this.account.laborRights?.unionMembership || null,
      workplaceConcerns: this.account.laborRights?.workplaceConcerns || "",
      preferredAdvocacyAreas:
        this.account.laborRights?.preferredAdvocacyAreas || [],
      experienceWithLaborRightsIssues:
        this.account.laborRights?.experienceWithLaborRightsIssues || null,
    });
  }

  onSubmit() {
    if (this.laborRightsInfoForm.valid) {
      const laborRightsInfo = this.laborRightsInfoForm.value;
      const updatedAccount: Account = {
        ...this.account,
        laborRights: laborRightsInfo,
      };

      this.store.dispatch(
        AccountActions.updateAccount({account: updatedAccount}),
      );
    }
  }
}
