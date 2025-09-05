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
export class AdminGroupOwnerGuard implements CanActivate {
  constructor(private store: Store) {}

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
        if (!authUser) return false;

        // Check if account exists
        if (!account) return false;

        // Check if user is the owner of a group account
        if (authUser.uid === account.id && account.type === "group")
          return true;

        // Check if user is admin/moderator through relatedAccounts
        const relation = relatedAccounts.find((ra) => ra.id === authUser.uid);
        const isAdmin =
          relation?.status === "accepted" &&
          (relation.access === "admin" || relation.access === "moderator");

        if (isAdmin) return true;
        return false;
      }),
    );
  }
}
