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
import {UserLoginPage} from "./user-login.page";
import {FormBuilder} from "@angular/forms";
import {of} from "rxjs";
import {Router} from "@angular/router";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {StoreService} from "../../../../core/services/store.service";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({KEY: "Value"});
  }
}

describe("UserLoginPage", () => {
  let component: UserLoginPage;
  let fixture: ComponentFixture<UserLoginPage>;
  let authStoreServiceMock: any;
  let storeServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authStoreServiceMock = {
      user$: of(null),
      onSignInWithEmailLink: jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(null)),
      signIn: jasmine.createSpy().and.returnValue(Promise.resolve(null)),
      onSendPasswordResetEmail: jasmine.createSpy(),
      onSendSignInLinkToEmail: jasmine.createSpy(),
      signInWithGoogle: jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(null)),
    };

    storeServiceMock = {
      updateDoc: jasmine.createSpy(),
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: FakeLoader},
        }),
        // ... (rest of your imports)
      ],
      providers: [
        TranslateService,
        FormBuilder,
        {provide: AuthStoreService, useValue: authStoreServiceMock},
        {provide: StoreService, useValue: storeServiceMock},
        {provide: Router, useValue: routerMock},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call signIn method of authStoreService on login", () => {
    component.loginForm.setValue({
      email: "test@example.com",
      password: "password123",
    });
    component.login();
    expect(authStoreServiceMock.signIn).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
    );
  });

  // ... Add more tests for other methods and interactions
});
