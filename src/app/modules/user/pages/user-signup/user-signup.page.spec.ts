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
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {UserSignupPage} from "./user-signup.page";
import {of} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthStoreService} from "../../../../core/services/auth-store.service";

describe("UserSignupPage", () => {
  let component: UserSignupPage;
  let fixture: ComponentFixture<UserSignupPage>;
  let translate: TranslateService;

  const mockAuthStoreService = {
    // Add the methods used in your component here.
    // For example, if your component calls `authStoreService.signUp()`, add a `signUp` method:
    signUp: jasmine.createSpy("signUp").and.returnValue(Promise.resolve(true)),
    authUser$: of(false), // This is an Observable
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserSignupPage, TranslateModule.forRoot()],
      providers: [
        {provide: AuthStoreService, useValue: mockAuthStoreService},
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSignupPage);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService); // inject TranslateService
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test for signUp method
  // it("should call signUp on AuthStoreService when signUp is called", async () => {
  //   // Arrange
  //   component.signupForm.setValue({
  //     email: "test@test.com",
  //     password: "test1234",
  //   });

  //   // Act
  //   await component.signup();

  //   // Assert
  //   expect(mockAuthStoreService.signUp).toHaveBeenCalled();
  //   expect(mockAuthStoreService.signUp).toHaveBeenCalledWith(
  //     "test@test.com",
  //     "test1234",
  //   );
  // });
});
