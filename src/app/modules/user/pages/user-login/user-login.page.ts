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
import {Component, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertController, IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

import {TranslateModule} from "@ngx-translate/core";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-user-login",
  templateUrl: "./user-login.page.html",
  styleUrls: ["./user-login.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule],
})
export class UserLoginPage implements OnInit, OnDestroy {
  private userSubscription: Subscription;
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

    private router: Router,
  ) {
    this.userSubscription = this.authStoreService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON LOGIN");
        this.router.navigateByUrl("/user-profile/" + user.uid, {
          replaceUrl: true,
        });
      }
    });
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  ngOnInit() {
    this.authStoreService.onSignInWithEmailLink();
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authStoreService.signIn(email, password);
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
  }

  goToSignUp() {
    this.router.navigateByUrl("/user-signup", {replaceUrl: false});
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
