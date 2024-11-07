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

import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {AuthUser} from "../../../../models/auth-user.model";
import {Account} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {switchMap} from "rxjs/operators";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  authUser$: Observable<AuthUser | null>;
  account$: Observable<Account | undefined>;

  constructor(private store: Store) {
    // Get the authUser observable
    this.authUser$ = this.store.select(selectAuthUser);

    // Use switchMap to load the account and select the account observable based on authUser
    this.account$ = this.authUser$.pipe(
      switchMap((authUser) => {
        if (authUser?.uid) {
          return this.store.select(selectAccountById(authUser.uid));
        }
        return [undefined];
      }),
    );
  }

  ngOnInit() {}
}
