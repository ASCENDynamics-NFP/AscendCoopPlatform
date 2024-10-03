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
import {Router} from "@angular/router";
import {PopoverController} from "@ionic/angular";
import {AuthStoreService} from "../../../core/services/auth-store.service";
import {UserMenuComponent} from "./user-menu.component";

describe("UserMenuComponent", () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let authStoreServiceSpy: jasmine.SpyObj<AuthStoreService>;
  let popoverCtrlSpy: jasmine.SpyObj<PopoverController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authStoreSpy = jasmine.createSpyObj("AuthStoreService", [
      "getCurrentUser",
      "signOut",
    ]);
    const popoverSpy = jasmine.createSpyObj("PopoverController", ["dismiss"]);
    const routerSpyObj = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [UserMenuComponent],
      providers: [
        {provide: AuthStoreService, useValue: authStoreSpy},
        {provide: PopoverController, useValue: popoverSpy},
        {provide: Router, useValue: routerSpyObj},
      ],
    }).compileComponents();

    authStoreServiceSpy = TestBed.inject(
      AuthStoreService,
    ) as jasmine.SpyObj<AuthStoreService>;
    popoverCtrlSpy = TestBed.inject(
      PopoverController,
    ) as jasmine.SpyObj<PopoverController>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call signOut and dismiss popover on logout", () => {
    component.logout();
    expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    expect(authStoreServiceSpy.signOut).toHaveBeenCalled();
  });

  it("should navigate to profile and dismiss popover on goToProfile", () => {
    const userId = "test-user-id";
    authStoreServiceSpy.getCurrentUser.and.returnValue({uid: userId} as any);

    component.goToProfile();
    expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([`/${userId}`]);
  });

  it("should navigate to settings and dismiss popover on goToSettings", () => {
    component.goToSettings();
    expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/settings"]);
  });
});
