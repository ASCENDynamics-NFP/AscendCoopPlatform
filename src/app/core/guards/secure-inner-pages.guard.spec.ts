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
import {SecureInnerPagesGuard} from "./secure-inner-pages.guard";
import {Store, StoreModule} from "@ngrx/store";
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {of} from "rxjs";
import {
  selectIsLoggedIn,
  selectAuthUser,
} from "../../state/selectors/auth.selectors";
import {AuthNavigationService} from "../services/auth-navigation.service";

describe("SecureInnerPagesGuard", () => {
  let guard: SecureInnerPagesGuard;
  let mockStore: any;
  let mockRouter: any;
  let mockNavController: any;
  let mockAuthNavigationService: any;

  const mockAuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
    emailVerified: true,
  };

  beforeEach(() => {
    mockStore = {
      select: jasmine.createSpy("select"),
    };

    mockRouter = {
      getCurrentNavigation: jasmine
        .createSpy("getCurrentNavigation")
        .and.returnValue({
          previousNavigation: null, // Mock to check whether there was a previous navigation
        }),
    };

    mockNavController = {
      navigateForward: jasmine.createSpy("navigateForward"),
      back: jasmine.createSpy("back"),
    };

    mockAuthNavigationService = {
      navigateAfterAuth: jasmine
        .createSpy("navigateAfterAuth")
        .and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        SecureInnerPagesGuard,
        {provide: Store, useValue: mockStore},
        {provide: Router, useValue: mockRouter},
        {provide: NavController, useValue: mockNavController},
        {provide: AuthNavigationService, useValue: mockAuthNavigationService},
      ],
    });

    guard = TestBed.inject(SecureInnerPagesGuard);
  });

  it("should create the guard", () => {
    expect(guard).toBeTruthy();
  });

  it("should return true if user is not logged in", async () => {
    mockStore.select.withArgs(selectIsLoggedIn).and.returnValue(of(false));

    const canActivate = await guard.canActivate();
    expect(canActivate).toBeTrue();
  });

  it("should return false and navigate to user page if user is logged in and there is no previous navigation", async () => {
    mockStore.select.withArgs(selectIsLoggedIn).and.returnValue(of(true));
    mockStore.select.withArgs(selectAuthUser).and.returnValue(of(mockAuthUser));

    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse();
    expect(mockAuthNavigationService.navigateAfterAuth).toHaveBeenCalledWith(
      mockAuthUser,
    );
  });

  it("should return false and navigate to authenticated destination when there is a previous navigation", async () => {
    // Even if previous navigation exists, guard delegates routing to AuthNavigationService
    mockRouter.getCurrentNavigation.and.returnValue({
      previousNavigation: {},
    });

    mockStore.select.withArgs(selectIsLoggedIn).and.returnValue(of(true));
    mockStore.select.withArgs(selectAuthUser).and.returnValue(of(mockAuthUser));

    const canActivate = await guard.canActivate();
    expect(canActivate).toBeFalse();
    expect(mockAuthNavigationService.navigateAfterAuth).toHaveBeenCalledWith(
      mockAuthUser,
    );
    expect(mockNavController.back).not.toHaveBeenCalled();
  });
});
