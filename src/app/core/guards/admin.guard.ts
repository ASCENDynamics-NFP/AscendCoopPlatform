import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {selectAccountById} from "../../state/selectors/account.selectors";
// No relation fallback; use adminIds/moderatorIds only

@Injectable({providedIn: "root"})
export class AdminGuard {
  constructor(private store: Store) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const accountId = route.paramMap.get("accountId");
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!accountId || !authUser) {
      return false;
    }

    if (authUser.uid === accountId) {
      return true;
    }

    // Prefer denormalized adminIds on the account
    const account = await firstValueFrom(
      this.store.select(selectAccountById(accountId)),
    );
    if (
      account?.type === "group" &&
      Array.isArray((account as any).adminIds) &&
      (account as any).adminIds.includes(authUser.uid)
    ) {
      return true;
    }

    // Admin or moderator via denormalized fields only
    if (
      account?.type === "group" &&
      Array.isArray((account as any).moderatorIds) &&
      (account as any).moderatorIds.includes(authUser.uid)
    ) {
      return true;
    }

    return false;
  }
}
