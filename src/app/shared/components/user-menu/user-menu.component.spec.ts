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
import {provideMockStore} from "@ngrx/store/testing";
import {User} from "@angular/fire/auth"; // Adjust the import path
import {of} from "rxjs";

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
        provideMockStore(),
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

  // it("should call signOut and dismiss popover on logout", async () => {
  //   // Arrange
  //   authStoreServiceSpy.signOut.and.returnValue(Promise.resolve());
  //   popoverCtrlSpy.dismiss.and.returnValue(Promise.resolve(true));

  //   // Act
  //   await component.logout();

  //   // Assert
  //   expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
  //   expect(authStoreServiceSpy.signOut).toHaveBeenCalled();
  // });

  // it("should navigate to profile and dismiss popover on goToProfile", async () => {
  //   // Arrange
  //   const userId = "test-user-id";
  //   const mockUser: User = {
  //     uid: userId,
  //     displayName: null,
  //     email: null,
  //     emailVerified: false,
  //     isAnonymous: false,
  //     phoneNumber: null,
  //     photoURL: null,
  //     providerData: [],
  //     providerId: "firebase",
  //     refreshToken: "",
  //     tenantId: null,
  //     metadata: {
  //       creationTime: "",
  //       lastSignInTime: "",
  //     },
  //     delete: jasmine.createSpy("delete"),
  //     getIdToken: jasmine.createSpy("getIdToken"),
  //     getIdTokenResult: jasmine.createSpy("getIdTokenResult"),
  //     reload: jasmine.createSpy("reload"),
  //     toJSON: jasmine.createSpy("toJSON"),
  //   };

  //   authStoreServiceSpy.getCurrentUser.and.returnValue(mockUser); // Adjusted here
  //   popoverCtrlSpy.dismiss.and.returnValue(Promise.resolve(true));
  //   routerSpy.navigate.and.returnValue(Promise.resolve(true));

  //   // Act
  //   component.goToProfile(); // If the method is synchronous
  //   // Or await component.goToProfile(); // If the method is asynchronous

  //   // Assert
  //   expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
  //   expect(routerSpy.navigate).toHaveBeenCalledWith([`/${userId}`]);
  // });

  // it("should navigate to settings and dismiss popover on goToSettings", async () => {
  //   // Arrange
  //   popoverCtrlSpy.dismiss.and.returnValue(Promise.resolve(true));
  //   routerSpy.navigate.and.returnValue(Promise.resolve(true));

  //   // Act
  //   await component.goToSettings();

  //   // Assert
  //   expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(["/settings"]);
  // });
});
