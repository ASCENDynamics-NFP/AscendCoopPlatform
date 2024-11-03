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
import {Account} from "../../../../../../models/account.model";

@Component({
  selector: "app-related-accounts",
  templateUrl: "./related-accounts.component.html",
  styleUrls: ["./related-accounts.component.scss"],
})
export class RelatedAccountsComponent {
  @Input() account: Partial<Account> = {relatedAccounts: []}; // Initialize with a default object
  @Input() type: "user" | "group" = "user"; // Default type to 'user'

  constructor(private router: Router) {}

  get title() {
    if (this.type === "user") {
      return this.account?.type === "user" ? "Friends" : "Members";
    }
    return "Organizations";
  }

  get relatedAccounts() {
    return (
      this.account?.relatedAccounts?.filter(
        (ra) => ra.type === this.type && ra.status === "accepted",
      ) || []
    );
  }

  goToRelatedAccount(id: string | undefined) {
    if (id) {
      this.router.navigate([`/account/${id}`]);
    } else {
      console.error("Invalid ID provided for navigation.");
    }
  }

  viewAll() {
    if (this.account?.id) {
      this.router.navigate([
        `/account/${this.account.id}/related/${this.type}`,
      ]);
    }
  }
}
