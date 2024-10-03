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
// src/app/modules/user/pages/users/users.page.ts

import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthUser} from "../../../../models/auth-user.model";
import {Subscription} from "rxjs";

import {Account, RelatedAccount} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../state/reducers";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectAccounts,
  selectAccountById,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-users",
  templateUrl: "./users.page.html",
  styleUrls: ["./users.page.scss"],
})
export class UsersPage implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  authUser: AuthUser | null = null;
  account?: Account;
  accountList: Account[] = [];
  searchedValue: string = "";
  private relatedAccountIds = new Set<string>();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // Subscribe to Auth User
    this.subscriptions.add(
      this.store.select(selectAuthUser).subscribe({
        next: (authUser) => {
          this.authUser = authUser;

          if (this.authUser?.uid) {
            // Dispatch action to load account
            this.store.dispatch(
              AccountActions.loadAccount({accountId: this.authUser.uid}),
            );

            // Subscribe to Account
            this.subscriptions.add(
              this.store
                .select(selectAccountById(this.authUser.uid))
                .subscribe({
                  next: (account) => {
                    this.account = account;

                    // Update relatedAccountIds when account changes
                    if (this.account?.relatedAccounts) {
                      this.relatedAccountIds = new Set(
                        this.account.relatedAccounts
                          .filter((ra) => ra.status !== "rejected")
                          .map((ra) => ra.id),
                      );
                    }
                  },
                  error: (error) => {
                    console.error("Error fetching account:", error);
                  },
                }),
            );
          }
        },
        error: (error) => {
          console.error("Error fetching auth user:", error);
        },
      }),
    );

    // Subscribe to Accounts
    this.subscriptions.add(
      this.store.select(selectAccounts).subscribe({
        next: (accounts) => {
          if (accounts) {
            this.accountList = accounts
              .filter(
                (acc) =>
                  acc.type === "user" &&
                  acc.id !== this.authUser?.uid && // Exclude current user
                  acc.name?.toLowerCase().includes(this.searchedValue),
              )
              .sort((a, b) => a.name?.localeCompare(b.name!) || 0);
          }
        },
        error: (error) => {
          console.error("Error fetching accounts:", error);
        },
      }),
    );

    // Dispatch action to load accounts
    this.store.dispatch(AccountActions.loadAccounts());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendFriendRequest(account: Account) {
    if (!this.authUser?.uid || !account.id) {
      console.error("User ID or Account ID is missing");
      return;
    }

    const newRelatedAccount: RelatedAccount = {
      id: account.id,
      initiatorId: this.authUser.uid,
      targetId: account.id,
      type: account.type,
      status: "pending",
      relationship: "friend",
      tagline: account.tagline,
      name: account.name,
      iconImage: account.iconImage,
    };

    // Dispatch action to update related account
    this.store.dispatch(
      AccountActions.updateRelatedAccount({
        accountId: this.authUser.uid,
        relatedAccount: newRelatedAccount,
      }),
    );
  }

  searchUsers(event: any) {
    const value = event.target.value || "";
    this.searchedValue = value.toLowerCase();

    // No need to dispatch actions here; filtering is done in the subscription
  }

  showRequestButton(item: Account): boolean {
    const authUserId = this.authUser?.uid;
    if (!authUserId || authUserId === item.id) {
      return false;
    }

    return !this.relatedAccountIds.has(item.id!);
  }
}
