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
import {UserMenuComponent} from "./user-menu.component";
import {Router} from "@angular/router";
import {PopoverController} from "@ionic/angular";
import {Store, StoreModule} from "@ngrx/store";
import {of} from "rxjs";
import * as AuthActions from "../../../state/actions/auth.actions";
import {AuthUser} from "@shared/models/auth-user.model";
import {TranslateTestingModule} from "../../../shared/testing/translate-testing.module";

describe("UserMenuComponent", () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let mockRouter: any;
  let mockPopoverCtrl: any;
  let mockStore: any;

  const mockAuthUser: AuthUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: "Test User",
    emailVerified: true,
    heroImage: null,
    iconImage: null,
    tagline: null,
    type: null,
    createdAt: null,
    lastLoginAt: null,
    providerData: [],
  };

  beforeEach(async () => {
    window.onbeforeunload = () => "Oh no!"; // Prevent page reloads during tests
    mockRouter = {
      navigate: jasmine.createSpy("navigate"), // Ensure navigate is mocked
      getCurrentNavigation: jasmine
        .createSpy("getCurrentNavigation")
        .and.returnValue(null), // Mock current navigation to prevent reloads
    };

    mockPopoverCtrl = {
      dismiss: jasmine.createSpy("dismiss").and.returnValue(Promise.resolve()), // Return a resolved promise
    };

    mockStore = {
      dispatch: jasmine.createSpy("dispatch"),
      select: jasmine.createSpy("select").and.returnValue(of(mockAuthUser)),
    };

    await TestBed.configureTestingModule({
      declarations: [UserMenuComponent],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: PopoverController, useValue: mockPopoverCtrl},
        {provide: Store, useValue: mockStore},
      ],
      imports: [
        StoreModule.forRoot({}),
        TranslateTestingModule,
        (await import("@ionic/angular")).IonicModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    component.authUser$ = of(mockAuthUser);
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should dismiss the popover and dispatch signOut action on logout", async () => {
    await component.logout();
    expect(mockPopoverCtrl.dismiss).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(AuthActions.signOut());
  });

  //   it("should dismiss the popover and navigate to the user profile on goToProfile if user exists", async () => {
  //     await component.goToProfile();
  //     expect(mockPopoverCtrl.dismiss).toHaveBeenCalled();
  //     expect(mockRouter.navigate).toHaveBeenCalledWith([
  //       `/account/${mockAuthUser.uid}`,
  //     ]);
  //   });

  // it("should log an error if user ID is not found on goToProfile", async () => {
  //   spyOn(console, "error");
  //   mockStore.select.and.returnValue(of(null));
  //   await component.goToProfile();
  //   expect(mockPopoverCtrl.dismiss).toHaveBeenCalled();
  //   expect(console.error).toHaveBeenCalledWith("User ID not found.");
  //   expect(mockRouter.navigate).not.toHaveBeenCalled();
  // });

  it("should dismiss the popover and navigate to settings on goToSettings", async () => {
    await component.goToSettings();
    expect(mockPopoverCtrl.dismiss).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      `/account/${mockAuthUser.uid}/settings`,
    ]);
  });

  // it("should log an error if fetching user profile throws an error in goToProfile", async () => {
  //   spyOn(console, "error");

  //   const mockError = new Error("Error fetching user"); // Simulate an error object

  //   mockStore.select.and.throwError(mockError); // Simulate an error during user fetch

  //   await component.goToProfile();

  //   expect(mockPopoverCtrl.dismiss).toHaveBeenCalled();
  //   expect(console.error).toHaveBeenCalledWith(
  //     "Error fetching user profile:",
  //     mockError,
  //   ); // Expect the error object
  //   expect(mockRouter.navigate).not.toHaveBeenCalled();
  // });
});
