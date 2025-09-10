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
import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {AuthNavigationService} from "../services/auth-navigation.service";

export const registrationAuthGuard: CanActivateFn = async (
  route?: ActivatedRouteSnapshot,
) => {
  const store = inject(Store);
  const authNav = inject(AuthNavigationService);
  const authUser = await firstValueFrom(store.select(selectAuthUser));

  if (!authUser) {
    await authNav.navigateToLogin();
    return false;
  }

  if (route && isRegistrationRoute(route)) {
    const accountId = route.paramMap.get("accountId");
    const isOwnRegistration = accountId === authUser.uid;
    if (!isOwnRegistration) {
      await authNav.navigateTo(`/account/${authUser.uid}`, true);
      return false;
    }
    const hasCompletedRegistration = authUser.type && authUser.type !== "new";
    if (hasCompletedRegistration) {
      await authNav.navigateTo(`/account/${authUser.uid}`, true);
      return false;
    }
  }
  return true;
};

function isRegistrationRoute(route: ActivatedRouteSnapshot): boolean {
  const currentPath = route.routeConfig?.path || "";
  return currentPath === "registration/:accountId";
}
