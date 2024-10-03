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
// src/app/modules/account/pages/settings/settings.page.ts
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../state/reducers";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  authUser: AuthUser | null = null;
  account?: Account;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // Subscribe to Auth User
    this.subscriptions.add(
      this.store.select(selectAuthUser).subscribe((authUser) => {
        this.authUser = authUser;

        if (this.authUser?.uid) {
          // Dispatch action to load account
          this.store.dispatch(
            AccountActions.loadAccount({accountId: this.authUser.uid}),
          );

          // Subscribe to Account
          this.subscriptions.add(
            this.store
              .select(selectAccountById(this.authUser.uid))
              .subscribe((account) => {
                this.account = account;
              }),
          );
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
