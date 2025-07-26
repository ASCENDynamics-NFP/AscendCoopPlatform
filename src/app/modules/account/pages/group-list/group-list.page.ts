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
import {Router} from "@angular/router";
import {Subject, Observable, BehaviorSubject, combineLatest} from "rxjs";
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
import {AuthUser} from "@shared/models/auth-user.model";
import {Account, RelatedAccount} from "@shared/models/account.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectFilteredAccounts,
  selectAccountLoading,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {ViewWillEnter} from "@ionic/angular";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.page.html",
  styleUrls: ["./group-list.page.scss"],
})
export class GroupListPage implements OnInit, ViewWillEnter {
  private searchTerms = new Subject<string>();
  authUser$!: Observable<AuthUser | null>;
  accountList$!: Observable<Account[]>;
  paginatedAccounts$!: Observable<Account[]>;
  totalItems$!: Observable<number>;
  loading$: Observable<boolean>;
  searchedValue: string = "";

  // Pagination State
  pageSize = 10; // Number of groups per page
  currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();
  totalPages$!: Observable<number>;

  constructor(
    private metaService: MetaService,
    private store: Store,
    private router: Router,
  ) {
    this.loading$ = this.store.select(selectAccountLoading);
  }

  ionViewWillEnter() {
    this.loadRelatedAccountsForAuthUser();
    this.metaService.updateMetaTags(
      "Search NGOs | ASCENDynamics NFP",
      "Find opportunities, groups, and profiles tailored to your interests on ASCENDynamics NFP.",
      "search, opportunities, volunteer, nonprofits",
      {
        title: "Search NGOs | ASCENDynamics NFP",
        description:
          "Discover listings, profiles, and groups that match your search criteria.",
        url: "https://app.ASCENDynamics.org/search",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: "Search Results",
        description:
          "Browse search results and find opportunities that match your interests.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
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

    const filteredAccounts$ = this.searchTerms.pipe(
      startWith(this.searchedValue),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.store.select(selectFilteredAccounts(term, "group")),
      ),
    );

    // Total Items for Pagination
    this.totalItems$ = filteredAccounts$.pipe(
      map((accounts) => accounts.length),
    );

    // Total Pages
    this.totalPages$ = this.totalItems$.pipe(
      map((totalItems) => Math.ceil(totalItems / this.pageSize)),
    );

    // Paginated Results
    this.paginatedAccounts$ = combineLatest([
      filteredAccounts$,
      this.currentPage$,
    ]).pipe(
      map(([accounts, currentPage]) => {
        const startIndex = (currentPage - 1) * this.pageSize;
        return accounts.slice(startIndex, startIndex + this.pageSize);
      }),
    );
  }

  search(event: any) {
    const value = event.target.value;
    this.searchTerms.next(value);
  }

  goToPage(pageNumber: number) {
    this.currentPageSubject.next(pageNumber);
  }

  sendRequest(account: Account) {
    this.authUser$.pipe(take(1)).subscribe((authUser) => {
      if (!authUser?.uid || !account.id) {
        console.error("User ID or Account ID is missing");
        return;
      }

      // If account type is "new", redirect to registration
      if (account.type === "new") {
        // Navigate to registration page
        this.router.navigate([`/account/registration/${account.id}`]);
        return;
      }

      const newRelatedAccount: RelatedAccount = {
        id: account.id,
        accountId: authUser.uid,
        initiatorId: authUser.uid,
        targetId: account.id,
        type: account.type,
        status: "pending",
        relationship: "member",
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
        this.store.select(selectRelatedAccountsByAccountId(authUser.uid)).pipe(
          map((relatedAccounts) => ({
            authUser,
            relatedAccounts,
          })),
        ),
      ),
      map(({authUser, relatedAccounts}) => {
        if (authUser.uid === item.id) {
          return false;
        }

        // Don't show request button for accounts with "new" type
        if (item.type === "new") {
          return false;
        }

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
