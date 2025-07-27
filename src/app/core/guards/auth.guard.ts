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
import {Router, ActivatedRouteSnapshot} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import * as AuthActions from "../../state/actions/auth.actions";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  async canActivate(route?: ActivatedRouteSnapshot): Promise<boolean> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));

    if (!authUser) {
      // Redirect to login if not authenticated
      this.router.navigate(["/auth/login"]);
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
      return false;
    }

    // Check registration completion for specific routes
    if (route && this.requiresCompletedRegistration(route)) {
      const accountId = route.paramMap.get("accountId");
      const isOwnProfile = accountId === authUser.uid;
      const hasCompletedRegistration = authUser.type && authUser.type !== "new";

      if (isOwnProfile && !hasCompletedRegistration) {
        // Redirect to registration if viewing own profile and haven't completed registration
        this.router.navigate(["/account/registration", authUser.uid]);
        return false;
      }
    }

    // Prevent access to registration page if user has already completed registration
    if (route && this.isRegistrationRoute(route)) {
      const accountId = route.paramMap.get("accountId");
      const isOwnRegistration = accountId === authUser.uid;
      const hasCompletedRegistration = authUser.type && authUser.type !== "new";

      if (!isOwnRegistration) {
        // Prevent access to other users' registration pages
        this.router.navigate(["/account", authUser.uid]);
        return false;
      }

      if (hasCompletedRegistration) {
        // Redirect to user's profile if they try to access registration after completing it
        this.router.navigate(["/account", authUser.uid]);
        return false;
      }
    }

    return true;
  }

  private requiresCompletedRegistration(
    route: ActivatedRouteSnapshot,
  ): boolean {
    // Define which routes require completed registration
    const routesRequiringRegistration = [
      ":accountId", // Profile details page
      ":accountId/edit", // Profile edit page
      "settings", // Settings page
      // Add other routes that should require completed registration
    ];

    const currentPath = route.routeConfig?.path || "";
    return routesRequiringRegistration.includes(currentPath);
  }

  private isRegistrationRoute(route: ActivatedRouteSnapshot): boolean {
    // Check if the current route is the registration route
    const currentPath = route.routeConfig?.path || "";
    return currentPath === "registration/:accountId";
  }
}
