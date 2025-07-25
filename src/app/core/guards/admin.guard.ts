import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { selectAuthUser } from "../../state/selectors/auth.selectors";
import { selectRelatedAccountsByAccountId } from "../../state/selectors/account.selectors";

@Injectable({ providedIn: "root" })
export class AdminGuard {
  constructor(private store: Store, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const accountId = route.paramMap.get("accountId");
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));
    if (!accountId || !authUser) {
      await this.router.navigate(["/auth/login"]);
      return false;
    }

    if (authUser.uid === accountId) {
      return true;
    }

    const relatedAccounts = await firstValueFrom(
      this.store.select(selectRelatedAccountsByAccountId(accountId))
    );

    const relation = relatedAccounts.find((ra) => ra.id === authUser.uid);
    const isAdmin =
      relation?.status === "accepted" &&
      (relation.access === "admin" || relation.access === "moderator");

    if (isAdmin) {
      return true;
    }

    await this.router.navigate(["/"]);
    return false;
  }
}
