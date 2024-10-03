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
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {StoreService} from "../../../../../../core/services/store.service";
import {Account} from "../../../../../../models/account.model";

@Component({
  selector: "app-labor-rights-info",
  templateUrl: "./labor-rights-info.component.html",
  styleUrls: ["./labor-rights-info.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class LaborRightsInfoComponent implements OnInit {
  @Input() account?: Partial<Account>;
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
    private storeService: StoreService,
  ) {
    this.laborRightsInfoForm = this.fb.group({
      unionMembership: [null, Validators.required],
      workplaceConcerns: ["", Validators.required],
      preferredAdvocacyAreas: [[], Validators.required],
      experienceWithLaborRightsIssues: [null, Validators.required],
    });
  }

  ngOnInit() {
    if (this.account?.laborRights) {
      this.loadFormData();
    }
  }

  loadFormData() {
    if (this.account?.laborRights) {
      this.laborRightsInfoForm.patchValue({
        unionMembership: this.account.laborRights.unionMembership || null,
        workplaceConcerns: this.account.laborRights.workplaceConcerns || "",
        preferredAdvocacyAreas:
          this.account.laborRights.preferredAdvocacyAreas || [],
        experienceWithLaborRightsIssues:
          this.account.laborRights.experienceWithLaborRightsIssues || null,
      });
    }
  }

  onSubmit() {
    if (this.laborRightsInfoForm.valid) {
      const laborRightsInfo = this.laborRightsInfoForm.value;
      const updatedAccount: Partial<Account> = {
        ...this.account,
        laborRights: laborRightsInfo,
      };

      this.storeService.updateDoc("accounts", updatedAccount);
    }
  }
}
