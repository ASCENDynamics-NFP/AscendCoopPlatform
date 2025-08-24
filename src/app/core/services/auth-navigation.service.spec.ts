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
import {TestBed} from "@angular/core/testing";
import {Router} from "@angular/router";
import {MenuController} from "@ionic/angular";
import {AuthNavigationService} from "./auth-navigation.service";
import {AuthUser} from "@shared/models/auth-user.model";

describe("AuthNavigationService", () => {
  let service: AuthNavigationService;
  let router: jasmine.SpyObj<Router>;
  let menuCtrl: jasmine.SpyObj<MenuController>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    const menuSpy = jasmine.createSpyObj("MenuController", ["enable"]);

    TestBed.configureTestingModule({
      providers: [
        AuthNavigationService,
        {provide: Router, useValue: routerSpy},
        {provide: MenuController, useValue: menuSpy},
      ],
    });

    service = TestBed.inject(AuthNavigationService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    menuCtrl = TestBed.inject(MenuController) as jasmine.SpyObj<MenuController>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("hasCompletedRegistration", () => {
    it("should return false for new user", () => {
      const user: Partial<AuthUser> = {type: "new"};
      expect(service.hasCompletedRegistration(user as AuthUser)).toBeFalse();
    });

    it("should return true for user with valid type", () => {
      const user: Partial<AuthUser> = {type: "individual"};
      expect(service.hasCompletedRegistration(user as AuthUser)).toBeTrue();
    });

    it("should return false for null user", () => {
      expect(service.hasCompletedRegistration(null)).toBeFalse();
    });
  });

  describe("shouldRedirectFromCurrentRoute", () => {
    it("should redirect to login for null user", () => {
      const result = service.shouldRedirectFromCurrentRoute(
        null,
        "/account/123",
      );
      expect(result.shouldRedirect).toBeTrue();
      expect(result.redirectTo).toBe("/auth/login");
    });

    it("should redirect completed user from registration to profile", () => {
      const user: Partial<AuthUser> = {uid: "123", type: "individual"};
      const result = service.shouldRedirectFromCurrentRoute(
        user as AuthUser,
        "/account/registration/123",
      );
      expect(result.shouldRedirect).toBeTrue();
      expect(result.redirectTo).toBe("/account/123");
    });

    it("should redirect incomplete user from profile to registration", () => {
      const user: Partial<AuthUser> = {uid: "123", type: "new"};
      const result = service.shouldRedirectFromCurrentRoute(
        user as AuthUser,
        "/account/123",
      );
      expect(result.shouldRedirect).toBeTrue();
      expect(result.redirectTo).toBe("/account/registration/123");
    });
  });
});
