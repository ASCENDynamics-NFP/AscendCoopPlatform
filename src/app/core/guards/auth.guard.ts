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
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {AuthStoreService} from "../services/auth-store.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(
    public authStoreService: AuthStoreService,
    public router: Router,
  ) {}

  // Used to restrict pages to users when they are logged out
  async canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Promise<boolean> {
    const user = await firstValueFrom(this.authStoreService.user$);
    if (!user) {
      // window.alert("Access Denied, Login is Required to Access This Page!");
      this.router.navigate(["user-login"]);
      return false;
    } else if (user && !user.emailVerified) {
      if (user.email) {
        this.authStoreService.sendVerificationMail(user.email);
      }
      this.authStoreService.signOut();
      return false;
    }
    return true;
  }
}
