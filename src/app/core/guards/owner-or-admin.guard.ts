/***********************************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 ***********************************************************************************************/
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable, combineLatest} from "rxjs";
import {map, take} from "rxjs/operators";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {
  selectAccountById,
  selectRelatedAccountsByAccountId,
} from "../../state/selectors/account.selectors";

@Injectable({providedIn: "root"})
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const accountId = route.params["accountId"];
    return combineLatest([
      this.store.select(selectAuthUser),
      this.store.select(selectAccountById(accountId)),
      this.store.select(selectRelatedAccountsByAccountId(accountId)),
    ]).pipe(
      take(1),
      map(([authUser, account, related]) => {
        if (!authUser || !account) {
          return false;
        }
        // Owner can always edit
        if (authUser.uid === account.id) return true;
        // For group accounts, allow admins/moderators
        if (account.type === "group") {
          const rel = related.find((r) => r.id === authUser.uid);
          const isAdmin =
            rel?.status === "accepted" &&
            (rel.access === "admin" || rel.access === "moderator");
          if (isAdmin) return true;
        }
        return false;
      }),
    );
  }
}
