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
// member-search.component.ts
import {Component, Input} from "@angular/core";
import {AuthUser} from "../../../../../../models/auth-user.model";
import {Account, RelatedAccount} from "../../../../../../models/account.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../../state/reducers";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {selectUsersByName} from "../../../../../../state/selectors/auth.selectors";

@Component({
  selector: "app-member-search",
  templateUrl: "./member-search.component.html",
  styleUrls: ["./member-search.component.scss"],
})
export class MemberSearchComponent {
  @Input() isAdmin: boolean = false;
  @Input() user: AuthUser | null = null;
  @Input() currentGroup?: Account;
  users: Account[] = [];
  searchTerm: string = "";

  constructor(private store: Store<AppState>) {}

  get searchResults() {
    if (!this.users) {
      return [];
    }
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter((user) =>
      user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  searchUsers(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      // Dispatch an action to search users by name
      this.store.dispatch(
        AccountActions.searchUsersByName({name: this.searchTerm}),
      );

      // Subscribe to the search results
      this.store
        .select(selectUsersByName(this.searchTerm))
        .subscribe((users) => {
          this.users = users;
        });
    }
  }

  canInviteUser(user: Account): boolean {
    if (!this.currentGroup?.id || !user.id) {
      return false;
    }
    return !this.currentGroup.relatedAccounts?.some(
      (ra) =>
        ra.id === user.id &&
        (ra.status === "accepted" || ra.status === "pending"),
    );
  }

  inviteUser(user: Account) {
    if (!this.canInviteUser(user)) {
      console.log("Cannot invite user");
      return;
    }

    if (this.currentGroup?.id && user.id) {
      const newRelatedAccount: RelatedAccount = {
        id: user.id,
        name: user.name,
        iconImage: user.iconImage,
        tagline: user.tagline,
        type: "user",
        status: "pending",
        relationship: "member",
        initiatorId: this.currentGroup.id,
        targetId: user.id,
      };

      // Dispatch action to add related account
      this.store.dispatch(
        AccountActions.addRelatedAccount({
          accountId: this.currentGroup.id,
          relatedAccount: newRelatedAccount,
        }),
      );
    }
  }
}
