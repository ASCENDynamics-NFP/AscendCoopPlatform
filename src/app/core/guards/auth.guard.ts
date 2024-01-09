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
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import {AuthStoreService} from "../services/auth-store.service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authStoreService: AuthStoreService,
    private router: Router,
  ) {}

  async canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Promise<boolean> {
    const authUser = await firstValueFrom(this.authStoreService.authUser$);
    if (!authUser) {
      // Redirect to login if not authenticated
      this.router.navigate(["user-login"]);
      return false;
    } else if (authUser && !authUser.emailVerified) {
      // Send verification email if the user is not verified
      if (authUser.email) {
        await this.authStoreService.sendVerificationMail(authUser.email);
      }
      // Sign out the user and redirect to login
      await this.authStoreService.signOut();
      this.router.navigate(["user-login"]);
      return false;
    }
    return true;
  }
}
