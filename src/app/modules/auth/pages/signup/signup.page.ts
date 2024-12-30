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
// src/app/modules/account/pages/signup/signup.page.ts

import {Component, OnInit} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  Validators,
  ValidationErrors,
} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";
import * as AuthActions from "../../../../state/actions/auth.actions";
import {
  selectAuthError,
  selectAuthLoading,
} from "../../../../state/selectors/auth.selectors";
import {Observable} from "rxjs";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  public signupForm: any;
  public loading$: Observable<boolean>;
  public error$!: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private metaService: MetaService,
    private modalController: ModalController,
    private store: Store,
  ) {
    this.error$ = this.store.select(selectAuthError);
    this.loading$ = this.store.select(selectAuthLoading);
  }

  // Runs when the page is about to enter the view
  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Sign Up | ASCENDynamics NFP",
      "Create an account on ASCENDynamics NFP to find volunteer opportunities and connect with nonprofits.",
      "sign up, volunteer, nonprofits, community",
      {
        title: "Sign Up for ASCENDynamics NFP",
        description:
          "Join ASCENDynamics NFP to start making an impact in your community today.",
        url: "https://app.ASCENDynamics.org/signup",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "Sign Up | ASCENDynamics NFP",
        description:
          "Become part of ASCENDynamics NFP and start your volunteering journey.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
  }

  // Initialize form and state selectors in ngOnInit
  ngOnInit() {
    this.signupForm = this.fb.nonNullable.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ["", [Validators.required, Validators.minLength(8)]],
        agreedToTerms: [false, Validators.requiredTrue],
      },
      {validators: this.matchingPasswordsValidator},
    );
  }

  signup() {
    const {email, password} = this.signupForm.value;

    if (email && password) {
      this.store.dispatch(AuthActions.signUp({email, password}));
    }
  }

  // Navigate to the login page
  goToLogin() {
    this.router.navigateByUrl("/auth/login");
  }

  // Open the legal modal (Privacy Policy or Terms of Use)
  async openLegalModal(contentType: "privacyPolicy" | "termsOfUse") {
    const modal = await this.modalController.create({
      component: LegalModalComponent,
      componentProps: {content: contentType},
    });
    await modal.present();
  }

  // Custom validator to check password strength
  private passwordStrengthValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null; // Don't validate empty value
    }
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /\d/.test(value);
    const hasSpecialChar = /\W|_/.test(value); // Matches any non-word character or underscore

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    return !valid ? {passwordStrength: true} : null;
  }

  // Custom validator to ensure password and confirmPassword match
  private matchingPasswordsValidator(
    group: AbstractControl,
  ): ValidationErrors | null {
    const password = group.get("password")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;

    // Check if the password and confirm password fields match
    return password === confirmPassword ? null : {passwordMismatch: true};
  }
}
