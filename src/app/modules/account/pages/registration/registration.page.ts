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
// src/app/modules/account/pages/registration/registration.page.ts

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Account} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {Observable} from "rxjs";
import {tap, switchMap, filter, map, shareReplay} from "rxjs/operators";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.page.html",
  styleUrls: ["./registration.page.scss"],
})
export class RegistrationPage implements OnInit {
  public selectedType: string = "";
  public account$!: Observable<Account | undefined>;
  private accountId$!: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit() {
    // Get accountId as an observable
    this.accountId$ = this.route.paramMap.pipe(
      map((params) => params.get("accountId")),
      filter((accountId): accountId is string => accountId !== null),
      shareReplay(1),
    );

    // Dispatch action to load the account when accountId is available
    this.accountId$.subscribe((accountId) => {
      this.store.dispatch(AccountActions.loadAccount({accountId}));
    });

    // Select the account from the store
    this.account$ = this.accountId$.pipe(
      switchMap((accountId) => this.store.select(selectAccountById(accountId))),
      tap((account) => {
        if (account?.type) {
          this.router.navigate([`/account/${account.id}`]);
        }
      }),
    );
  }

  selectType(type: string) {
    this.selectedType = type;
  }
}
