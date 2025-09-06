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
import {ActivatedRouteSnapshot} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import * as AuthActions from "../../state/actions/auth.actions";
import {AuthNavigationService} from "../services/auth-navigation.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(
    private store: Store,
    private authNavigationService: AuthNavigationService,
  ) {}

  async canActivate(route?: ActivatedRouteSnapshot): Promise<boolean> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));

    if (!authUser) {
      // Defer navigation to centralized service
      await this.authNavigationService.navigateToLogin();
      return false;
    } else if (authUser && !authUser.emailVerified) {
      // Send verification email if the user is not verified
      if (authUser.email) {
        this.store.dispatch(
          AuthActions.sendVerificationMail({email: authUser.email}),
        );
      }
      // Sign out; navigation handled elsewhere
      this.store.dispatch(AuthActions.signOut());
      return false;
    }

    // Check registration completion for specific routes
    if (route && this.requiresCompletedRegistration(route)) {
      const accountId = route.paramMap.get("accountId");
      const isOwnProfile = accountId === authUser.uid;

      if (isOwnProfile) {
        // For own profile routes, only allow access if registration is completed
        const hasCompleted =
          this.authNavigationService.hasCompletedRegistration(authUser);

        if (!hasCompleted) {
          // Don't navigate here - let the auth effects handle navigation
          // Just block access to the route
          return false;
        }
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
}
