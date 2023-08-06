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
import {Component, OnDestroy} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

import {TranslateModule} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../core/services/auth-store.service";

@Component({
  selector: "app-user-signup",
  templateUrl: "./user-signup.page.html",
  styleUrls: ["./user-signup.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule],
})
export class UserSignupPage implements OnDestroy {
  private authSubscription: Subscription;
  signupForm = this.fb.nonNullable.group({
    email: ["", Validators.compose([Validators.required, Validators.email])],
    password: [
      "",
      Validators.compose([Validators.required, Validators.minLength(6)]),
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authStoreService: AuthStoreService,
    private router: Router,
  ) {
    this.authSubscription = this.authStoreService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON SIGN UP");
        this.router.navigateByUrl("/user-profile/" + user.uid, {
          replaceUrl: true,
        });
      }
    });
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  signup() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    this.authStoreService.signUp(email, password);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
