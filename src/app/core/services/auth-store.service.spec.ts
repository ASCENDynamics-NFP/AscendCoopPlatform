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
import {AuthStoreService} from "./auth-store.service";
import {User} from "firebase/auth";
import {of} from "rxjs";

describe("AuthStoreService", () => {
  let service: AuthStoreService;
  let authSpy: any;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj("auth", ["signUp", "signIn", "signOut"]);
    authSpy.signUp.and.returnValue(Promise.resolve());
    authSpy.signIn.and.returnValue(Promise.resolve());
    authSpy.signOut.and.returnValue(Promise.resolve());
    // Mock the onAuthStateChanged function
    authSpy.onAuthStateChanged = (callback: (user: User | null) => void) =>
      callback(null);
    // Mock authUser$ as an Observable that emits null
    authSpy.authUser$ = of(null);

    TestBed.configureTestingModule({
      providers: [{provide: AuthStoreService, useValue: authSpy}],
    });

    service = TestBed.inject(AuthStoreService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should sign up a user", async () => {
    const email = "test@example.com";
    const password = "password";
    await service.signUp(email, password);
    expect(authSpy.signUp).toHaveBeenCalledWith(email, password);
  }, 10000);

  it("should sign in a user", async () => {
    const email = "test@example.com";
    const password = "password";
    await service.signIn(email, password);
    expect(authSpy.signIn).toHaveBeenCalledWith(email, password);
  });

  it("should sign out a user", async () => {
    await service.signOut();
    expect(authSpy.signOut).toHaveBeenCalled();
  });

  it("should emit null for authUser$ when signed out", (done) => {
    service.authUser$.subscribe((user) => {
      expect(user).toBeNull();
      done();
    });
  });
});
