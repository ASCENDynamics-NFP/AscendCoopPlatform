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
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UserDashboardPage} from "./user-dashboard.page";
import {of} from "rxjs";
import {AuthStoreService} from "../../../../core/services/auth-store.service";

describe("UserDashboardPage", () => {
  let component: UserDashboardPage;
  let fixture: ComponentFixture<UserDashboardPage>;
  let service: AuthStoreService;
  let authSpy: any = {};

  beforeEach(async () => {
    // Mock user$ as an Observable that emits null
    authSpy.user$ = of(null);
    TestBed.configureTestingModule({
      providers: [{provide: AuthStoreService, useValue: authSpy}],
    });

    service = TestBed.inject(AuthStoreService);
    fixture = TestBed.createComponent(UserDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
