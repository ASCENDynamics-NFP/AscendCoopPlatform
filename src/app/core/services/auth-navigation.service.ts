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
import {Router} from "@angular/router";
import {MenuController} from "@ionic/angular";
import {AuthUser} from "@shared/models/auth-user.model";

@Injectable({
  providedIn: "root",
})
export class AuthNavigationService {
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
  ) {}

  /**
   * Check if user has completed registration
   */
  hasCompletedRegistration(authUser: AuthUser | null): boolean {
    if (!authUser?.type) return false;
    const validTypes = ["user", "group"];
    return validTypes.includes(authUser.type);
  }

  /** Generic navigation helper for guards/effects */
  async navigateTo(url: string, replaceUrl: boolean = true): Promise<void> {
    await this.router.navigateByUrl(url, {replaceUrl});
  }

  /** Navigate to login screen */
  async navigateToLogin(): Promise<void> {
    await this.navigateTo("/auth/login", true);
  }

  /**
   * Navigate user to appropriate page after authentication
   */
  async navigateAfterAuth(authUser: AuthUser): Promise<void> {
    if (!authUser.emailVerified) {
      // Email not verified - let AuthGuard handle this
      return;
    }

    const hasCompleted = this.hasCompletedRegistration(authUser);

    if (!hasCompleted) {
      // Registration incomplete
      await this.router.navigateByUrl(`/account/registration/${authUser.uid}`, {
        replaceUrl: true,
      });
    } else {
      // Registration complete - enable menu and go to profile
      this.menuCtrl.enable(true);
      await this.router.navigateByUrl(`/account/${authUser.uid}`, {
        replaceUrl: true,
      });
    }
  }

  /**
   * Check if current route is a registration route
   */
  isRegistrationRoute(url: string): boolean {
    return url.includes("/registration/");
  }

  /**
   * Check if user should be redirected from current route
   */
  shouldRedirectFromCurrentRoute(
    authUser: AuthUser | null,
    currentUrl: string,
  ): {shouldRedirect: boolean; redirectTo?: string} {
    if (!authUser) {
      return {shouldRedirect: true, redirectTo: "/auth/login"};
    }

    const hasCompleted = this.hasCompletedRegistration(authUser);
    const isOnRegistration = this.isRegistrationRoute(currentUrl);
    const isOnOwnProfile = currentUrl.includes(`/account/${authUser.uid}`);

    // If registration complete but on registration page, redirect to profile
    if (hasCompleted && isOnRegistration) {
      return {shouldRedirect: true, redirectTo: `/account/${authUser.uid}`};
    }

    // If registration incomplete and on own profile (but not registration), redirect to registration
    if (!hasCompleted && isOnOwnProfile && !isOnRegistration) {
      return {
        shouldRedirect: true,
        redirectTo: `/account/registration/${authUser.uid}`,
      };
    }

    return {shouldRedirect: false};
  }
}
