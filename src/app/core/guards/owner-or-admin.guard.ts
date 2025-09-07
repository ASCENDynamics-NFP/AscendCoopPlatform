/***********************************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 ***********************************************************************************************/
import {inject} from "@angular/core";
import {CanActivateFn} from "@angular/router";
import {Store} from "@ngrx/store";
import {combineLatest} from "rxjs";
import {map, take} from "rxjs/operators";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {selectAccountById} from "../../state/selectors/account.selectors";
import {AccessService} from "../services/access.service";
// No longer need to read a relation document; rely on adminIds/moderatorIds

export const ownerOrAdminGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const access = inject(AccessService);
  const accountId = route.params["accountId"];
  return combineLatest([
    store.select(selectAuthUser),
    store.select(selectAccountById(accountId)),
  ]).pipe(
    take(1),
    map(([authUser, account]) =>
      access.isOwnerOrAdmin(account as any, authUser),
    ),
  );
};
