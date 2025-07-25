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
// login.page.spec.ts

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import {LoginPage} from "./login.page";
import {ReactiveFormsModule, FormBuilder} from "@angular/forms";
import {AlertController, IonicModule} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {of} from "rxjs";
import * as AuthActions from "../../../../state/actions/auth.actions";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("LoginPage", () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let storeSpy: jasmine.SpyObj<Store<any>>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(waitForAsync(() => {
    const storeMock = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    const routerMock = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    const alertControllerMock = jasmine.createSpyObj("AlertController", [
      "create",
    ]);

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        FormBuilder,
        {provide: Store, useValue: storeMock},
        {provide: Router, useValue: routerMock},
        {provide: AlertController, useValue: alertControllerMock},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertControllerSpy = TestBed.inject(
      AlertController,
    ) as jasmine.SpyObj<AlertController>;

    // Mock the selectors
    storeSpy.select.and.returnValue(of(false));
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should initialize the form and observables", () => {
      component.ngOnInit();
      expect(component.loginForm).toBeDefined();
      expect(component.loading$).toBeDefined();
      expect(component.error$).toBeDefined();
    });

    it("should call loadFormData", () => {
      spyOn(component, "loadFormData");
      component.ngOnInit();
      expect(component.loadFormData).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it("should dispatch signIn action when form is valid", () => {
      component.loginForm.setValue({
        email: "test@example.com",
        password: "password123",
      });
      component.login();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        AuthActions.signIn({
          email: "test@example.com",
          password: "password123",
        }),
      );
    });

    it("should not dispatch signIn action when form is invalid", () => {
      component.loginForm.setValue({email: "", password: ""});
      component.login();
      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("forgotPassword", () => {
    it("should present an alert for password reset", fakeAsync(() => {
      const alertSpy = jasmine.createSpyObj("HTMLIonAlertElement", ["present"]);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

      component.forgotPassword();
      tick();

      expect(alertControllerSpy.create).toHaveBeenCalled();
      expect(alertSpy.present).toHaveBeenCalled();
    }));
  });

  describe("getEmailSignInLink", () => {
    it("should present an alert to get email sign-in link", fakeAsync(() => {
      const alertSpy = jasmine.createSpyObj("HTMLIonAlertElement", ["present"]);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

      component.getEmailSignInLink();
      tick();

      expect(alertControllerSpy.create).toHaveBeenCalled();
      expect(alertSpy.present).toHaveBeenCalled();
    }));
  });

  describe("signInWithGoogle", () => {
    it("should dispatch signInWithGoogle action", () => {
      component.signInWithGoogle();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        AuthActions.signInWithGoogle(),
      );
    });
  });

  describe("goToSignUp", () => {
    it("should navigate to the signup page", () => {
      component.goToSignUp();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith("/auth/signup", {
        replaceUrl: false,
      });
    });
  });

  describe("loadFormData", () => {
    it("should reset the form", () => {
      component.ngOnInit();
      component.loginForm.setValue({
        email: "test@example.com",
        password: "password123",
      });
      component.loadFormData();
      expect(component.loginForm.value).toEqual({email: "", password: ""});
    });
  });
});
