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
// src/app/modules/account/pages/signup/signup.page.spec.ts

import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SignupPage} from "./signup.page";
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule, ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {StoreModule, Store} from "@ngrx/store";
import {authReducer} from "../../../../state/reducers/auth.reducer";
import {By} from "@angular/platform-browser";
import * as AuthActions from "../../../../state/actions/auth.actions";
import {of} from "rxjs";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";
import {selectAuthLoading} from "../../../../state/selectors/auth.selectors";

describe("SignupPage", () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let store: Store;
  let router: Router;
  let modalController: ModalController;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    const modalControllerSpy = jasmine.createSpyObj("ModalController", [
      "create",
    ]);

    await TestBed.configureTestingModule({
      declarations: [SignupPage],
      imports: [
        LegalModalComponent,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        StoreModule.forRoot({auth: authReducer}),
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ModalController, useValue: modalControllerSpy},
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    modalController = TestBed.inject(ModalController);

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the SignupPage component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the signup form with empty values", () => {
    const form = component.signupForm;
    expect(form).toBeTruthy();
    expect(form.get("email")?.value).toBe("");
    expect(form.get("password")?.value).toBe("");
    expect(form.get("confirmPassword")?.value).toBe("");
    expect(form.get("agreedToTerms")?.value).toBe(false);
  });

  // it("should validate required fields", () => {
  //   const form = component.signupForm;
  //   form.get("email")?.setValue("");
  //   form.get("password")?.setValue("");
  //   form.get("confirmPassword")?.setValue("");
  //   form.get("agreedToTerms")?.setValue(false);

  //   fixture.detectChanges();

  //   expect(form.valid).toBeFalse();
  //   expect(form.get("email")?.hasError("required")).toBeTrue();
  //   expect(form.get("password")?.hasError("required")).toBeTrue();
  //   expect(form.get("confirmPassword")?.hasError("required")).toBeTrue();
  //   expect(form.get("agreedToTerms")?.hasError("requiredTrue")).toBeTrue();
  // });

  it("should validate email format", () => {
    const form = component.signupForm;
    form.get("email")?.setValue("invalid-email");

    expect(form.get("email")?.hasError("email")).toBeTrue();
  });

  it("should validate password strength", () => {
    const form = component.signupForm;
    form.get("password")?.setValue("weakpass"); // lacks uppercase, number, special char

    expect(form.get("password")?.hasError("passwordStrength")).toBeTrue();

    form.get("password")?.setValue("Strong1!"); // meets criteria

    expect(form.get("password")?.hasError("passwordStrength")).toBeFalse();
  });

  it("should validate matching passwords", () => {
    const form = component.signupForm;
    form.get("password")?.setValue("StrongPass1!");
    form.get("confirmPassword")?.setValue("DifferentPass1!");

    expect(form.errors?.["passwordMismatch"]).toBeTrue();

    form.get("confirmPassword")?.setValue("StrongPass1!");

    expect(form.errors?.["passwordMismatch"]).toBeUndefined();
  });

  // it("should dispatch signUp action with correct payload on form submit", () => {
  //   spyOn(store, "dispatch");

  //   const form = component.signupForm;
  //   form.get("email")?.setValue("test@example.com");
  //   form.get("password")?.setValue("StrongPass1!");
  //   form.get("confirmPassword")?.setValue("StrongPass1!");
  //   form.get("agreedToTerms")?.setValue(true);

  //   const submitButton = fixture.debugElement.query(
  //     By.css('ion-button[type="submit"]'),
  //   );
  //   submitButton.triggerEventHandler("click", null);

  //   fixture.detectChanges();

  //   expect(store.dispatch).toHaveBeenCalledWith(
  //     AuthActions.signUp({
  //       email: "test@example.com",
  //       password: "StrongPass1!",
  //     }),
  //   );
  // });

  it("should not dispatch signUp action if form is invalid", () => {
    spyOn(store, "dispatch");

    const form = component.signupForm;
    form.get("email")?.setValue("invalid-email"); // invalid email
    form.get("password")?.setValue("weak"); // weak password
    form.get("confirmPassword")?.setValue("weak");
    form.get("agreedToTerms")?.setValue(false);

    const submitButton = fixture.debugElement.query(
      By.css('ion-button[type="submit"]'),
    );
    submitButton.triggerEventHandler("click", null);

    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("should navigate to login page when goToLogin is called", () => {
    component.goToLogin();
    expect(router.navigateByUrl).toHaveBeenCalledWith("/auth/login");
  });

  it("should open legal modal with correct content type", async () => {
    const modalSpy = modalController.create as jasmine.Spy;
    modalSpy.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy("present"),
      } as any),
    );

    await component.openLegalModal("privacyPolicy");
    expect(modalController.create).toHaveBeenCalledWith({
      component: LegalModalComponent,
      componentProps: {content: "privacyPolicy"},
    });

    await component.openLegalModal("termsOfUse");
    expect(modalController.create).toHaveBeenCalledWith({
      component: LegalModalComponent,
      componentProps: {content: "termsOfUse"},
    });
  });

  // it("should display error message from store", () => {
  //   const error = {message: "Sign up failed"};
  //   spyOn(store, "select").and.returnValue(of(error));

  //   fixture.detectChanges();

  //   const errorMessageElement = fixture.debugElement.query(
  //     By.css(".error-message p"),
  //   );
  //   expect(errorMessageElement).toBeTruthy();

  //   const errorMessage = errorMessageElement?.nativeElement;
  //   expect(errorMessage.textContent).toContain("Sign up failed");
  // });

  // it("should display loading spinner when loading is true", () => {
  //   spyOn(store, "select").and.callFake((selector: any) => {
  //     if (selector === selectAuthLoading) {
  //       return of(true);
  //     }
  //     return of(null);
  //   });

  //   fixture.detectChanges();

  //   const spinner = fixture.debugElement.query(By.css("ion-spinner"));
  //   expect(spinner).toBeTruthy();
  // });

  it("should dispatch signUp action with correct payload on form submit", () => {
    spyOn(store, "dispatch");

    const form = component.signupForm;
    form.get("email")?.setValue("test@example.com");
    form.get("password")?.setValue("StrongPass1!");
    form.get("confirmPassword")?.setValue("StrongPass1!");
    form.get("agreedToTerms")?.setValue(true);

    fixture.detectChanges();

    component.signup();

    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.signUp({
        email: "test@example.com",
        password: "StrongPass1!",
      }),
    );
  });

  it("should hide loading spinner when loading is false", () => {
    // Mock the loading observable
    spyOn(store, "select").and.returnValue(of(false));

    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css("ion-spinner"));
    expect(spinner).toBeNull();
  });
});
