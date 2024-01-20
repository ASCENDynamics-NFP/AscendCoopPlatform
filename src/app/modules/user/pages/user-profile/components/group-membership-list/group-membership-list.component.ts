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
import {Router} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {Account, RelatedAccount} from "../../../../../../models/account.model";

@Component({
  selector: "app-group-membership-list",
  templateUrl: "./group-membership-list.component.html",
  styleUrls: ["./group-membership-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class GroupMembershipListComponent {
  @Input() account?: Partial<Account>;

  constructor(private router: Router) {}

  get allGroups() {
    return (
      this.account?.relatedAccounts?.filter(
        (ra: Partial<RelatedAccount>) =>
          ra.type === "group" && ra.status === "accepted", // only show accepted groups
      ) ?? []
    );
  }

  goToGroupPage(id: string | undefined) {
    if (id) {
      this.router.navigate([`/group/${id}/${id}/details`]);
    }
  }

  goToGroupList() {
    if (this.account?.id) {
      this.router.navigate([`/user-profile/${this.account.id}/groups`]);
    }
  }
}
