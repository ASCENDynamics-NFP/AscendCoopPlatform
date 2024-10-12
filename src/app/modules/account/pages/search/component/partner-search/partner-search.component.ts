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
// src/app/modules/account/pages/search/component/partner-search/partner-search.component.ts

import {Component, Input, OnInit} from "@angular/core";
import {Subject, Observable, combineLatest, of} from "rxjs";
import {
  debounceTime,
  startWith,
  switchMap,
  map,
  distinctUntilChanged,
} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {Account, RelatedAccount} from "../../../../../../models/account.model";
import {
  selectFilteredAccounts,
  selectRelatedAccounts,
  selectAccountLoading,
} from "../../../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../../../state/actions/account.actions";

@Component({
  selector: "app-partner-search",
  templateUrl: "./partner-search.component.html",
  styleUrls: ["./partner-search.component.scss"],
})
export class PartnerSearchComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @Input() currentGroup?: Account;
  private searchTerms = new Subject<string>();
  accountList$!: Observable<Account[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectAccountLoading);
  }

  ngOnInit() {
    // Set up search with filtering
    this.accountList$ = this.searchTerms.pipe(
      startWith(""),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.store.select(selectFilteredAccounts(term, "group")),
      ),
    );

    // Dispatch loadAccounts on init
    this.store.dispatch(AccountActions.loadAccounts());

    // Set the selected account and load related accounts
    if (this.currentGroup?.id) {
      this.store.dispatch(
        AccountActions.setSelectedAccount({accountId: this.currentGroup.id}),
      );

      this.store.dispatch(
        AccountActions.loadRelatedAccounts({accountId: this.currentGroup.id}),
      );
    }
  }

  search(event: any) {
    const value = event.target.value;
    this.searchTerms.next(value);
  }

  sendPartnerGroupRequest(group: Account) {
    if (!this.currentGroup?.id || !group.id) {
      console.log("No current group or group ID");
      return;
    }

    const relatedAccount: RelatedAccount = {
      id: group.id,
      name: group.name,
      iconImage: group.iconImage,
      tagline: group.tagline,
      type: "group",
      status: "pending",
      relationship: "partner",
      initiatorId: this.currentGroup.id,
      targetId: group.id,
    };

    this.store.dispatch(
      AccountActions.createRelatedAccount({
        accountId: this.currentGroup.id,
        relatedAccount: relatedAccount,
      }),
    );
  }

  canInvite(group: Account): Observable<boolean> {
    return combineLatest([
      of(this.currentGroup),
      this.store.select(selectRelatedAccounts),
    ]).pipe(
      map(([currentGroup, relatedAccounts]) => {
        if (group.id === currentGroup?.id) {
          return false;
        }

        // Check against the `relatedAccounts` from the store
        const isAlreadyPartner = relatedAccounts.some(
          (ra) => ra.id === group.id && ra.status !== "rejected",
        );

        return !isAlreadyPartner;
      }),
    );
  }
}
