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
// src/app/modules/account/pages/details/details.page.ts

import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, combineLatest} from "rxjs";
import {map, tap} from "rxjs/operators";
import {AuthUser} from "../../../../models/auth-user.model";
import {Store} from "@ngrx/store";

import {Account} from "../../../../models/account.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectSelectedAccount,
  selectRelatedAccounts,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {IonContent} from "@ionic/angular";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
})
export class DetailsPage implements OnInit {
  @ViewChild(IonContent, {static: false}) content!: IonContent; // Get reference to ion-content
  public accountId: string | null;
  authUser$!: Observable<AuthUser | null>;
  fullAccount$!: Observable<Account | null>;
  isProfileOwner$!: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {
    this.accountId = this.route.snapshot.paramMap.get("accountId");
  }

  scrollToSection(sectionId: string): void {
    const yOffset = document.getElementById(sectionId)?.offsetTop;
    if (yOffset !== undefined) {
      this.content.scrollToPoint(0, yOffset, 500);
    }
  }

  ngOnInit(): void {
    // Initialize authUser$ observable
    this.authUser$ = this.store.select(selectAuthUser);

    if (this.accountId) {
      // Dispatch loadAccount action to fetch account data
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );

      // Dispatch setSelectedAccount action
      this.store.dispatch(
        AccountActions.setSelectedAccount({accountId: this.accountId}),
      );

      // Select account and related accounts from the store
      const selectedAccount$ = this.store.select(selectSelectedAccount);
      const relatedAccounts$ = this.store.select(selectRelatedAccounts);

      // Combine the account and related accounts into one observable without mutating
      this.fullAccount$ = combineLatest([
        selectedAccount$,
        relatedAccounts$,
      ]).pipe(
        tap(([account]) => {
          if (account && !account.type) {
            this.router.navigate([`/registration/${this.accountId}`]);
          }
        }),
        map(([account, relatedAccounts]) => {
          if (account) {
            return {
              ...account, // Clone the account object
              relatedAccounts: relatedAccounts, // Assign relatedAccounts without mutation
            };
          } else {
            return null;
          }
        }),
      );

      // Determine if the current user is the profile owner
      this.isProfileOwner$ = combineLatest([
        this.authUser$,
        this.fullAccount$,
      ]).pipe(
        map(([authUser, account]) => {
          // Ensure account and authUser are not null
          if (account && authUser) {
            return account.id === authUser.uid;
          }
          return false; // Default to false if any are null
        }),
      );
    }
  }
}
