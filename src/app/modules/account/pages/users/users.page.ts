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

import {Component, OnInit} from "@angular/core";
import {ViewWillEnter} from "@ionic/angular";
import {Subject, Observable, combineLatest, of} from "rxjs";
import {
  debounceTime,
  startWith,
  switchMap,
  map,
  distinctUntilChanged,
  take,
  filter,
} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectFilteredAccounts,
  selectAccountLoading,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-users",
  templateUrl: "./users.page.html",
  styleUrls: ["./users.page.scss"],
})
export class UsersPage implements OnInit, ViewWillEnter {
  private searchTerms = new Subject<string>();
  authUser$!: Observable<AuthUser | null>;
  accountList$!: Observable<Account[]>;
  searchedValue: string = "";
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectAccountLoading);
  }

  ionViewWillEnter() {
    this.loadRelatedAccountsForAuthUser();
  }

  private loadRelatedAccountsForAuthUser() {
    this.authUser$
      .pipe(
        filter((authUser): authUser is AuthUser => authUser !== null),
        take(1),
      )
      .subscribe((authUser) => {
        this.store.dispatch(
          AccountActions.loadRelatedAccounts({accountId: authUser.uid}),
        );
      });
  }

  ngOnInit() {
    this.authUser$ = this.store.select(selectAuthUser);

    this.store.dispatch(AccountActions.loadAccounts());

    this.accountList$ = this.searchTerms.pipe(
      startWith(this.searchedValue),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.store.select(selectFilteredAccounts(term, "user")),
      ),
    );
  }

  search(event: any) {
    const value = event.target.value;
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
        accountId: authUser.uid,
        initiatorId: authUser.uid,
        targetId: account.id,
        type: account.type,
        status: "pending",
        relationship: "friend",
        tagline: account.tagline,
        name: account.name,
        iconImage: account.iconImage,
        createdBy: authUser.uid,
        lastModifiedBy: authUser.uid,
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
    return this.authUser$.pipe(
      filter((authUser): authUser is AuthUser => authUser !== null),
      switchMap((authUser) =>
        combineLatest([
          of(authUser),
          this.store.select(selectRelatedAccountsByAccountId(authUser.uid)),
        ]),
      ),
      map(([authUser, relatedAccounts]) => {
        if (authUser.uid === item.id) {
          return false;
        }

        // Check against the `relatedAccounts` from the state
        const shouldShowButton = !relatedAccounts.some(
          (ra) =>
            ((ra.initiatorId === item.id && ra.targetId === authUser.uid) ||
              (ra.initiatorId === authUser.uid && ra.targetId === item.id)) &&
            ra.status !== "rejected",
        );

        return shouldShowButton;
      }),
    );
  }
}
