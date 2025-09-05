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
import {Account, RelatedAccount} from "@shared/models/account.model";

@Component({
  selector: "app-related-accounts",
  templateUrl: "./related-accounts.component.html",
  styleUrls: ["./related-accounts.component.scss"],
})
export class RelatedAccountsComponent {
  @Input() account: Account = {} as Account;
  @Input() relatedAccounts: RelatedAccount[] = [];
  @Input() type: "user" | "group" = "user";
  @Input() isProfileOwner: boolean = false;
  @Input() isGroupAdmin: boolean = false;
  @Input() privacySettings: any = null;

  constructor(private router: Router) {}

  get title() {
    if (this.type === "user") {
      return this.account?.type === "user" ? "Friends" : "Members";
    }
    return "Organizations";
  }

  get filteredRelatedAccounts() {
    return this.relatedAccounts.filter(
      (ra) => ra.type === this.type && ra.status === "accepted",
    );
  }

  goToRelatedAccount(id: string | undefined) {
    if (id) {
      this.router.navigate(["/account", id]);
    }
  }

  get isOwnerOrAdmin(): boolean {
    return this.isProfileOwner || this.isGroupAdmin;
  }

  get privacyData(): {visibility: string; color: string; label: string} {
    if (!this.privacySettings) {
      return {visibility: "public", color: "success", label: "Public"};
    }

    const sectionKey = this.type === "user" ? "friendsList" : "membersList";
    const section = this.privacySettings[sectionKey] || {};
    const visibility = section.visibility || "public";
    const {text, color} = this.mapVisibility(visibility);

    return {visibility, color, label: text};
  }

  private mapVisibility(v: string): {text: string; color: string} {
    switch (v) {
      case "public":
        return {text: "Public", color: "success"};
      case "friends":
        return {text: "Friends", color: "warning"};
      case "private":
        return {text: "Private", color: "danger"};
      default:
        return {text: "Public", color: "success"};
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
