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
  @Input() account: Partial<Account> | null = null;
  professionalInfoForm: FormGroup;
  skills = ["Skill1", "Skill2", "Skill3"]; // Populate this with actual skills

  constructor(private fb: FormBuilder, private storeService: StoreService) {
    this.professionalInfoForm = this.fb.group({
      occupation: ["", Validators.required],
      employerName: [""],
      skillsAndExpertise: [[]],
      educationalBackground: [""],
    });
  }

  ngOnInit(): void {
    // Load existing data if needed
    this.loadFormData();
  }

  onSubmit() {
    if (this.professionalInfoForm.valid) {
      const formValue = this.professionalInfoForm.value;
      const professionalInfo: ProfessionalInformation = {
        occupation: formValue.occupation,
        employerName: formValue.employerName,
        skillsAndExpertise: formValue.skillsAndExpertise,
        educationalBackground: formValue.educationalBackground,
      };
      const updatedAccount: Partial<Account> = {
        ...this.account,
        professionalInformation: professionalInfo,
      };
      // Save data to the backend
      this.storeService.updateDoc("accounts", updatedAccount);
    }
  }

  loadFormData() {
    // Load existing professional information if available
    if (this.account?.professionalInformation) {
      this.professionalInfoForm.patchValue(
        this.account?.professionalInformation,
      );
    }
  }
}
