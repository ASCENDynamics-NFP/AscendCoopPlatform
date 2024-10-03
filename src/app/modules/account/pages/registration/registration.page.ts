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
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Account} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../state/reducers";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.page.html",
  styleUrls: ["./registration.page.scss"],
})
export class RegistrationPage implements OnInit {
  public accountId: string | null = null;
  public selectedType: string = "";
  public account$?: Observable<Account | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.accountId = this.route.snapshot.paramMap.get("accountId");
  }

  ngOnInit() {
    if (this.accountId) {
      // Dispatch an action to load the account
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );

      // Use the async pipe in the template
      this.account$ = this.store.select(selectAccountById(this.accountId)).pipe(
        tap((account) => {
          if (account?.type) {
            this.router.navigate([`/${this.accountId}`]);
          }
        }),
      );
    }
  }

  selectType(type: string) {
    this.selectedType = type;
  }
}
