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
import {
  Account,
  ProfessionalInformation,
} from "../../../../../../models/account.model";
import {CommonModule} from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {StoreService} from "../../../../../../core/services/store.service";

@Component({
  selector: "app-professional-info",
  templateUrl: "./professional-info.component.html",
  styleUrls: ["./professional-info.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class ProfessionalInfoComponent implements OnInit {
  @Input() account?: Partial<Account>;
  professionalInformationForm: FormGroup;
  skillsOptions: string[] = [
    "Programming",
    "Project Management",
    "Data Analysis",
    "Marketing",
    "Graphic Design",
  ];

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
  ) {
    this.professionalInformationForm = this.fb.group({
      occupation: ["", Validators.required],
      employerName: [""],
      workExperience: [""],
      skillsAndExpertise: [[], Validators.required],
      currentJobTitle: [""],
      linkedInProfile: [""],
      educationalBackground: [""],
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
      });
    }
  }

  onSubmit() {
    if (this.professionalInformationForm.valid) {
      const updatedProfessionalInformation: ProfessionalInformation =
        this.professionalInformationForm.value;
      const updatedAccount: Partial<Account> = {
        ...this.account,
        professionalInformation: updatedProfessionalInformation,
      };

      this.storeService.updateDoc("accounts", updatedAccount);
    }
  }
}
