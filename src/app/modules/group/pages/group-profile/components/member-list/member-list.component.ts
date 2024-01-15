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
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {Account, RelatedAccount} from "../../../../../../models/account.model";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MemberListComponent {
  @Input() account?: Partial<Account>;

  constructor(private router: Router) {}

  get allMembers() {
    return this.account?.relatedAccounts?.filter(
      (ra) => ra.type === "user" && ra.status === "accepted",
    );
  }

  goToUserProfile(id: string | undefined) {
    if (id) {
      this.router.navigate([`/user-profile/${id}`]);
    }
  }

  goToMemberList() {
    if (this.account?.id) {
      this.router.navigate([
        `/group/${this.account.id}/${this.account.id}/members`,
      ]);
    }
  }
}
