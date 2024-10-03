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

import {Component, OnDestroy, OnInit} from "@angular/core";
import {Account} from "../../../../models/account.model";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthUser} from "../../../../models/auth-user.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../state/reducers";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"],
})
export class EditPage implements OnInit, OnDestroy {
  selectedForm: string = "basic";
  authUser: AuthUser | null = null;
  private accountId: string | null = null;
  private subscriptions = new Subscription();
  public account!: Account; // Changed to non-null assertion to ensure account is defined

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectAuthUser).subscribe((user) => {
        this.authUser = user;
      }),
    );

    if (this.accountId) {
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );

      this.subscriptions.add(
        this.store
          .select(selectAccountById(this.accountId))
          .subscribe((account) => {
            if (account) {
              this.account = account;
            }
          }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get isProfileOwner(): boolean {
    return this.accountId === this.authUser?.uid;
  }

  onItemSelected(form: string): void {
    this.selectedForm = form;
  }
}
