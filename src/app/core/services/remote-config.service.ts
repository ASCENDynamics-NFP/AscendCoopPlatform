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
// src/app/core/services/remote-config.service.ts

import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {getApp} from "firebase/app";
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  type RemoteConfig,
} from "firebase/remote-config";
import {environment} from "../../../environments/environment";

const FETCH_INTERVAL_MS_PROD = 12 * 60 * 60 * 1000; // 12h
const FETCH_INTERVAL_MS_DEV = 60 * 1000; // 1 minute

/**
 * Generic, domain-agnostic wrapper around Firebase Remote Config.
 *
 * Domain services (e.g. {@link BrandingService},
 * `AuthFeatureFlagsService`) consume this service rather than calling
 * the Firebase modular SDK directly. Each domain service:
 *
 *   1. Calls {@link registerDefaults} with its own keys + fallback
 *      values during its own `init()`.
 *   2. Calls {@link init} to trigger the network fetch (idempotent —
 *      subsequent calls are no-ops).
 *   3. Subscribes to {@link activated$} to recompute its derived state
 *      after a successful activation.
 *   4. Reads values via {@link getString} / {@link getBoolean} /
 *      {@link getNumber} (each falls back to the registered default
 *      when Remote Config is not available, e.g. SSR/tests).
 *
 * The intent is that the parameter namespace is owned by the domain
 * service — `branding_*` keys live in `BrandingService`, `auth_*` keys
 * live in `AuthFeatureFlagsService`, etc. This service does not know
 * or care which keys exist.
 *
 * Note on first paint: defaults are returned synchronously from the
 * getters even before Remote Config has activated, so consumers can
 * safely build their initial state without waiting on the network.
 */
@Injectable({providedIn: "root"})
export class RemoteConfigService {
  private remoteConfig?: RemoteConfig;
  private readonly defaults: Record<string, string | number | boolean> = {};
  private readonly activatedSubject = new BehaviorSubject<number>(0);
  /**
   * Emits an incrementing tick after every successful
   * `fetchAndActivate`. Consumers subscribe to know when to re-read
   * their values. Emits the initial seed value (0) immediately on
   * subscription so consumers can perform a first read in one place.
   */
  readonly activated$: Observable<number> =
    this.activatedSubject.asObservable();
  private initialized = false;

  /**
   * Register fallback values for a set of keys. Safe to call before or
   * after {@link init}. When called before init, the values are also
   * pushed into Firebase's `defaultConfig` so `getValue()` returns them
   * before the first network activation completes.
   */
  registerDefaults(defaults: Record<string, string | number | boolean>): void {
    Object.assign(this.defaults, defaults);
    if (this.remoteConfig) {
      this.remoteConfig.defaultConfig = {...this.defaults} as Record<
        string,
        string | number | boolean
      >;
    }
  }

  /**
   * Initialize Remote Config and kick off a background fetch.
   * Idempotent — subsequent calls are no-ops.
   *
   * Silently no-ops when the Firebase App has not been initialized
   * yet (e.g. SSR or tests); in that case the registered defaults
   * still feed the getters.
   */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    try {
      const app = getApp();
      this.remoteConfig = getRemoteConfig(app);
      this.remoteConfig.settings.minimumFetchIntervalMillis =
        environment.production ? FETCH_INTERVAL_MS_PROD : FETCH_INTERVAL_MS_DEV;
      this.remoteConfig.defaultConfig = {...this.defaults} as Record<
        string,
        string | number | boolean
      >;
      void fetchAndActivate(this.remoteConfig)
        .then(() => {
          this.activatedSubject.next(this.activatedSubject.value + 1);
        })
        .catch(() => {
          // Network failure / RC unavailable: keep registered defaults.
        });
    } catch {
      // Firebase not initialized yet (SSR/tests). Defaults still feed
      // the getters.
    }
  }

  getString(key: string, fallback = ""): string {
    if (this.remoteConfig) {
      try {
        const v = getValue(this.remoteConfig, key).asString();
        if (v !== "") return v;
      } catch {
        // fall through to default
      }
    }
    const d = this.defaults[key];
    return typeof d === "string" ? d : fallback;
  }

  getBoolean(key: string, fallback = false): boolean {
    if (this.remoteConfig) {
      try {
        return getValue(this.remoteConfig, key).asBoolean();
      } catch {
        // fall through to default
      }
    }
    const d = this.defaults[key];
    return typeof d === "boolean" ? d : fallback;
  }

  getNumber(key: string, fallback = 0): number {
    if (this.remoteConfig) {
      try {
        return getValue(this.remoteConfig, key).asNumber();
      } catch {
        // fall through to default
      }
    }
    const d = this.defaults[key];
    return typeof d === "number" ? d : fallback;
  }
}
