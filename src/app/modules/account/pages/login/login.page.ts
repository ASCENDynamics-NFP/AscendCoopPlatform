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
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertController, IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
// import {StoreService} from "../../../../core/services/store.service";
// import {Timestamp} from "firebase/firestore";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule],
})
export class LoginPage {
  private userSubscription?: Subscription;
  public loginForm = this.fb.nonNullable.group({
    // Using Validators.compose() for multiple validation rules
    email: ["", Validators.compose([Validators.required, Validators.email])],
    password: [
      "",
      Validators.compose([Validators.required, Validators.minLength(6)]),
    ],
  });

  constructor(
    private alertController: AlertController,
    private authStoreService: AuthStoreService,
    private fb: FormBuilder,
    private router: Router, // private storeService: StoreService,
  ) {}

  ionViewWillEnter() {
    this.initiateSubscribers();
    this.loadFormData();
    this.authStoreService.onSignInWithEmailLink();
    // .then(async (uid) => this.updateUserLoginTime(uid));
  }

  ionViewWillLeave() {
    this.userSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    // Redirect to user profile if user is logged in
    this.userSubscription = this.authStoreService.authUser$.subscribe(
      (authUser) => {
        if (authUser) {
          console.log("GOT USER ON LOGIN");
          this.router.navigateByUrl("/registration/" + authUser.uid, {
            replaceUrl: true,
          });
        }
      },
    );
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authStoreService.signIn(email, password);
    //.then(async (uid) => this.updateUserLoginTime(uid));
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: "Receive a new password",
      message: "Please insert your email",
      inputs: [
        {
          type: "email",
          name: "email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Reset password",
          handler: (result) => {
            this.authStoreService.onSendPasswordResetEmail(result.email);
          },
        },
      ],
    });
    await alert.present();
  }

  async getEmailSignInLink() {
    const alert = await this.alertController.create({
      header: "Get an Email SignIn Link",
      message: "We will send you a link to log in!",
      inputs: [
        {
          type: "email",
          name: "email",
          value: "",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Get an Email SignIn Link",
          handler: (result) => {
            this.authStoreService.onSendSignInLinkToEmail(result.email);
          },
        },
      ],
    });
    await alert.present();
  }

  signInWithGoogle() {
    this.authStoreService.signInWithGoogle();
    // .then(async (uid) => await this.updateUserLoginTime(uid));
  }

  goToSignUp() {
    this.router.navigateByUrl("/signup", {replaceUrl: false});
  }

  loadFormData() {
    // Update the form with the user data
    this.loginForm.patchValue({
      password: "",
      email: "",
    });
  }

  // async updateUserLoginTime(uid: string | void) {
  //   if (!uid) {
  //     return;
  //   }
  //   await this.storeService.updateDoc("users", {
  //     lastLoginAt: Timestamp.now(),
  //     id: uid,
  //   });
  // }
}
