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
  Router,
  UrlTree,
} from "@angular/router";
import {Observable, of} from "rxjs";
import {map, take, switchMap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {AuthUser} from "@shared/models/auth-user.model";

@Injectable({
  providedIn: "root",
})
export class RegistrationCompletedGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const accountId = route.paramMap.get("accountId");

    return this.store.select(selectAuthUser).pipe(
      take(1),
      map((authUser: any) => {
        // Allow access if:
        // 1. No auth user (they can view public profiles)
        // 2. Viewing someone else's profile
        // 3. Viewing own profile AND registration is completed

        if (!authUser) {
          return true; // Allow viewing public profiles
        }

        const isOwnProfile = accountId === authUser.uid;
        const hasCompletedRegistration =
          authUser.type && authUser.type !== "new";

        if (!isOwnProfile) {
          return true; // Allow viewing other people's profiles
        }

        if (isOwnProfile && !hasCompletedRegistration) {
          // Redirect to registration if viewing own profile and haven't completed registration
          return this.router.createUrlTree([
            "/account/registration",
            authUser.uid,
          ]);
        }

        return true; // Allow access to own completed profile
      }),
    );
  }
}
