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
import {Store} from "@ngrx/store";
import {of, firstValueFrom} from "rxjs";
import {timeTrackingAccessGuard} from "./time-tracking-access.guard";
import {AuthNavigationService} from "../services/auth-navigation.service";

describe("TimeTrackingAccessGuard", () => {
  let mockStore: jasmine.SpyObj<Store>;
  let mockAuthNav: jasmine.SpyObj<AuthNavigationService>;
  let route: any;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj("Store", ["select"]);
    const authNavSpy = jasmine.createSpyObj("AuthNavigationService", [
      "navigateToLogin",
      "navigateTo",
    ]);

    TestBed.configureTestingModule({
      providers: [
        {provide: Store, useValue: storeSpy},
        {provide: AuthNavigationService, useValue: authNavSpy},
      ],
    });
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockAuthNav = TestBed.inject(
      AuthNavigationService,
    ) as jasmine.SpyObj<AuthNavigationService>;
    route = {params: {accountId: ""}} as any;
  });

  it("should be created", () => {
    expect(typeof timeTrackingAccessGuard).toBe("function");
  });

  it("should redirect to login if no authenticated user", async () => {
    mockStore.select.and.returnValue(of(null));
    route.params.accountId = "account123";

    const result = await TestBed.runInInjectionContext(async () =>
      firstValueFrom(timeTrackingAccessGuard(route as any, {} as any) as any),
    );

    expect(result).toBe(false);
    expect(mockAuthNav.navigateToLogin).toHaveBeenCalled();
  });

  it("should redirect to account page if accountId equals user.uid", async () => {
    const mockUser = {uid: "user123", email: "test@example.com"};
    mockStore.select.and.returnValue(of(mockUser));
    route.params.accountId = "user123";

    const result = await TestBed.runInInjectionContext(async () =>
      firstValueFrom(timeTrackingAccessGuard(route as any, {} as any) as any),
    );

    expect(result).toBe(false);
    expect(mockAuthNav.navigateTo).toHaveBeenCalledWith(
      "/account/user123",
      true,
    );
  });

  it("should allow access if accountId does not equal user.uid", async () => {
    const mockUser = {uid: "user123", email: "test@example.com"};
    mockStore.select.and.returnValue(of(mockUser));
    route.params.accountId = "account456";

    const result = await TestBed.runInInjectionContext(async () =>
      firstValueFrom(timeTrackingAccessGuard(route as any, {} as any) as any),
    );

    expect(result).toBe(true);
    expect(mockAuthNav.navigateToLogin).not.toHaveBeenCalled();
    expect(mockAuthNav.navigateTo).not.toHaveBeenCalled();
  });
});
