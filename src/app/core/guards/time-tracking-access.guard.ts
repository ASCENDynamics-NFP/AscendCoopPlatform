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
import {inject} from "@angular/core";
import {CanActivateFn} from "@angular/router";
import {combineLatest, of} from "rxjs";
import {map, take, tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {AccessService} from "../services/access.service";
import {AuthNavigationService} from "../services/auth-navigation.service";

export const timeTrackingAccessGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const access = inject(AccessService);
  const authNav = inject(AuthNavigationService);
  const accountId = route.params["accountId"];
  return combineLatest([store.select(selectAuthUser)]).pipe(
    take(1),
    map(([authUser]) => ({
      authUser,
      allowed: !!authUser && !access.isOwner({id: accountId} as any, authUser),
    })),
    tap(({authUser, allowed}) => {
      if (!authUser) {
        // Delegate navigation to centralized auth navigation service
        authNav.navigateToLogin();
      } else if (!allowed) {
        // Owners shouldn't access their own time-tracking; go to profile
        authNav.navigateTo(`/account/${accountId}`, true);
      }
    }),
    map(({allowed}) => allowed),
  );
};
