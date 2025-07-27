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
// src/app/core/guards/time-tracking-access.guard.ts
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";

@Injectable({
  providedIn: "root",
})
export class TimeTrackingAccessGuard {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    const accountId = route.paramMap.get("accountId");

    if (!authUser) {
      // If no authenticated user, redirect to login
      this.router.navigate(["/auth/login"]);
      return false;
    }

    if (accountId === authUser.uid) {
      // Prevent owners from accessing their own time-tracking
      // Redirect to the account details page instead
      this.router.navigate(["/account", accountId]);
      return false;
    }

    return true;
  }
}
