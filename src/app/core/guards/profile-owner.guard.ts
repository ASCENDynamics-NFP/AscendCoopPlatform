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

import {Injectable} from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable, combineLatest, of} from "rxjs";
import {take, switchMap} from "rxjs/operators";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {selectAccountById} from "../../state/selectors/account.selectors";
// No relation fallback; use adminIds/moderatorIds only

@Injectable({
  providedIn: "root",
})
export class ProfileOwnerGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const accountId = route.params["accountId"];

    return combineLatest([
      this.store.select(selectAuthUser),
      this.store.select(selectAccountById(accountId)),
    ]).pipe(
      take(1),
      switchMap(([authUser, account]) => {
        // Check if user is authenticated
        if (!authUser) return of(false);

        // Check if account exists
        if (!account) return of(false);

        // Check if user is the direct owner of the profile
        if (authUser.uid === account.id) return of(true);

        // For group accounts, redirect admins/moderators to admin dashboard
        if (account.type === "group") {
          const inAdmins =
            Array.isArray((account as any).adminIds) &&
            (account as any).adminIds.includes(authUser.uid);
          const inModerators =
            Array.isArray((account as any).moderatorIds) &&
            (account as any).moderatorIds.includes(authUser.uid);
          return of(!(inAdmins || inModerators));
        }
        return of(false);
      }),
    );
  }
}
