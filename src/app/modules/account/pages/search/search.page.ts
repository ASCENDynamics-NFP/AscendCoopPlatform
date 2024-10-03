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
// src/app/modules/group/pages/search/search.page.ts

import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthUser} from "../../../../models/auth-user.model";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import {Account} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../state/reducers";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccounts} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  accountId: string | null = null;
  groups: Account[] = [];
  users: Account[] = [];
  user: AuthUser | null = null;
  currentGroup?: Account;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  get isAdmin(): boolean {
    if (!this.user?.uid) {
      return false;
    }
    return (
      this.currentGroup?.groupDetails?.admins?.includes(this.user.uid) ?? false
    );
  }

  ngOnInit() {
    // Subscribe to Auth User
    this.subscriptions.add(
      this.store.select(selectAuthUser).subscribe((user) => {
        this.user = user;
      }),
    );

    // Subscribe to Accounts
    this.subscriptions.add(
      this.store.select(selectAccounts).subscribe((accounts) => {
        this.currentGroup = accounts.find(
          (group) => group.id === this.accountId,
        );
        this.groups = this.sortByName(
          accounts.filter((account) => account.type === "group"),
        );
        this.users = this.sortByName(
          accounts.filter((account) => account.type === "user"),
        );
      }),
    );

    // Dispatch action to load accounts
    this.store.dispatch(AccountActions.loadAccounts());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sortByName(records: Account[]): Account[] {
    return records.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }
}
