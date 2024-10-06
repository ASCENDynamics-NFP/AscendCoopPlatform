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
// src/app/modules/account/pages/login/login.page.spec.ts
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {LoginPage} from "./login.page";
import {ReactiveFormsModule} from "@angular/forms";
import {AlertController, IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import * as AuthActions from "../../../../state/actions/auth.actions";
import {
  selectAuthLoading,
  selectAuthError,
} from "../../../../state/selectors/auth.selectors";

describe("LoginPage", () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let store: MockStore;
  let router: Router;
  let alertController: AlertController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            {selector: selectAuthLoading, value: false},
            {selector: selectAuthError, value: null},
          ],
        }),
        {
          provide: Router,
          useValue: {navigateByUrl: jasmine.createSpy("navigateByUrl")},
        },
        {
          provide: AlertController,
          useValue: jasmine.createSpyObj("AlertController", ["create"]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController);

    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with empty values", () => {
    expect(component.loginForm.value).toEqual({email: "", password: ""});
  });

  it("should dispatch signIn action on login when form is valid", () => {
    spyOn(store, "dispatch");
    component.loginForm.setValue({
      email: "test@example.com",
      password: "password123",
    });

    component.login();

    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.signIn({email: "test@example.com", password: "password123"}),
    );
  });

  it("should not dispatch signIn action on login when form is invalid", () => {
    spyOn(store, "dispatch");
    component.loginForm.setValue({email: "", password: ""});

    component.login();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("should navigate to signup page on goToSignUp", () => {
    component.goToSignUp();

    expect(router.navigateByUrl).toHaveBeenCalledWith("/signup", {
      replaceUrl: false,
    });
  });

  it("should reset the form on loadFormData", () => {
    component.loginForm.setValue({
      email: "test@example.com",
      password: "password123",
    });

    component.loadFormData();

    expect(component.loginForm.value).toEqual({email: "", password: ""});
  });

  it("should dispatch signInWithGoogle action on signInWithGoogle", () => {
    spyOn(store, "dispatch");

    component.signInWithGoogle();

    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.signInWithGoogle());
  });

  it("should present forgot password alert and dispatch sendPasswordResetEmail", async () => {
    spyOn(store, "dispatch");
    const alertSpy = jasmine.createSpyObj("HTMLIonAlertElement", ["present"]);
    spyOn(alertController, "create").and.returnValue(Promise.resolve(alertSpy));

    await component.forgotPassword();

    expect(alertController.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  });

  it("should present get email sign-in link alert and dispatch sendSignInLinkToEmail", async () => {
    spyOn(store, "dispatch");
    const alertSpy = jasmine.createSpyObj("HTMLIonAlertElement", ["present"]);
    spyOn(alertController, "create").and.returnValue(Promise.resolve(alertSpy));

    await component.getEmailSignInLink();

    expect(alertController.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  });
  it("should initialize loading$ observable from store", (done) => {
    store.overrideSelector(selectAuthLoading, true);
    component.loading$.subscribe((loading) => {
      expect(loading).toBeTrue();
      done();
    });
  });

  it("should initialize error$ observable from store", (done) => {
    const error = {message: "An error occurred"};
    store.overrideSelector(selectAuthError, error);
    component.error$.subscribe((err) => {
      expect(err).toEqual(error);
      done();
    });
  });
});
