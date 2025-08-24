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
import {Router, ActivatedRouteSnapshot} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {AuthNavigationService} from "../services/auth-navigation.service";

@Injectable({
  providedIn: "root",
})
export class RegistrationAuthGuard {
  constructor(
    private store: Store,
    private router: Router,
    private authNavigationService: AuthNavigationService,
  ) {}

  async canActivate(route?: ActivatedRouteSnapshot): Promise<boolean> {
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));

    if (!authUser) {
      // Redirect to login if not authenticated
      this.router.navigate(["/auth/login"]);
      return false;
    }

    // For registration routes, we allow access even if email is not verified
    // This is because users need to complete registration before email verification

    if (route && this.isRegistrationRoute(route)) {
      const accountId = route.paramMap.get("accountId");
      const isOwnRegistration = accountId === authUser.uid;

      if (!isOwnRegistration) {
        // Prevent access to other users' registration pages
        this.router.navigate(["/account", authUser.uid]);
        return false;
      }

      // Check if user has completed registration
      const hasCompletedRegistration = authUser.type && authUser.type !== "new";

      if (hasCompletedRegistration) {
        // If user has completed registration, they should not access registration page
        this.router.navigate(["/account", authUser.uid]);
        return false;
      }
    }

    return true;
  }

  private isRegistrationRoute(route: ActivatedRouteSnapshot): boolean {
    // Check if the current route is the registration route
    const currentPath = route.routeConfig?.path || "";
    return currentPath === "registration/:accountId";
  }
}
