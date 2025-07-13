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
// professional-info.component.ts

import {Component, Input, OnInit, ElementRef, ViewChild} from "@angular/core";
import {Account, ProfessionalInformation} from "@shared/models/account.model";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {skillsOptions} from "../../../../../../core/data/options";

@Component({
  selector: "app-professional-info-form",
  templateUrl: "./professional-info-form.component.html",
  styleUrls: ["./professional-info-form.component.scss"],
})
export class ProfessionalInfoFormComponent implements OnInit {
  @Input() account?: Account;
  professionalInformationForm: FormGroup;
  public skillsOptions: string[] = skillsOptions;
  resumeFileName = "";
  resumeFile: File | null = null;
  @ViewChild("resumeInput") resumeInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.professionalInformationForm = this.fb.group({
      occupation: ["", Validators.required],
      employerName: [""],
      workExperience: [""],
      skillsAndExpertise: [[], Validators.required],
      currentJobTitle: [""],
      linkedInProfile: [""],
      educationalBackground: [""],
      resumeUpload: [null],
    });
  }

  ngOnInit() {
    if (this.account?.professionalInformation) {
      this.loadFormData();
    }
  }

  loadFormData() {
    if (this.account?.professionalInformation) {
      this.professionalInformationForm.patchValue({
        occupation: this.account.professionalInformation.occupation || "",
        employerName: this.account.professionalInformation.employerName || "",
        workExperience:
          this.account.professionalInformation.workExperience || "",
        skillsAndExpertise:
          this.account.professionalInformation.skillsAndExpertise || [],
        currentJobTitle:
          this.account.professionalInformation.currentJobTitle || "",
        linkedInProfile:
          this.account.professionalInformation.linkedInProfile || "",
        educationalBackground:
          this.account.professionalInformation.educationalBackground || "",
        resumeUpload: null,
      });
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.resumeFile = input.files[0];
      this.resumeFileName = this.resumeFile.name;
      this.professionalInformationForm.patchValue({
        resumeUpload: this.resumeFile,
      });
    }
  }

  onSubmit() {
    if (this.professionalInformationForm.valid && this.account) {
      const formValue = this.professionalInformationForm.value;
      const updatedProfessionalInformation: ProfessionalInformation = {
        ...formValue,
        resumeUpload:
          this.resumeFile ||
          this.account.professionalInformation?.resumeUpload ||
          null,
      };

      const updatedAccount: Account = {
        ...this.account,
        professionalInformation: updatedProfessionalInformation,
      };

      this.store.dispatch(
        AccountActions.updateAccount({account: updatedAccount}),
      );
    }
  }
}
