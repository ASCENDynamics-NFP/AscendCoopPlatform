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
// src/app/modules/account/pages/group-list/group-list.page.ts

import {Component, OnInit} from "@angular/core";
import {Subject, Observable, combineLatest} from "rxjs";
import {
  debounceTime,
  startWith,
  switchMap,
  map,
  take,
  distinctUntilChanged,
} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectFilteredAccounts,
  selectAccounts,
  selectAccountLoading,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.page.html",
  styleUrls: ["./group-list.page.scss"],
})
export class GroupListPage implements OnInit {
  private searchTerms = new Subject<string>();
  authUser$!: Observable<AuthUser | null>;
  accountList$!: Observable<Account[]>;
  account$!: Observable<Account | undefined>;
  searchedValue: string = "";
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectAccountLoading);
  }

  ngOnInit() {
    this.authUser$ = this.store.select(selectAuthUser);

    // Dispatch loadAccounts once during initialization
    this.store.dispatch(AccountActions.loadAccounts());

    // Dispatch loadRelatedAccounts when authUser becomes available
    this.authUser$.pipe(take(1)).subscribe((authUser) => {
      if (authUser?.uid) {
        this.store.dispatch(
          AccountActions.loadRelatedAccounts({
            accountId: authUser.uid,
          }),
        );
      }
    });

    this.accountList$ = this.searchTerms.pipe(
      startWith(this.searchedValue),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.store.select(selectFilteredAccounts(term, "group")),
      ),
    );

    // Simplify account$ to avoid infinite loop issues
    this.account$ = combineLatest([
      this.authUser$,
      this.store.select(selectAccounts),
    ]).pipe(
      map(([authUser, accounts]) => {
        if (authUser?.uid) {
          return accounts.find((acc) => acc.id === authUser.uid);
        }
        return undefined;
      }),
    );
  }

  search(event: any) {
    const value = event.target.value;
    this.searchedValue = value;
    this.searchTerms.next(value);
  }

  sendRequest(account: Account) {
    this.authUser$.pipe(take(1)).subscribe((authUser) => {
      if (!authUser?.uid || !account.id) {
        console.error("User ID or Account ID is missing");
        return;
      }

      const newRelatedAccount: RelatedAccount = {
        id: account.id,
        initiatorId: authUser.uid,
        targetId: account.id,
        type: account.type,
        status: "pending",
        relationship: "member",
        tagline: account.tagline,
        name: account.name,
        iconImage: account.iconImage,
      };

      this.store.dispatch(
        AccountActions.createRelatedAccount({
          accountId: authUser.uid,
          relatedAccount: newRelatedAccount,
        }),
      );
    });
  }

  showRequestButton(item: Account): Observable<boolean> {
    return combineLatest([this.authUser$, this.account$]).pipe(
      map(([authUser, account]) => {
        const authUserId = authUser?.uid;
        if (!authUserId || authUserId === item.id) {
          return false;
        }
        return !account?.relatedAccounts?.some(
          (ra) =>
            (ra.initiatorId === item.id || ra.targetId === item.id) &&
            ra.status !== "rejected",
        );
      }),
    );
  }
}
