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
import {FirestoreService} from "../../../../../../core/services/firestore.service";
import {AccountSectionsService} from "../../../../services/account-sections.service";
import {take} from "rxjs/operators";
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
    private firestoreService: FirestoreService,
    private sections: AccountSectionsService,
  ) {
    this.laborRightsInfoForm = this.fb.group({
      unionMembership: [null, Validators.required],
      workplaceConcerns: ["", Validators.required],
      preferredAdvocacyAreas: [[], Validators.required],
      experienceWithLaborRightsIssues: [null, Validators.required],
    });
  }

  ngOnInit() {
    if (this.account?.id) {
      this.sections
        .laborRights$(this.account.id)
        .pipe(take(1))
        .subscribe((lr) => {
          if (lr) {
            this.loadFormData(lr);
          } else if (this.account.laborRights) {
            this.loadFormData(this.account.laborRights);
          }
        });
    }
  }

  loadFormData(lr: any) {
    this.laborRightsInfoForm.patchValue({
      unionMembership: lr?.unionMembership || null,
      workplaceConcerns: lr?.workplaceConcerns || "",
      preferredAdvocacyAreas: lr?.preferredAdvocacyAreas || [],
      experienceWithLaborRightsIssues:
        lr?.experienceWithLaborRightsIssues || null,
    });
  }

  async onSubmit() {
    if (this.laborRightsInfoForm.valid) {
      const laborRightsInfo = this.laborRightsInfoForm.value;
      // Write to sections/laborRights only
      await this.firestoreService.setDocument(
        `accounts/${this.account.id}/sections/laborRights`,
        laborRightsInfo,
        {merge: true},
      );
    }
  }
}
