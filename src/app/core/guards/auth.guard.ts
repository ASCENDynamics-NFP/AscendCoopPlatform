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
// src/app/core/guards/auth.guard.ts (functional)
import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import * as AuthActions from "../../state/actions/auth.actions";
import {AuthNavigationService} from "../services/auth-navigation.service";

export const authGuard: CanActivateFn = async (
  route?: ActivatedRouteSnapshot,
) => {
  const store = inject(Store);
  const authNavigationService = inject(AuthNavigationService);

  const authUser = await firstValueFrom(store.select(selectAuthUser));

  if (!authUser) {
    await authNavigationService.navigateToLogin();
    return false;
  } else if (!authUser.emailVerified) {
    if (authUser.email) {
      store.dispatch(AuthActions.sendVerificationMail({email: authUser.email}));
    }
    store.dispatch(AuthActions.signOut());
    return false;
  }

  if (route && requiresCompletedRegistration(route)) {
    const accountId = route.paramMap.get("accountId");
    const isOwnProfile = accountId === authUser.uid;
    if (isOwnProfile) {
      const hasCompleted =
        authNavigationService.hasCompletedRegistration(authUser);
      if (!hasCompleted) return false;
    }
  }
  return true;
};

function requiresCompletedRegistration(route: ActivatedRouteSnapshot): boolean {
  const routesRequiringRegistration = [
    ":accountId",
    ":accountId/edit",
    ":accountId/settings",
  ];
  const currentPath = route.routeConfig?.path || "";
  return routesRequiringRegistration.includes(currentPath);
}
