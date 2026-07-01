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
import {NavigationError, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {selectIsLoggedIn} from "./state/selectors/auth.selectors";
import * as AuthActions from "./state/actions/auth.actions";
import {Observable} from "rxjs";
import {filter, take, tap} from "rxjs/operators";
import {register} from "swiper/element/bundle";
import {GoogleAuth} from "@southdevs/capacitor-google-auth";
import {Capacitor} from "@capacitor/core";
import {environment} from "../environments/environment";
import {
  SUPPORTED_LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
  detectUserLanguage,
} from "./core/constants/languages";

//  Import and Register Swiper
register();

import {AuthSyncService} from "./core/services/auth-sync.service";
import {BrandingService} from "./core/services/branding.service";
import {AuthFeatureFlagsService} from "./core/services/auth-feature-flags.service";

@Component({
  standalone: false,
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  private chunkRetryCount = 0;

  constructor(
    private menuCtrl: MenuController,
    private translate: TranslateService,
    private store: Store,
    private platform: Platform,
    private authSyncService: AuthSyncService, // Injected to activate the service
    private brandingService: BrandingService,
    private authFeatureFlags: AuthFeatureFlagsService,
    private router: Router,
  ) {
    this.translate.addLangs([...SUPPORTED_LANGUAGE_CODES]);
    // Initialize Remote Config-backed services. Each registers its own
    // defaults and triggers the shared fetch (idempotent). See
    // src/app/core/services/remote-config.service.ts.
    this.brandingService.init();
    this.authFeatureFlags.init();
    this.initializeApp();

    // Dismiss the branding splash (defined in index.html, outside Angular)
    // once Remote Config has resolved or the 2.5 s fallback timeout fires.
    // Direct DOM manipulation is intentional — the splash lives outside the
    // Angular tree to avoid interfering with Ionic's root-level DOM.
    this.brandingService.ready$.pipe(take(1)).subscribe(() => {
      const splash = document.getElementById("branding-splash");
      if (!splash) return;
      splash.classList.add("splash-hidden");
      // Remove from DOM after fade-out so it can't trap pointer events.
      window.setTimeout(() => splash.remove(), 400);
    });

    // Initialize the observable
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn).pipe(
      tap(async (isLoggedIn) => {
        await this.updateMenu(isLoggedIn);
      }),
    );

    // Recover from lazy chunk load failures (typical on flaky networks /
    // after a redeploy invalidates old chunk hashes). One silent retry,
    // then surface the index.html offline splash if still failing.
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationError => event instanceof NavigationError,
        ),
      )
      .subscribe((event) => {
        const isChunkError =
          /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(
            String(event.error?.message ?? event.error ?? ""),
          );
        if (!isChunkError) return;

        if (this.chunkRetryCount < 1 && navigator.onLine) {
          this.chunkRetryCount++;
          this.router.navigateByUrl(event.url, {replaceUrl: true});
          return;
        }

        const splash = document.getElementById("branding-splash");
        if (splash) {
          splash.classList.remove("splash-hidden");
          splash.classList.add("splash-offline");
          splash.setAttribute("aria-hidden", "false");
        }
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Initialize GoogleAuth with the web client ID so the plugin uses it
      // for requestIdToken() on all platforms. On Android the plugin reads
      // androidClientId from config first (higher priority than clientId),
      // but requestIdToken() only accepts a web (type-3) client ID —
      // passing clientId explicitly here overrides that config key.
      GoogleAuth.initialize({
        clientId: environment.googleAuth.webClientId,
        scopes: ["profile", "email"],
        grantOfflineAccess: true,
      });

      // Set the default language (fallback)
      this.translate.setDefaultLang(DEFAULT_LANGUAGE);

      // Determine the best language to use
      const browserLang = this.translate.getBrowserLang();
      const selectedLang = detectUserLanguage(browserLang);
      this.translate.use(selectedLang);
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
