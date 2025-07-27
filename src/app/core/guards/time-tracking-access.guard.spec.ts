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
import {Store} from "@ngrx/store";
import {of} from "rxjs";
import {TimeTrackingAccessGuard} from "./time-tracking-access.guard";
import {ActivatedRouteSnapshot} from "@angular/router";

describe("TimeTrackingAccessGuard", () => {
  let guard: TimeTrackingAccessGuard;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: Partial<ActivatedRouteSnapshot>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj("Store", ["select"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        TimeTrackingAccessGuard,
        {provide: Store, useValue: storeSpy},
        {provide: Router, useValue: routerSpy},
      ],
    });

    guard = TestBed.inject(TimeTrackingAccessGuard);
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockRoute = {
      paramMap: {
        get: jasmine.createSpy("get"),
      } as any,
    };
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should redirect to login if no authenticated user", async () => {
    mockStore.select.and.returnValue(of(null));
    (mockRoute.paramMap!.get as jasmine.Spy).and.returnValue("account123");

    const result = await guard.canActivate(mockRoute as ActivatedRouteSnapshot);

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });

  it("should redirect to account page if accountId equals user.uid", async () => {
    const mockUser = {uid: "user123", email: "test@example.com"};
    mockStore.select.and.returnValue(of(mockUser));
    (mockRoute.paramMap!.get as jasmine.Spy).and.returnValue("user123");

    const result = await guard.canActivate(mockRoute as ActivatedRouteSnapshot);

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/account", "user123"]);
  });

  it("should allow access if accountId does not equal user.uid", async () => {
    const mockUser = {uid: "user123", email: "test@example.com"};
    mockStore.select.and.returnValue(of(mockUser));
    (mockRoute.paramMap!.get as jasmine.Spy).and.returnValue("account456");

    const result = await guard.canActivate(mockRoute as ActivatedRouteSnapshot);

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
