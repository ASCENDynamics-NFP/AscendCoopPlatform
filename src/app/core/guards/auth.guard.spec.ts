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
import {AuthGuard} from "./auth.guard";
import * as AuthActions from "../../state/actions/auth.actions";
import {selectAuthUser} from "../../state/selectors/auth.selectors";
import {RouterTestingModule} from "@angular/router/testing";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {AuthUser} from "../../models/auth-user.model";

describe("AuthGuard", () => {
  let guard: AuthGuard;
  let store: MockStore;
  let router: Router;

  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: null,
    photoURL: null,
    emailVerified: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, provideMockStore()],
    });

    guard = TestBed.inject(AuthGuard);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    spyOn(router, "navigate").and.returnValue(Promise.resolve(true));
    spyOn(store, "dispatch");
  });

  it("should redirect to login if user is not authenticated", async () => {
    store.overrideSelector(selectAuthUser, null);

    const result = await guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  });

  it("should send verification email and redirect to login if user is not verified", async () => {
    store.overrideSelector(selectAuthUser, mockAuthUser);

    const result = await guard.canActivate();

    expect(result).toBeFalse();
    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.sendVerificationMail({email: mockAuthUser.email!}),
    );
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.signOut());
    // expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  });
  it("should allow navigation if user is authenticated and verified", async () => {
    // Set emailVerified to true to test the successful navigation
    const verifiedUser = {...mockAuthUser, emailVerified: true};
    store.overrideSelector(selectAuthUser, verifiedUser);

    const result = await guard.canActivate();

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
