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
import {filter, map, take, tap} from "rxjs/operators";
import {AuthUser} from "../../../../models/auth-user.model";
import {Store} from "@ngrx/store";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectRelatedAccountsByAccountId,
  selectAccountById,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {IonContent, ViewWillEnter} from "@ionic/angular";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
})
export class DetailsPage implements OnInit, ViewWillEnter {
  @ViewChild(IonContent, {static: false}) content!: IonContent;
  public accountId: string | null = null;
  authUser$!: Observable<AuthUser | null>;
  account$!: Observable<Account | null>;
  relatedAccounts$!: Observable<RelatedAccount[]>;
  isProfileOwner$!: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {}

  scrollToSection(sectionId: string): void {
    const yOffset = document.getElementById(sectionId)?.offsetTop;
    if (yOffset !== undefined) {
      this.content.scrollToPoint(0, yOffset, 500);
    }
  }

  ionViewWillEnter() {
    // Initialize authUser$ observable
    this.authUser$ = this.store.select(selectAuthUser);

    // Subscribe to route paramMap to detect changes in accountId
    this.route.paramMap.subscribe((params) => {
      this.accountId = params.get("accountId");

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
        this.account$ = this.store.select(selectAccountById(this.accountId));
        this.relatedAccounts$ = this.store.select(
          selectRelatedAccountsByAccountId(this.accountId),
        );

        // Determine if the current user is the profile owner
        this.isProfileOwner$ = combineLatest([
          this.authUser$,
          this.account$,
        ]).pipe(
          map(([authUser, account]) => {
            if (account && authUser) {
              return account.id === authUser.uid;
            }
            return false;
          }),
        );
      }
    });
  }

  ngOnInit(): void {
    this.authUser$ = this.store.select(selectAuthUser);

    this.authUser$
      .pipe(
        filter((user): user is AuthUser => user !== null),
        take(1),
        tap((user) => {
          if (!user.type) {
            this.router.navigate([`/account/registration/${user.uid}`]);
          }
        }),
      )
      .subscribe();
  }
}
