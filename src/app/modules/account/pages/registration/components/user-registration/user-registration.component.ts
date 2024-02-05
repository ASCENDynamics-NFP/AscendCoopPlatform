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
import {CommonModule} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../../../models/account.model";

@Component({
  selector: "app-user-registration",
  templateUrl: "./user-registration.component.html",
  styleUrls: ["./user-registration.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule],
})
export class UserRegistrationComponent implements OnInit{
  @Input() account?: Partial<Account>;
  registrationForm: FormGroup;
  countryCodes: { value: string; label: string }[] = [];
  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      tagline:[''],
      description :[''],
      phoneNumber:['', Validators.pattern(/^-?\d+$/)],
      countryCode: [''],
      alternateEmail:['',[Validators.email]],
      mailingAddress:[''],
      emergencyContactNumber:['', Validators.pattern(/^-?\d+$/)],
      EmergencycountryCode:[''],
      preferredMethodOfContact :[''],
      occupation:[''],
      employerName:[''],
      workExperience:[''],
      skillsAndExpertise:[''],
      currentJobTitle:[''],
      linkedInProfile:[''],
      educationalBackground:['']
    });

    this.countryCodes = [
      { value: '+1', label: '+1 (USA)' },
      { value: '+44', label: '+44 (UK)' },
      // Add more entries as needed
    ];
  }

  ngOnInit(){

  
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      // Handle form submission
      const formData = this.registrationForm.value;
      console.log(formData);
    } else {
      // Handle invalid form
    }
  }
}
