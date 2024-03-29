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
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../../../models/account.model";
import {RouterModule} from "@angular/router";
import {PhoneFormatPipe} from "../../../../../../shared/pipes/phone-format.pipe";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, PhoneFormatPipe],
})
export class DetailsComponent implements OnInit {
  @Input() account?: Partial<Account>; // define your user here
  @Input() isProfileOwner: boolean = false; // define your user here
  // dateOfBirth = new Date().toISOString(); // default initialization

  constructor() {}

  ngOnInit() {
    // If user and dateOfBirth exist, convert to Date, otherwise leave as default Date
    // this.dateOfBirth =
    //   this.account?.userDetails?.dateOfBirth?.toDate().toISOString() ||
    //   this.dateOfBirth;
  }

  get dateOfBirth() {
    return (
      this.account?.userDetails?.dateOfBirth?.toDate().toISOString() ||
      new Date().toISOString()
    );
  }

  get phoneNumber() {
    return (
      this.account?.contactInformation?.phoneNumbers?.[0]?.type +
      " Phone: " +
      this.account?.contactInformation?.phoneNumbers?.[0]?.countryCode +
      this.account?.contactInformation?.phoneNumbers?.[0]?.number
    );
  }

  get email() {
    return this.account?.contactInformation?.emails?.[0]?.email;
  }
}
