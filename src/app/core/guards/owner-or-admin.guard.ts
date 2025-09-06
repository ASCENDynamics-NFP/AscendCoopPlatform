/***********************************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 ***********************************************************************************************/
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable, combineLatest, of} from "rxjs";
import {take, switchMap} from "rxjs/operators";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {selectAccountById} from "../../state/selectors/account.selectors";
// No longer need to read a relation document; rely on adminIds/moderatorIds

@Injectable({providedIn: "root"})
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const accountId = route.params["accountId"];
    return combineLatest([
      this.store.select(selectAuthUser),
      this.store.select(selectAccountById(accountId)),
    ]).pipe(
      take(1),
      switchMap(([authUser, account]) => {
        if (!authUser || !account) {
          return of(false);
        }
        // Owner can always edit
        if (authUser.uid === account.id) return of(true);
        // For group accounts, allow admins/moderators
        if (account.type === "group") {
          const inAdmins =
            Array.isArray((account as any).adminIds) &&
            (account as any).adminIds.includes(authUser.uid);
          const inModerators =
            Array.isArray((account as any).moderatorIds) &&
            (account as any).moderatorIds.includes(authUser.uid);
          return of(inAdmins || inModerators);
        }
        return of(false);
      }),
    );
  }
}
