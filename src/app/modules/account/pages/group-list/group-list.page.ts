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
import {Component} from "@angular/core";
import {Subscription} from "rxjs";
import {AuthUser} from "../../../../models/auth-user.model";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectAccounts,
  selectAccountLoading,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {AppState} from "../../../../state/reducers";
import {Account, RelatedAccount} from "../../../../models/account.model";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.page.html",
  styleUrls: ["./group-list.page.scss"],
})
export class GroupListPage {
  private subscriptions: Subscription = new Subscription();
  authUser: AuthUser | null = null;
  accountList: Account[] = [];
  searchedValue: string = "";
  account?: Account;
  loading$ = this.store.select(selectAccountLoading);

  constructor(private store: Store<AppState>) {}

  ionViewWillEnter() {
    this.subscriptions.add(
      this.store.select(selectAuthUser).subscribe((authUser) => {
        this.authUser = authUser;
        if (this.authUser?.uid) {
          // Dispatch action to load related accounts for the current user
          this.store.dispatch(
            AccountActions.loadRelatedAccounts({
              accountId: this.authUser.uid,
            }),
          );
        }
      }),
    );

    this.subscriptions.add(
      this.store.select(selectAccounts).subscribe((accounts) => {
        if (accounts) {
          this.account = accounts.find((acc) => acc.id === this.authUser?.uid);
          this.accountList = accounts
            .filter(
              (acc) =>
                acc.name
                  ?.toLowerCase()
                  .includes(this.searchedValue.toLowerCase()) &&
                acc.type === "group",
            )
            .sort((a, b) => {
              if (a.name && b.name) {
                return a.name.localeCompare(b.name);
              } else {
                return 0;
              }
            });
        }
      }),
    );

    // Dispatch action to load accounts
    this.store.dispatch(AccountActions.loadAccounts());
  }

  ionViewWillLeave() {
    this.subscriptions.unsubscribe();
  }

  search(event: any) {
    const value = event.target.value;
    this.searchedValue = value;

    if (value) {
      // Dispatch search action
      this.store.dispatch(AccountActions.searchAccounts({query: value}));
    } else {
      // If search term is empty, reload accounts
      this.store.dispatch(AccountActions.loadAccounts());
    }
  }

  sendRequest(account: Account) {
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
      relationship: "member",
      tagline: account.tagline,
      name: account.name,
      iconImage: account.iconImage,
    };

    this.store.dispatch(
      AccountActions.updateRelatedAccount({
        accountId: this.authUser.uid,
        relatedAccount: newRelatedAccount,
      }),
    );
  }

  showRequestButton(item: Account): boolean {
    const authUserId = this.authUser?.uid;
    if (!authUserId || authUserId === item.id) {
      return false;
    }

    return !this.account?.relatedAccounts?.some(
      (ra) => ra.id === item.id && ra.status !== "rejected",
    );
  }
}
