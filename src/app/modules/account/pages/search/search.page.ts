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

import {Component, OnInit} from "@angular/core";
import {AuthUser} from "../../../../models/auth-user.model";
import {ActivatedRoute} from "@angular/router";
import {combineLatest, Observable} from "rxjs";
import {Account} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccounts} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {map} from "rxjs/operators";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  accountId: string | null = null;
  authUser$: Observable<AuthUser | null>; // Observable for the auth user
  accounts$: Observable<Account[]>; // Observable for accounts
  groups$: Observable<Account[]>; // Filtered groups
  users$: Observable<Account[]>; // Filtered users
  currentGroup$: Observable<Account | undefined>; // The current group

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");

    // Select the observables from the store
    this.authUser$ = this.store.select(selectAuthUser);
    this.accounts$ = this.store.select(selectAccounts);

    // Filter the groups and users once accounts are loaded
    this.groups$ = this.accounts$.pipe(
      map((accounts) =>
        this.sortByName(accounts.filter((account) => account.type === "group")),
      ),
    );
    this.users$ = this.accounts$.pipe(
      map((accounts) =>
        this.sortByName(accounts.filter((account) => account.type === "user")),
      ),
    );
    this.currentGroup$ = this.accounts$.pipe(
      map((accounts) => accounts.find((group) => group.id === this.accountId)),
    );
  }

  get isAdmin$(): Observable<boolean> {
    return combineLatest([this.authUser$, this.currentGroup$]).pipe(
      map(([user, group]) => {
        return group?.groupDetails?.admins?.includes(user?.uid || "") ?? false;
      }),
    );
  }

  ngOnInit() {
    // Dispatch action to load accounts when component initializes
    this.store.dispatch(AccountActions.loadAccounts());
  }

  // Helper function to sort accounts by name
  sortByName(records: Account[]): Account[] {
    return records.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }
}
