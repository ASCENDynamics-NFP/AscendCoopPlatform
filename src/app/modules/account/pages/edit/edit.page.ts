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
// src/app/modules/account/pages/edit/edit.page.ts

import {Component, OnInit} from "@angular/core";
import {Account} from "../../../../models/account.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, combineLatest} from "rxjs";
import {map, tap} from "rxjs/operators";
import {AuthUser} from "../../../../models/auth-user.model";
import {Store} from "@ngrx/store";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"],
})
export class EditPage implements OnInit {
  selectedForm: string = "basic";
  account$!: Observable<Account | undefined>;
  authUser$!: Observable<AuthUser | null>;
  isProfileOwner$!: Observable<boolean>;
  private accountId: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ngOnInit(): void {
    this.authUser$ = this.store.select(selectAuthUser);

    if (this.accountId) {
      // Dispatch the action to load the account
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );

      // Select the account based on the accountId
      this.account$ = this.store.select(selectAccountById(this.accountId));

      // Check if the user is the profile owner
      this.isProfileOwner$ = combineLatest([
        this.authUser$,
        this.account$,
      ]).pipe(
        map(([authUser, account]) => authUser?.uid === account?.id),
        tap((isOwner) => {
          if (!isOwner) {
            // Redirect to unauthorized page if not the profile owner
            this.router.navigate(["/account/" + this.accountId]);
          }
        }),
      );
    }
  }

  onItemSelected(form: string): void {
    this.selectedForm = form;
  }
}
