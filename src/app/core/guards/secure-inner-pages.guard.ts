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
import {firstValueFrom} from "rxjs";
import {Store} from "@ngrx/store";
import {
  selectIsLoggedIn,
  selectAuthUser,
} from "../../state/selectors/auth.selectors";
import {AuthNavigationService} from "../services/auth-navigation.service";

@Injectable({
  providedIn: "root",
})
export class SecureInnerPagesGuard {
  constructor(
    private store: Store,
    private authNavigationService: AuthNavigationService,
  ) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await firstValueFrom(
      this.store.select(selectIsLoggedIn),
    );
    if (isLoggedIn) {
      const authUser = await firstValueFrom(this.store.select(selectAuthUser));

      if (authUser) {
        // Use the navigation service to determine where to redirect
        await this.authNavigationService.navigateAfterAuth(authUser);
      } else {
        // Fallback if no user; centralized helper
        await this.authNavigationService.navigateTo("/info", false);
      }
      return false;
    }
    return true;
  }
}
