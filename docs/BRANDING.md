# Branding via Firebase Remote Config

The Ascend Co-op Platform supports lightweight, runtime branding controlled by
Firebase Remote Config with an optional per-device override stored in
`localStorage`. This document covers what is brandable, how the layers
interact, how to publish a new brand, and what the AGPL license requires you
to leave alone.

## What is brandable

| Parameter                      | CSS effect                                                              | UI surface                                                              |
| ------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `branding_enabled`             | Master switch — when `false`, all branding fields fall back to defaults | Used by `BrandingService`                                               |
| `branding_app_name`            | Sets `--app-brand-app-name` (CSS string)                                | Toolbar / landing title (consume via `BrandingService.current.appName`) |
| `branding_tagline`             | —                                                                       | Landing hero subtitle                                                   |
| `branding_logo_url`            | Sets `--app-brand-logo-url` (CSS `url()` or `none`)                     | Logo `<img>` slots                                                      |
| `branding_primary_color`       | Sets `--ion-color-primary` + `--app-brand-primary`                      | All `color="primary"` Ionic surfaces                                    |
| `branding_secondary_color`     | Sets `--ion-color-secondary` + `--app-brand-secondary`                  | All `color="secondary"` Ionic surfaces                                  |
| `branding_show_about`          | —                                                                       | Toggle About sections                                                   |
| `branding_show_team`           | —                                                                       | Toggle Team sections                                                    |
| `branding_show_donate`         | —                                                                       | Toggle Donate / Support CTA                                             |
| `branding_show_event_calendar` | —                                                                       | Toggle Event Calendar entry                                             |
| `branding_show_think_tank`     | —                                                                       | Toggle Think Tank entry                                                 |

Defaults live in three places — keep them in sync if you change them:

- `remoteconfig.template.json` — `parameters[*].defaultValue.value`
- `src/theme/variables.scss` — `--app-brand-*` token defaults
- `src/app/core/services/branding.service.ts` — `BRANDING_DEFAULTS`

## What is **not** brandable (license requirement)

This project is licensed under **AGPL-3.0**. The license requires that
recipients be informed of the project name, license, and where to obtain the
source. The branding system **must not** be used to:

- Remove or hide the AGPL footer / license link.
- Remove or hide the copyright attribution.
- Remove or hide the "View Source" link that points to the upstream repo.

Cosmetic identity (logo, color, app display name, marketing sections) is fair
game; legal notices are not.

## Precedence

Three layers, highest wins:

1. **Per-device localStorage override** — written by `BrandingService.setLocalOverride()`,
   used by the admin preview page and the "Disable branding on this device"
   toggle on `/info/theme-showcase`. Persists in the current browser only.
2. **Firebase Remote Config** — populated by uploading `remoteconfig.template.json`
   (or an equivalent payload) to the Firebase console.
3. **Built-in defaults** — `BRANDING_DEFAULTS` and `--app-brand-*` SCSS tokens.

## FOUC behavior

Remote Config is fetched asynchronously. To keep the first paint correct
without blocking app startup:

- Bundled defaults are applied **synchronously** in `BrandingService.init()`
  before the network call begins.
- `RemoteConfig.defaultConfig` is seeded with the same defaults, so even if the
  first `fetchAndActivate()` returns no cached values, `getValue()` falls back
  to the bundled defaults rather than to empty strings.
- After `fetchAndActivate()` resolves, tokens and the `config$` observable
  update; UI that subscribes via the async pipe will refresh automatically.

`minimumFetchIntervalMillis` is set to **12 hours** in production and **1
minute** on `localhost` / `*.local` / `*-dev.web.app`.

## Publishing a new brand

> `firebase deploy --only remoteconfig` is **not** used in this project. Use the
> Firebase console UI instead.

There are two ways to push changes to Remote Config:

### Option A — `/admin/branding` (recommended)

1. Sign in with an authorized account.
2. Visit [`/admin/branding`](http://localhost:4200/admin/branding) and edit the
   draft.
3. Click **Apply on this device** to preview the change locally (writes the
   localStorage override; affects no one else).
4. When satisfied, click **Copy Remote Config JSON**. The JSON is also logged
   to the browser console as a fallback.
5. Open the
   [Firebase Remote Config console](https://console.firebase.google.com/project/_/config),
   pick your project, use **Publish from JSON** (or paste each parameter
   manually), and confirm publish.
6. Remove your local override (**Clear local override**) to verify the new
   remote brand fetches correctly on next reload.

### Option B — `remoteconfig.template.json`

1. Edit `remoteconfig.template.json` directly with the new defaults.
2. Open the
   [Firebase Remote Config console](https://console.firebase.google.com/project/_/config).
3. Use the console's **Publish from JSON** action and upload the file.
4. Confirm and publish.

## Per-device override

End users can disable branding on their own device from the showcase page
(`/info/theme-showcase` → Branding section → "Disable branding on this
device" toggle). This writes `{"enabled": false}` to localStorage under
`branding.localOverride.v1`. Clearing the override returns the device to the
Remote Config value.

## Adding a new branding parameter

1. Add the parameter to `remoteconfig.template.json`.
2. Extend `BrandingConfig`, `BRANDING_DEFAULTS`, `readRemoteSnapshot()`, and
   `toDefaultConfigPayload()` in `src/app/core/services/branding.service.ts`.
3. If the parameter maps to a CSS token, extend `applyTokens()` and add the
   token to `src/theme/variables.scss` (in the `:root` block — branding tokens
   are theme-agnostic).
4. Expose the field in `/admin/branding`.
5. Update the table at the top of this file.

## Known limitations

- **Single-brand**: Remote Config is global. For per-organization branding,
  branding values would need to live in Firestore keyed by `accountId` —
  a larger change not addressed here.
- **AGPL footer**: As noted above, the AGPL attribution / license link is not
  brandable. If your deployment needs to comply, ensure those UI elements are
  not removed by your branding choices.
- **Capacitor native**: The Firebase JS SDK Remote Config works inside the
  Capacitor WebView on iOS/Android — no separate native plugin is required.
  Offline behavior matches the web: cached values are used until the next
  successful fetch.
