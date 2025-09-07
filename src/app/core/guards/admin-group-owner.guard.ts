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
import {CanActivateFn} from "@angular/router";
import {Store} from "@ngrx/store";
import {combineLatest, of} from "rxjs";
import {map, take} from "rxjs/operators";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {selectAccountById} from "../../state/selectors/account.selectors";
import {AccessService} from "../services/access.service";

export const adminGroupOwnerGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const access = inject(AccessService);
  const accountId = route.params["accountId"];
  if (!accountId) return of(false);

  return combineLatest([
    store.select(selectAuthUser),
    store.select(selectAccountById(accountId)),
  ]).pipe(
    take(1),
    map(
      ([authUser, account]) =>
        account?.type === "group" &&
        access.isOwnerOrAdmin(account as any, authUser),
    ),
  );
};
