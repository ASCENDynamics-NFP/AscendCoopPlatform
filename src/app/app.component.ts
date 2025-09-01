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
// src/app/app.component.ts

import {Component, OnInit} from "@angular/core";
import {MenuController, Platform} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {selectIsLoggedIn} from "./state/selectors/auth.selectors";
import * as AuthActions from "./state/actions/auth.actions";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {register} from "swiper/element/bundle";
import {GoogleAuth} from "@southdevs/capacitor-google-auth";
import {Capacitor} from "@capacitor/core";
import {environment} from "../environments/environment";

//  Import and Register Swiper
register();

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private menuCtrl: MenuController,
    private translate: TranslateService,
    private store: Store,
    private platform: Platform,
  ) {
    this.translate.addLangs(["en", "fr"]);
    this.initializeApp();

    // Initialize the observable
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn).pipe(
      tap(async (isLoggedIn) => {
        await this.updateMenu(isLoggedIn);
      }),
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Initialize GoogleAuth
      // - Web requires clientId
      // - Native does not require options; initialization without args is sufficient
      if (Capacitor.isNativePlatform()) {
        GoogleAuth.initialize();
      } else {
        GoogleAuth.initialize({
          clientId: environment.googleAuth.webClientId,
          scopes: ["profile", "email"],
          grantOfflineAccess: true,
        });
      }

      // Set the default language
      this.translate.setDefaultLang("en");

      // Optionally, get the user's preferred language
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang?.match(/en|fr|es/) ? browserLang : "en");
    });
  }

  ngOnInit() {
    // Dispatch the initialization action
    this.store.dispatch(AuthActions.initializeAuth());
  }

  private async updateMenu(isLoggedIn: boolean) {
    if (isLoggedIn) {
      // Enable the main app menu for authenticated users
      await this.menuCtrl.enable(true, "main");
    } else {
      // Disable the main app menu for guests
      await this.menuCtrl.enable(false, "main");
    }
  }
}
