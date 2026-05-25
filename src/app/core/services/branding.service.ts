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
// src/app/core/services/branding.service.ts

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

/**
 * Shape of the branding settings consumed by the application.
 *
 * Keys mirror the Firebase Remote Config parameter names declared in
 * `remoteconfig.template.json` (without the `branding_` prefix).
 */
export interface BrandingConfig {
  enabled: boolean;
  appName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  showAbout: boolean;
  showTeam: boolean;
  showDonate: boolean;
  showEventCalendar: boolean;
  showThinkTank: boolean;
  showServices: boolean;
  showStartups: boolean;
}

/**
 * Built-in defaults. These match the bundled ASCENDynamics NFP brand and
 * are also seeded into Remote Config via {@link getRemoteConfig().defaultConfig}
 * so the very first paint (before the network fetch resolves) uses the
 * same values that ship in the SCSS/HTML.
 */
export const BRANDING_DEFAULTS: BrandingConfig = {
  enabled: true,
  appName: "ASCENDynamics NFP",
  tagline:
    "ASCENDynamics NFP is an open-source collaboration platform connecting individuals, nonprofits, mutual aid groups, and cooperative startups. We bring together these communities with volunteers, donors, and independent contributors to innovate and drive social impact through technology. By empowering everyone to collaborate in real time, we help build stronger, more connected networks dedicated to positive change.",
  logoUrl: "",
  primaryColor: "#e87121",
  secondaryColor: "#4a90e2",
  showAbout: true,
  showTeam: true,
  showDonate: true,
  showEventCalendar: true,
  showThinkTank: true,
  showServices: true,
  showStartups: true,
};

const LOCAL_OVERRIDE_KEY = "branding.localOverride.v1";
const FETCH_INTERVAL_MS_PROD = 12 * 60 * 60 * 1000; // 12h
const FETCH_INTERVAL_MS_DEV = 60 * 1000; // 1 minute

/**
 * Reads the current branding configuration from Firebase Remote Config,
 * exposes it as an observable, and writes the active values to CSS
 * custom properties on `<html>` so the design tokens stay in sync.
 *
 * Precedence (highest to lowest):
 *   1. Per-device localStorage override (`setLocalOverride`)
 *   2. Firebase Remote Config values (after `fetchAndActivate`)
 *   3. {@link BRANDING_DEFAULTS}
 *
 * FOUC strategy: defaults are applied synchronously in {@link init}
 * before the network fetch begins. The fetch is fire-and-forget; once
 * it resolves, the active config is recomputed and tokens are updated.
 *
 * The AGPL footer/license attribution is intentionally **not** branded
 * by this service. Cosmetic identity (logo, name, color, sections) can
 * be overridden, but copyright/license notices must remain.
 */
@Injectable({providedIn: "root"})
export class BrandingService {
  private readonly subject = new BehaviorSubject<BrandingConfig>(
    BRANDING_DEFAULTS,
  );
  /** Observable view of the active branding config. */
  readonly config$: Observable<BrandingConfig> = this.subject.asObservable();

  private remoteConfig?: RemoteConfig;
  private remoteSnapshot: BrandingConfig = {...BRANDING_DEFAULTS};
  private initialized = false;

  /**
   * Snapshot of the currently active branding config (after local
   * override + Remote Config + defaults are merged).
   */
  get current(): BrandingConfig {
    return this.subject.value;
  }

  /**
   * Initialize the service. Safe to call multiple times — subsequent
   * calls are no-ops. Applies defaults + local override synchronously,
   * then kicks off a background Remote Config fetch.
   */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // 1. Apply defaults + any local override immediately so first paint
    //    is correct without waiting on the network.
    this.recompute();

