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
// src/app/guards/auth.guard.ts
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import * as AuthActions from "../../state/actions/auth.actions";
import {AppState} from "../../state/reducers";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));

    if (!authUser) {
      // Redirect to login if not authenticated
      this.router.navigate(["/login"]);
      return false;
    } else if (authUser && !authUser.emailVerified) {
      // Send verification email if the user is not verified
      if (authUser.email) {
        this.store.dispatch(
          AuthActions.sendVerificationMail({email: authUser.email}),
        );
      }
      // Sign out the user and redirect to login
      this.store.dispatch(AuthActions.signOut());
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }
}
