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
import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import {IonicModule, ModalController} from "@ionic/angular";
import {Router} from "@angular/router";

import {TranslateModule} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";

function passwordStrengthValidator(
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
  if (!valid) {
    // Return an error if the password doesn't meet the requirements
    return {passwordStrength: true};
  }
  return null; // Return null if there are no errors (i.e., the validation passed)
}

@Component({
  selector: "app-user-signup",
  templateUrl: "./user-signup.page.html",
  styleUrls: ["./user-signup.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LegalModalComponent,
  ],
})
export class UserSignupPage {
  private authSubscription?: Subscription;
  signupForm = this.fb.nonNullable.group({
    email: ["", Validators.compose([Validators.required, Validators.email])],
    password: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator,
      ]),
    ],
    confirmPassword: [
      "",
      Validators.compose([Validators.required, Validators.minLength(8)]),
    ],
    agreedToTerms: [false, Validators.requiredTrue],
  });

  constructor(
    private fb: FormBuilder,
    private authStoreService: AuthStoreService,
    private router: Router,
    private modalController: ModalController,
  ) {}

  // Custom validator function to match passwords
  get matchPasswords() {
    let password = this.signupForm.controls["password"].value;
    let confirmPassword = this.signupForm.controls["confirmPassword"].value;
    return password === confirmPassword ? true : false;
  }

  ionViewWillEnter() {
    this.authSubscription = this.authStoreService.authUser$.subscribe(
      (authUser) => {
        if (authUser) {
          console.log("GOT USER ON SIGN UP");
          this.router.navigateByUrl("/registration/" + authUser.uid, {
            replaceUrl: true,
          });
        }
      },
    );
  }

  ionViewWillLeave() {
    this.authSubscription?.unsubscribe();
  }

  signup() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    this.authStoreService.signUp(email, password);
  }

  goToLogin() {
    this.router.navigateByUrl("/user-login");
  }

  async openLegalModal(contentType: "privacyPolicy" | "termsOfUse") {
    const modal = await this.modalController.create({
      component: LegalModalComponent,
      componentProps: {content: contentType},
    });
    return await modal.present();
  }
}