    // 2. Try Remote Config in the background. If the Firebase app has
    //    not been initialized yet (e.g. during SSR/tests) skip silently.
    try {
      const app = getApp();
      this.remoteConfig = getRemoteConfig(app);
      this.remoteConfig.settings.minimumFetchIntervalMillis =
        environment.production ? FETCH_INTERVAL_MS_PROD : FETCH_INTERVAL_MS_DEV;
      this.remoteConfig.defaultConfig =
        this.toDefaultConfigPayload(BRANDING_DEFAULTS);

      void fetchAndActivate(this.remoteConfig)
        .then(() => {
          this.remoteSnapshot = this.readRemoteSnapshot();
          this.recompute();
        })
        .catch(() => {
          // Network failure / no Remote Config availability: keep
          // defaults + local override.
        });
    } catch {
      // Firebase not initialized yet — defaults + local override stand.
    }
  }

  /**
   * Persist a per-device override. Pass a partial config; only the
   * provided keys are overridden. Pass `null` (or call
   * {@link clearLocalOverride}) to drop the override entirely.
   */
  setLocalOverride(override: Partial<BrandingConfig> | null): void {
    if (override === null) {
      localStorage.removeItem(LOCAL_OVERRIDE_KEY);
    } else {
      try {
        localStorage.setItem(LOCAL_OVERRIDE_KEY, JSON.stringify(override));
      } catch {
        // localStorage may be unavailable (private browsing / quota).
        // Silently ignore — Remote Config + defaults still apply.
      }
    }
    this.recompute();
  }

  clearLocalOverride(): void {
    this.setLocalOverride(null);
  }

  /**
   * Apply tokens for an immediate visual preview without persisting.
   * Useful for live-preview while editing; the next `setLocalOverride`
   * / `clearLocalOverride` call will reconcile the persisted state.
   */
  previewTokens(override: Partial<BrandingConfig>): void {
    this.applyTokens({...this.current, ...override});
  }

  /** Returns the persisted local override, or null when none is set. */
  getLocalOverride(): Partial<BrandingConfig> | null {
    try {
      const raw = localStorage.getItem(LOCAL_OVERRIDE_KEY);
      return raw ? (JSON.parse(raw) as Partial<BrandingConfig>) : null;
    } catch {
      return null;
    }
  }

  // ---------- internals ----------

  private readRemoteSnapshot(): BrandingConfig {
    if (!this.remoteConfig) return {...BRANDING_DEFAULTS};
    const rc = this.remoteConfig;
    const str = (key: string, fallback: string): string => {
      const v = getValue(rc, key).asString();
      return v === "" ? fallback : v;
    };
    const bool = (key: string, fallback: boolean): boolean => {
      try {
        return getValue(rc, key).asBoolean();
      } catch {
        return fallback;
      }
    };
    return {
      enabled: bool("branding_enabled", BRANDING_DEFAULTS.enabled),
      appName: str("branding_app_name", BRANDING_DEFAULTS.appName),
      tagline: str("branding_tagline", BRANDING_DEFAULTS.tagline),
      logoUrl: str("branding_logo_url", BRANDING_DEFAULTS.logoUrl),
      primaryColor: str(
        "branding_primary_color",
        BRANDING_DEFAULTS.primaryColor,
      ),
      secondaryColor: str(
        "branding_secondary_color",
        BRANDING_DEFAULTS.secondaryColor,
      ),
      showAbout: bool("branding_show_about", BRANDING_DEFAULTS.showAbout),
      showTeam: bool("branding_show_team", BRANDING_DEFAULTS.showTeam),
      showDonate: bool("branding_show_donate", BRANDING_DEFAULTS.showDonate),
      showEventCalendar: bool(
        "branding_show_event_calendar",
        BRANDING_DEFAULTS.showEventCalendar,
      ),
      showThinkTank: bool(
        "branding_show_think_tank",
        BRANDING_DEFAULTS.showThinkTank,
      ),
      showServices: bool(
        "branding_show_services",
        BRANDING_DEFAULTS.showServices,
      ),
      showStartups: bool(
        "branding_show_startups",
        BRANDING_DEFAULTS.showStartups,
      ),
    };
  }

  private recompute(): void {
    const merged: BrandingConfig = {
      ...BRANDING_DEFAULTS,
      ...this.remoteSnapshot,
      ...(this.getLocalOverride() ?? {}),
    };

    // If branding is disabled, force every customizable field back to
    // defaults except the master flag itself.
    const active: BrandingConfig = merged.enabled
      ? merged
      : {...BRANDING_DEFAULTS, enabled: false};

    this.applyTokens(active);
    this.subject.next(active);
  }

  private applyTokens(config: BrandingConfig): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // src/theme/variables.scss declares --ion-color-primary (and secondary)
    // with `!important` on :root. The dark-mode blocks set the same properties
    // on <body> (without !important) via `html:not(.light) body { ... }` and
    // `html.dark { ... }`. Because a <body> own-declaration beats inherited
    // values from <html> regardless of !important, we must also set properties
    // on <body> to override the dark-mode body rule.
    const setImportant = (name: string, value: string) => {
      root.style.setProperty(name, value, "important");
      document.body?.style.setProperty(name, value, "important");
    };

    setImportant("--app-brand-primary", config.primaryColor);
    setImportant("--app-brand-secondary", config.secondaryColor);

    // Apply the full Ionic color set for primary + secondary. Ionic uses
    // `*-shade` for button hover/active and `*-tint` for some surfaces,
    // and many of our own SCSS files reference both. `*-rgb` powers
    // every `rgba(var(--ion-color-*-rgb), 0.x)` focus ring and tint.
    this.applyIonicColorTriplet(setImportant, "primary", config.primaryColor);
    this.applyIonicColorTriplet(
      setImportant,
      "secondary",
      config.secondaryColor,
    );

    root.style.setProperty("--app-brand-app-name", `"${config.appName}"`);
    root.style.setProperty(
      "--app-brand-logo-url",
      config.logoUrl ? `url("${config.logoUrl}")` : "none",
    );
  }

  /**
   * Writes the full Ionic color CSS-custom-property set for one color
   * slot (`primary` or `secondary`): base, `-rgb`, `-shade`, `-tint`,
   * `-contrast`, `-contrast-rgb`.
   */
  private applyIonicColorTriplet(
    setImportant: (name: string, value: string) => void,
    slot: "primary" | "secondary",
    hex: string,
  ): void {
    const rgb = parseHex(hex);
    if (!rgb) return;
    const base = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const shade = mixWith(rgb, {r: 0, g: 0, b: 0}, 0.12);
    const tint = mixWith(rgb, {r: 255, g: 255, b: 255}, 0.1);
    const contrastIsWhite = luminance(rgb) < 0.55;
    const contrast = contrastIsWhite ? "#ffffff" : "#000000";
    const contrastRgb = contrastIsWhite ? "255, 255, 255" : "0, 0, 0";

    setImportant(`--ion-color-${slot}`, base);
    setImportant(`--ion-color-${slot}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    setImportant(`--ion-color-${slot}-shade`, rgbToHex(shade));
    setImportant(`--ion-color-${slot}-tint`, rgbToHex(tint));
    setImportant(`--ion-color-${slot}-contrast`, contrast);
    setImportant(`--ion-color-${slot}-contrast-rgb`, contrastRgb);
  }

  private toDefaultConfigPayload(
    config: BrandingConfig,
  ): Record<string, string | boolean> {
    return {
      branding_enabled: config.enabled,
      branding_app_name: config.appName,
      branding_tagline: config.tagline,
      branding_logo_url: config.logoUrl,
      branding_primary_color: config.primaryColor,
      branding_secondary_color: config.secondaryColor,
      branding_show_about: config.showAbout,
      branding_show_team: config.showTeam,
      branding_show_donate: config.showDonate,
      branding_show_event_calendar: config.showEventCalendar,
      branding_show_think_tank: config.showThinkTank,
      branding_show_services: config.showServices,
      branding_show_startups: config.showStartups,
    };
  }
}

/**
 * Color helpers used to derive Ionic's full color slot (`-rgb`,
 * `-shade`, `-tint`, `-contrast`) from a single user-supplied hex.
 */
interface Rgb {
  r: number;
  g: number;
  b: number;
}

function parseHex(hex: string): Rgb | null {
  if (!hex) return null;
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({r, g, b}: Rgb): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Linear interpolate `color` toward `target` by `t` (0..1). */
function mixWith(color: Rgb, target: Rgb, t: number): Rgb {
  return {
    r: color.r + (target.r - color.r) * t,
    g: color.g + (target.g - color.g) * t,
    b: color.b + (target.b - color.b) * t,
  };
}

/** Perceived luminance (0..1) used to pick a contrast color. */
function luminance({r, g, b}: Rgb): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
