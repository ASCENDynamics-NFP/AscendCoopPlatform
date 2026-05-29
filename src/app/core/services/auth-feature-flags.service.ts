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
// src/app/core/services/auth-feature-flags.service.ts

import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Capacitor} from "@capacitor/core";
import {RemoteConfigService} from "./remote-config.service";

/**
 * Resolved auth-related feature flags. These are the *effective* values
 * that the UI consumes — i.e. the Remote Config flag combined with
 * platform capability checks (see {@link AuthFeatureFlagsService} for
 * the platform matrix).
 */
export interface AuthFeatureFlags {
  /** Whether the "Sign in with Google" button should be rendered. */
  showGoogleSignIn: boolean;
  /** Whether the "Sign in with Apple" button should be rendered. */
  showAppleSignIn: boolean;
}

/**
 * Backing Remote Config keys / default values. Defaults are
 * intentionally `false` so a misconfigured app fails closed (email +
 * password only) until an operator publishes a value.
 */
const RC_DEFAULTS = {
  showGoogleSignIn: false,
  showAppleSignIn: false,
};

/**
 * Owns the `auth_*` Firebase Remote Config namespace and combines the
 * raw RC flag with platform capability checks. Consumers (login page,
 * signup page) subscribe to {@link flags$} or the per-flag shortcuts
 * ({@link showGoogleSignIn$}, {@link showAppleSignIn$}) without
 * needing to know about Capacitor platforms.
 *
 * Platform matrix:
 *
 * | Platform | Google                          | Apple                           |
 * | -------- | ------------------------------- | ------------------------------- |
 * | web      | RC `auth_show_google_sign_in`   | RC `auth_show_apple_sign_in`    |
 * | electron | hidden                          | hidden                          |
 * | ios      | RC `auth_show_google_sign_in`   | RC `auth_show_apple_sign_in`    |
 * | android  | RC `auth_show_google_sign_in`   | hidden (no native plugin)       |
 *
 * Defaults are `false`, so both buttons stay hidden until an operator
 * publishes the RC values. Electron is always hidden (no SSO plugins
 * wired up); Android always hides Apple (no native plugin).
 */
@Injectable({providedIn: "root"})
export class AuthFeatureFlagsService {
  private readonly subject = new BehaviorSubject<AuthFeatureFlags>({
    showGoogleSignIn: false,
    showAppleSignIn: false,
  });
  readonly flags$: Observable<AuthFeatureFlags> = this.subject.asObservable();
  readonly showGoogleSignIn$: Observable<boolean> = this.flags$.pipe(
    map((f) => f.showGoogleSignIn),
  );
  readonly showAppleSignIn$: Observable<boolean> = this.flags$.pipe(
    map((f) => f.showAppleSignIn),
  );

  private initialized = false;

  constructor(private remoteConfigService: RemoteConfigService) {}

  /** Snapshot of the currently resolved flags. */
  get current(): AuthFeatureFlags {
    return this.subject.value;
  }

  /**
   * Initialize the service. Safe to call multiple times — subsequent
   * calls are no-ops.
   */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.remoteConfigService.registerDefaults({
      auth_show_google_sign_in: RC_DEFAULTS.showGoogleSignIn,
      auth_show_apple_sign_in: RC_DEFAULTS.showAppleSignIn,
    });
    this.remoteConfigService.init();

    // Push the initial defaults-backed snapshot immediately so
    // subscribers don't sit on the bare BehaviorSubject seed.
    this.recompute();

    // Re-read after every successful Remote Config activation. The
    // initial seed emission (0) is ignored because we already
    // recomputed above with defaults.
    this.remoteConfigService.activated$.subscribe((tick) => {
      if (tick === 0) return;
      this.recompute();
    });
  }

  private recompute(): void {
    const platform = Capacitor.getPlatform();
    const isElectron = platform === "electron";
    const isAndroid = platform === "android";

    const rcGoogle = this.remoteConfigService.getBoolean(
      "auth_show_google_sign_in",
      RC_DEFAULTS.showGoogleSignIn,
    );
    const rcApple = this.remoteConfigService.getBoolean(
      "auth_show_apple_sign_in",
      RC_DEFAULTS.showAppleSignIn,
    );

    // Electron has no SSO plugins wired up — hide both regardless of RC.
    // Android has no native Apple Sign-In plugin — hide Apple regardless of RC.
    // Web + iOS (and Android for Google) defer to the RC flag.
    const showGoogleSignIn = isElectron ? false : rcGoogle;
    const showAppleSignIn = isElectron || isAndroid ? false : rcApple;

    this.subject.next({showGoogleSignIn, showAppleSignIn});
  }
}
