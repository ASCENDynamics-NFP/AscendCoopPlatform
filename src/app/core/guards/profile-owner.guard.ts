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
  Router,
} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable, combineLatest} from "rxjs";
import {map, take} from "rxjs/operators";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {
  selectAccountById,
  selectRelatedAccountsByAccountId,
} from "../../state/selectors/account.selectors";

@Injectable({
  providedIn: "root",
})
export class ProfileOwnerGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const accountId = route.params["accountId"];

    return combineLatest([
      this.store.select(selectAuthUser),
      this.store.select(selectAccountById(accountId)),
      this.store.select(selectRelatedAccountsByAccountId(accountId)),
    ]).pipe(
      take(1),
      map(([authUser, account, relatedAccounts]) => {
        // Check if user is authenticated
        if (!authUser) {
          this.router.navigate(["/auth/login"]);
          return false;
        }

        // Check if account exists
        if (!account) {
          this.router.navigate(["/"]);
          return false;
        }

        // Check if user is the direct owner of the profile
        if (authUser.uid === account.id) {
          return true;
        }

        // For group accounts, redirect admins/moderators to admin dashboard
        if (account.type === "group") {
          const relation = relatedAccounts.find((ra) => ra.id === authUser.uid);
          const isAdmin =
            relation?.status === "accepted" &&
            (relation.access === "admin" || relation.access === "moderator");

          if (isAdmin) {
            // Redirect group admins to admin dashboard instead of edit page
            this.router.navigate(["/account", accountId, "admin"]);
            return false;
          }
        }

        // If none of the conditions are met, redirect to the account profile view
        this.router.navigate(["/account", accountId]);
        return false;
      }),
    );
  }
}
