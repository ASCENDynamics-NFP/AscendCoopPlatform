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
import {Component, Input} from "@angular/core";
import {Account, WebLink} from "@shared/models/account.model";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {
  @Input() account: Partial<Account> = {
    type: "user",
    description: "",
    webLinks: [],
  };

  constructor() {}

  get getSectionTitle() {
    if (this.account.type === "user") {
      return "Profile";
    }
    return "Organization (" + this.account.groupDetails?.groupType + ")";
  }

  getWebLinks(category: string): WebLink[] {
    if (!this.account || !this.account.webLinks) {
      return [];
    }
    return this.account.webLinks.filter((link) => link.category === category);
  }

  getOtherWebLinks(): WebLink[] {
    if (!this.account || !this.account.webLinks) {
      return [];
    }
    return this.account.webLinks.filter(
      (link) =>
        !["Donation", "Social Media", "Personal Website"].includes(
          link.category,
        ),
    );
  }
}
