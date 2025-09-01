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
// src/app/modules/auth/pages/login/login.page.ts

import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {
  selectAuthLoading,
  selectAuthError,
} from "../../../../state/selectors/auth.selectors";
import * as AuthActions from "../../../../state/actions/auth.actions";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  public loginForm: any;
  public loading$!: Observable<boolean>;
  public error$!: Observable<any>;

  constructor(
    private alertController: AlertController,
    private fb: FormBuilder,
    private metaService: MetaService,
    private router: Router,
    private store: Store,
    private translate: TranslateService,
  ) {}

  // Runs when the page is about to enter the view
  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Login | ASCENDynamics NFP",
      "Log in to your ASCENDynamics NFP account to track volunteer hours, find opportunities, and connect with nonprofits.",
      "login, volunteer, nonprofits, community",
      {
        title: "Login to ASCENDynamics NFP",
        description:
          "Access your ASCENDynamics NFP account to stay connected with the community.",
        url: "https://ascendynamics.org/login",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "Login | ASCENDynamics NFP",
        description: "Stay connected with your volunteering community.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );

    // Add structured data for login page
    this.metaService.addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Login | ASCENDynamics NFP",
      description:
        "Log in to your ASCENDynamics NFP account to track volunteer hours, find opportunities, and connect with nonprofits.",
      url: "https://ascendynamics.org/login",
      isPartOf: {
        "@type": "WebSite",
        name: "ASCENDynamics NFP",
        url: "https://ascendynamics.org",
      },
      potentialAction: {
        "@type": "LoginAction",
        target: "https://ascendynamics.org/login",
      },
    });
  }

  // Runs when the component is initialized
  ngOnInit() {
    // Initialize the form after fb is available
    this.loginForm = this.fb.nonNullable.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    // Initialize observables after store is defined
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);

    this.loadFormData();
  }

  login() {
    const {email, password} = this.loginForm.value;

    if (email && password) {
      this.store.dispatch(AuthActions.signIn({email, password}));
    }
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
            this.store.dispatch(
              AuthActions.sendPasswordResetEmail({email: result.email}),
            );
          },
        },
      ],
    });
    await alert.present();
  }

  async getEmailSignInLink() {
    const alert = await this.alertController.create({
      header: "Get an Email Sign-In Link",
      message: "We will send you a link to log in!",
      inputs: [
        {
          type: "email",
          name: "email",
          value: "",
          placeholder: "Enter your email address",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Get an Email Sign-In Link",
          handler: (data) => {
            const email = data.email;
            if (email) {
              this.store.dispatch(AuthActions.sendSignInLinkToEmail({email}));
            } else {
              const errorMessage = this.translate.instant(
                "errors.send_signin_link_error",
              );
              console.error(errorMessage);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  signInWithGoogle() {
    this.store.dispatch(AuthActions.signInWithGoogle());
  }

  goToSignUp() {
    this.router.navigateByUrl("/auth/signup", {replaceUrl: false});
  }

  loadFormData() {
    this.loginForm.reset({
      email: "",
      password: "",
    });
  }
}
