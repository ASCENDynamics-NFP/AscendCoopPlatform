# Copilot Agent Instructions — Ascend Co-op Platform

> This document describes the architecture, conventions, and best practices for AI agents (GitHub Copilot, VS Code agents) working on this codebase.

## Project Overview

**Ascend Co-op Platform** (`ascendcoopplatform`) is an open-source collaboration platform for worker-owned cooperatives, nonprofit organizations, and private organizations. It provides user/organization profiles, group and project management, listings, messaging, time tracking, and an admin dashboard — supporting real-time, data-driven collaboration and community-based solutions for basic human needs. It targets iOS, Android, and the web from a single Angular codebase.

License: **AGPL-3.0** — every source file starts with the AGPL header block found in `src/app/app.module.ts`. Preserve this header in new files.

## Tech Stack

| Layer              | Technology                                            | Version       |
| ------------------ | ----------------------------------------------------- | ------------- |
| Frontend Framework | Angular                                               | 21            |
| Build tooling      | `@angular/build` (esbuild) — `:application`, `:karma` | 21            |
| TypeScript         | TypeScript                                            | ~6.0          |
| UI Framework       | Ionic                                                 | 8.8           |
| Native Bridge      | Capacitor                                             | 8             |
| State Management   | NgRx Store + Effects + Entity (classic, not Signals)  | `@ngrx/*` 21  |
| State Persistence  | `ngrx-store-localstorage`                             | 20.1          |
| Firebase Binding   | `@angular/fire` (compat) + `firebase` modular SDK     | 20 / 12       |
| Backend            | Firebase Cloud Functions v2                           | Node.js 22    |
| `firebase-admin` / `firebase-functions` | (Cloud Functions deps)                   | 13 / 7        |
| Database           | Firestore + Realtime Database                         |               |
| Auth               | Firebase Auth (Email, Google via Capacitor)           |               |
| i18n               | `@ngx-translate/core`                                 | 17            |
| Maps               | Angular Google Maps + `@googlemaps/markerclusterer`   | 21 / 2        |
| Charts             | Chart.js + `ng2-charts`                               | 4 / 10        |
| PDF / Imaging      | `jspdf`, `html2canvas`, `sharp` (functions)           |               |
| Email              | `nodemailer` (via Cloud Functions)                    |               |

## Architecture Patterns

> Important: this project uses **NgModules**, **classic NgRx** (Store/Effects/Entity), and the **AngularFire compat** layer alongside the Firebase modular SDK. Do not introduce standalone components, Signal Store, or pure-modular replacements without explicit user approval — those would be cross-cutting refactors.

### 1. Feature NgModules

Code is organized into feature NgModules under `src/app/modules/` (e.g. `account`, `auth`, `info`, `listing`, `messaging`, `time-tracking`). Each module owns its routing module, pages, components and feature services.

```typescript
// ✅ CORRECT — feature module pattern used in this repo
@NgModule({
  declarations: [SomePage, SomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    SomeRoutingModule,
    TranslateModule,
  ],
})
export class SomeModule {}
```

### 2. Shared and Core Modules

- `src/app/shared/` — reusable components, pipes, directives and the `SharedModule` that re-exports them.
- `src/app/core/` — singleton services (`AuthService`, `FirestoreService`, `ImageUploadService`, `ErrorHandlerService`, `SuccessHandlerService`, `AuthSyncService`), route guards, constants, data and utils. All services here are `providedIn: 'root'`.

### 3. Dependency Injection — constructor based

This codebase uses constructor injection throughout. Match the surrounding style when editing existing classes:

```typescript
// ✅ Matches existing code
@Injectable({ providedIn: "root" })
export class ExampleService {
  constructor(
    private firestore: FirestoreService,
    private store: Store<AppState>,
  ) {}
}
```

`inject()` may be used in new functional contexts (e.g. functional guards/interceptors, route resolvers), but do not migrate existing constructors.

### 4. Ionic — IonicModule

This project imports the monolithic `IonicModule` from `@ionic/angular` in feature modules. Do **not** convert pages to standalone or to individual `Ion*` imports unless that work is explicitly requested.

### 5. Template Control Flow — built-in `@if` / `@for` / `@switch`

The codebase has been migrated to Angular's built-in control flow (`@if`, `@for` with `track`, `@switch`). Prefer it in new templates. Some legacy templates may still use `*ngIf` / `*ngFor` / `*ngSwitch`; that's fine — convert opportunistically when you're already editing the template, but don't mix both styles within a single file.

### 6. State Management — classic NgRx

Global state uses `@ngrx/store`, `@ngrx/effects`, and `@ngrx/entity`. State lives in `src/app/state/`:

```
state/
├── app.state.ts            # AppState root interface
├── account.state.ts
├── listing.state.ts
├── actions/
├── effects/                # AccountEffects, AuthEffects, ...
├── reducers/
└── selectors/
```

State is persisted to `localStorage` via `localStorageSync` (see `app.module.ts`). When adding a new slice:

1. Define the slice state interface (`*.state.ts`).
2. Create `actions/`, `reducers/`, `selectors/`, `effects/` files following the existing naming.
3. Register the reducer in `state/reducers/index.ts` and the effect array in `app.module.ts`.
4. Add the slice key to the `localStorageSync` config if it should persist.

Effects own async work (Firestore reads/writes via `FirestoreService`) and dispatch follow-up actions; components stay presentation-focused.

### 7. Routing

Top-level routes live in `src/app/app-routing.module.ts`. Each feature module ships its own `*-routing.module.ts` (e.g. `account-routing.module.ts`, `time-tracking-routing.module.ts`) and is loaded via `loadChildren`:

```typescript
{
  path: "account",
  loadChildren: () =>
    import("./modules/account/account.module").then((m) => m.AccountModule),
}
```

### 8. Firebase access

- Use `FirestoreService` (in `src/app/core/services/`) as the primary boundary for Firestore reads/writes. It wraps AngularFire compat APIs.
- The project keeps `AngularFireModule`, `AngularFirestoreModule`, and `AngularFireStorageModule` from `@angular/fire/compat` (v20) registered in `AppModule`. The modular `firebase` SDK (v12) is also installed and used for things like `initializeApp` and `getStorage` in `app.module.ts`.
- `ImageUploadService` resolves `getStorage()` lazily (via a private getter) to avoid a "No Firebase App" race during unit-test injection. Follow the same pattern for any new modular-SDK service.
- `BrandingService` (in `src/app/core/services/branding.service.ts`) reads Firebase **Remote Config** at startup, applies brand tokens to `<html>`, and supports a per-device localStorage override. The Remote Config template lives in `remoteconfig.template.json`. `firebase deploy --only remoteconfig` is **not** used — operators publish through the Firebase console UI (or use the `/admin/branding` page to generate JSON). See [docs/BRANDING.md](../docs/BRANDING.md).
- Do not remove or replace AngularFire compat without an explicit migration request.

### 9. Service Organization

- `src/app/core/services/` — cross-cutting singletons (auth, firestore, image upload, error/success handling, auth sync).
- `src/app/modules/<feature>/services/` — feature-scoped services used by that module's pages and effects.

All services use `@Injectable({ providedIn: 'root' })` unless intentionally module-scoped.

### 10. Shared Domain Models

Domain interfaces shared between the Angular app and Cloud Functions live in **`shared/models/`** at the repo root, e.g.:

| Model                          | File                                       |
| ------------------------------ | ------------------------------------------ |
| `Account`                      | `shared/models/account.model.ts`           |
| `AuthUser`                     | `shared/models/auth-user.model.ts`         |
| `BaseDocument`                 | `shared/models/base-document.ts`           |
| `Listing`                      | `shared/models/listing.model.ts`           |
| `RelatedListing`               | `shared/models/related-listing.model.ts`   |
| `ListingRelatedAccount`        | `shared/models/listing-related-account.model.ts` |
| `Project`                      | `shared/models/project.model.ts`           |
| `GroupRole`                    | `shared/models/group-role.model.ts`        |
| `TimeEntry`                    | `shared/models/time-entry.model.ts`        |
| `Feedback`                     | `shared/models/feedback.model.ts`          |
| `StandardProjectTemplate`      | `shared/models/standard-project-template.model.ts` |
| `StandardRoleTemplate`         | `shared/models/standard-role-template.model.ts`   |
| `RoleMigration`                | `shared/models/role-migration.model.ts`    |

When a model is needed by both the frontend and functions, place it here and import from both sides.

### 11. RxJS

`rxjs ~7.8` is used heavily. Compose with pipeable operators, prefer `Observable` over Promises in services that already return observables, and follow the existing patterns in `core/services/` and `state/effects/`.

### 12. Template Conventions

- **Translate pipe**: `{{ 'KEY' | translate }}` for i18n strings.
- **Ionic lifecycle hooks**: Use `ViewWillEnter` / `ViewDidEnter` / `ViewWillLeave` for page-level init/teardown (Ionic caches views).
- **Async data**: prefer the `async` pipe over manual subscriptions in templates.

## File & Naming Conventions

| Item               | Convention                                      | Example                                  |
| ------------------ | ----------------------------------------------- | ---------------------------------------- |
| Feature module     | `kebab-case.module.ts`                          | `time-tracking.module.ts`                |
| Routing module     | `kebab-case-routing.module.ts`                  | `account-routing.module.ts`              |
| Pages              | `kebab-case.page.ts` under `pages/<page>/`      | `listing-form.page.ts`                   |
| Components         | `kebab-case.component.ts`                       | `menu.component.ts`                      |
| Services           | `kebab-case.service.ts`                         | `firestore.service.ts`                   |
| Guards             | `kebab-case.guard.ts`                           | `auth.guard.ts`                          |
| Models (shared)    | `kebab-case.model.ts` in `shared/models/`       | `account.model.ts`                       |
| State slice        | `<slice>.state.ts` in `src/app/state/`          | `account.state.ts`                       |
| State files        | `<slice>.actions.ts`, `.reducer.ts`, etc.       | under `actions/`, `reducers/`, ...       |
| Test files         | `*.spec.ts` co-located with source              | `auth.service.spec.ts`                   |
| i18n files         | `{locale}.json` under `src/assets/i18n/`        | `en.json`                                |

## Project Structure

```
src/app/
├── app.component.ts            # Root component
├── app.module.ts               # Root NgModule (Store, Effects, AngularFire, Translate, ...)
├── app-routing.module.ts       # Top-level routes (lazy modules)
├── core/                       # Singletons: services, guards, constants, data, utils
│   ├── services/
│   ├── guards/
│   ├── constants/
│   ├── data/
│   └── utils/
├── modules/                    # Feature NgModules (lazy-loaded)
│   ├── account/                # User & organization accounts, related accounts, related listings
│   ├── auth/                   # Login, signup, landing
│   ├── info/                   # Informational / static pages
│   ├── listing/                # Listing CRUD, related accounts on listings
│   ├── messaging/              # Messaging UI and services
│   └── time-tracking/          # Projects, time entries, analytics
├── shared/                     # SharedModule with reusable components/pipes
├── state/                      # NgRx: actions, reducers, effects, selectors
└── testing/                    # Test helpers/utilities

shared/models/                  # Domain models shared with Cloud Functions

functions/src/                  # Firebase Cloud Functions (TypeScript)
├── index.ts                    # Aggregates and re-exports triggers / HTTPS handlers
├── api/                        # Domain HTTPS endpoints
│   ├── accounts/
│   ├── listings/
│   ├── notifications/
│   ├── projects/
│   ├── relationships/
│   └── timeTracking/
├── auth/                       # Auth triggers
├── database/                   # Firestore triggers
├── functions/                  # Misc function entry points
├── monitoring/                 # Logging / monitoring helpers
├── scripts/                    # Maintenance scripts
├── services/                   # Server-side service logic
├── storage/                    # Storage triggers
├── tests/                      # Mocha test specs
└── utils/                      # Shared helpers
```

## Cloud Functions Architecture

The backend uses **Firebase Functions v2** with TypeScript (Node.js 22 runtime, see `firebase.json` and `functions/package.json` engines). Functions deps: `firebase-functions` 7.x, `firebase-admin` 13.x.

Key conventions:

- Triggers and HTTPS endpoints are grouped by domain under `functions/src/api/`, `auth/`, `database/`, `storage/`. The barrel `functions/src/index.ts` re-exports the deployable functions.
- `firebase-admin` is initialized in a shared bootstrap utility; new code should reuse it rather than calling `initializeApp` again.
- Use `firebase-functions/v2` (`onCall`, `onRequest`, `onDocumentWritten`, etc.) for new triggers, matching the patterns already in `api/`.
- HTTP responses follow the existing handler patterns; do not introduce a new framework (e.g. Express) unless asked.

## Environment Configuration

- **Client-side** environment files are generated by `generate-env.js` from `.env.development` / `.env.production` into `src/environments/environment.ts`. Required keys:
  - `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID`, `FIREBASE_API_URL`, plus `GOOGLE_AUTH_WEB_CLIENT_ID`, `GOOGLE_AUTH_ANDROID_CLIENT_ID`, `GOOGLE_MAPS_API_KEY`.
- Run `npm run generate-env:dev` (or `:prod`) before `ng serve` / `ng build`. The `npm start` and `build:*` scripts already chain `generate-env:*`.
- **`src/environments/environment.ts` is currently tracked by git** and `.gitignore` only excludes `environment.production.ts`. Be careful: do not stage `environment.ts` if it contains a newly-generated secret (e.g. `GOOGLE_MAPS_API_KEY`) that's different from what's already committed. Either discard the diff (`git checkout -- src/environments/environment.ts`) or untrack the file and add it to `.gitignore` before committing.
- **Server-side secrets** belong in Firebase config or Secret Manager — never commit secrets to the repo.

## Capacitor Configuration

`capacitor.config.ts` sets:

- `appId`: `org.ascendcoopplatform.app`
- `appName`: `ASCENDynamics NFP Platform`
- `webDir`: `public`
- Google Auth plugin with web + Android client IDs.

When adding a Capacitor plugin: `npm install <plugin>@8` (match major version), then `npx cap sync`.

## Important Identifiers

| Identifier             | Value                                                  |
| ---------------------- | ------------------------------------------------------ |
| Project name           | `ascendcoopplatform`                                   |
| Homepage               | `https://ASCENDynamics.org/`                           |
| Dev hosting URL        | `https://ascendcoopplatform-dev.web.app/`              |
| Capacitor `appId`      | `org.ascendcoopplatform.app`                           |
| Functions runtime      | Node.js 22                                             |
| License                | AGPL-3.0                                               |

## When Adding New Features

### New Page in an existing feature module

1. Create the page folder under `src/app/modules/<feature>/pages/<page>/`.
2. Add the page component (matching the NgModule + IonicModule style of sibling pages).
3. Declare it in the feature's `*.module.ts` and register a route in the feature's `*-routing.module.ts`.
4. Add i18n keys to `src/assets/i18n/<locale>.json` for all user-facing strings.

### New Feature Module

1. Create `src/app/modules/<feature>/` with `<feature>.module.ts` and `<feature>-routing.module.ts`.
2. Add a `loadChildren` entry to `app-routing.module.ts`.
3. Add a state slice under `src/app/state/` if the feature needs global state.

### New Service

1. Cross-cutting singleton → `src/app/core/services/`. Feature-scoped → `src/app/modules/<feature>/services/`.
2. Use `@Injectable({ providedIn: 'root' })`.
3. Return `Observable` from public methods when wrapping Firestore/HTTP.
4. Put any types shared with Cloud Functions in `shared/models/`.

### New NgRx Slice

1. Add `<slice>.state.ts`, plus files under `state/actions/`, `state/reducers/`, `state/selectors/`, `state/effects/`.
2. Register the reducer in `state/reducers/index.ts` and the effect class in `AppModule`'s `EffectsModule.forRoot([...])` array.
3. Decide whether to persist the slice via `localStorageSync` config in `app.module.ts`.
4. Keep effects pure of UI concerns; dispatch follow-up actions for components to react to.

### New Cloud Function

1. Place the handler in the matching `functions/src/api/<domain>/` (or `auth/`, `database/`, `storage/`) folder.
2. Export it through `functions/src/index.ts` so it deploys.
3. Use `firebase-functions/v2` triggers matching the existing files.
4. Reuse the shared `firebase-admin` bootstrap; do not re-initialize.
5. Add a Mocha spec under `functions/src/tests/` (or the existing test layout) when adding non-trivial logic.

### New Capacitor Plugin

1. Install matching the v8 Capacitor major: `npm install @capacitor/<plugin>@8`.
2. `npx cap sync`.
3. Add plugin configuration in `capacitor.config.ts` if needed.
4. Wrap usage in a service under `src/app/core/services/` (or a feature module's `services/`).

## Testing

- **Frontend**: Jasmine + Karma via the `@angular/build:karma` builder. Run all tests (frontend + functions) with:

  ```bash
  npm run test
  ```

  Watch mode:

  ```bash
  npm run test:watch
  ```

  `@angular/cli` should be installed globally and a headless Chrome binary must be available so Karma can launch the browser. Karma is configured with extended timeouts (`browserNoActivityTimeout: 300000`, `browserDisconnectTimeout: 60000`) because esbuild-based test compilation can be slow on first run.

- **`enableProdMode()` is active in `src/test.ts`** — this silences NG0100 (`ExpressionChangedAfterItHasBeenCheckedError`) noise so real assertion failures are visible. The trade-off: change detection no longer runs a second verification pass in tests, which has two consequences:
  - For `@Input` updates: use `fixture.componentRef.setInput("name", value)` instead of `component.name = value`. Plain field assignment will not propagate to the template.
  - For internal state mutations (component fields that aren't inputs): call `fixture.componentRef.changeDetectorRef.markForCheck()` before `fixture.detectChanges()`.
  - Examples of this pattern live in `faq-section.component.spec.ts` and `week-view.component.spec.ts`.

- **Test helpers**: `src/app/shared/testing/translate-testing.module.ts` provides a `MockTranslateService` compatible with ngx-translate v17 (note the v17 rename: `onDefaultLangChange` → `onFallbackLangChange`).

- **Cloud Functions**: Mocha (run as part of `npm run test` via `npm --prefix functions test`). The functions test command builds with `tsconfig.test.json` and runs against the Firestore emulator (`firebase emulators:exec`).

- **E2E**: Not currently configured.

## Build & Deploy Commands

```bash
# Generate environment.ts from .env files
npm run generate-env:dev
npm run generate-env:prod

# Development
npm start                                        # ng serve (uses dev env)
ionic serve                                      # Ionic dev server

# Production build (writes to public/ — Firebase Hosting "public" dir)
npm run build:prod                               # generate-env:prod + ng build --configuration production

# Deploy web
firebase deploy --only hosting

# Deploy Cloud Functions
cd functions && npm run build && cd ..
firebase deploy --only functions

# Native — iOS
npm run build:prod && npx cap copy ios && npx cap open ios

# Native — Android
npm run build:prod && npx cap copy android
cd android && ./gradlew assembleDebug && cd ..

# Sync native plugins after install
npx cap sync

# Lint / format
npm run lint
npm run format
```

> Hosting note: `firebase.json` serves the `public/` folder. The Angular `outputPath` should produce assets there (or be copied) before deploying.

## Style Guide

- **License header**: Every TS/JS source file starts with the AGPL-3.0 header block (see `src/app/app.module.ts` or `capacitor.config.ts`). Copy it into new files.
- **Prettier** is configured in `package.json`: `semi: true`, `trailingComma: "all"`, `singleQuote: false`, `bracketSpacing: false`, `printWidth: 80`, `tabWidth: 2`. Run `npm run format`.
- **ESLint**: Run `npm run lint`. Pre-commit `lint-staged` (via Husky) runs Prettier on staged files.
- **SCSS**: Global theme in `src/theme/` and `src/styles/`. Component SCSS is co-located.
- **Colors**: Prefer Ionic CSS custom properties (`--ion-color-primary`, etc.).
- **Responsive**: Ionic grid (`ion-grid`, `ion-row`, `ion-col`) plus CSS media queries. Dark mode via Ionic's `prefers-color-scheme` integration.

## Styling & Design System

The app uses a token-driven design system so that every page picks up consistent surfaces, spacing, radius, shadows, and dark/light theming "for free". **Prefer the tokens and global classes over per-component SCSS.** The live reference page is `src/app/modules/info/pages/theme-showcase/` — run the app and open `/info/theme-showcase` to see every primitive rendered in both themes.

### Design tokens — `src/theme/variables.scss`

Custom properties are prefixed `--app-*` to avoid colliding with Ionic's `--ion-*` namespace. Light defaults live in `:root`. Dark overrides are duplicated in two places intentionally:

- `.dark { ... }` — applied via the manual `<body class="dark">` toggle.
- `@media (prefers-color-scheme: dark) :root { ... }` — applied when the OS is in dark mode without the toggle.

Token groups:

| Group       | Tokens                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| Surfaces    | `--app-surface`, `--app-surface-elevated`, `--app-surface-sunken`, `--app-surface-rgb` |
| Borders     | `--app-border-color`, `--app-border-color-strong`, `--app-divider-color` |
| Shadows     | `--app-shadow-sm`, `--app-shadow-md`, `--app-shadow-lg`                |
| Radii       | `--app-radius-sm` (6px), `--app-radius-md` (12px), `--app-radius-lg` (16px), `--app-radius-pill` |
| Spacing     | `--app-spacing-xs` (4), `--app-spacing-sm` (8), `--app-spacing-md` (16), `--app-spacing-lg` (24), `--app-spacing-xl` (32) |
| Text/Motion | `--app-text-muted`, `--app-text-shadow-etched`, `--app-transition-base`, `--app-transition-slow` |
| Branding    | `--app-brand-primary`, `--app-brand-secondary`, `--app-brand-app-name`, `--app-brand-logo-url` — overwritten at runtime by `BrandingService` from Firebase Remote Config. See [docs/BRANDING.md](../docs/BRANDING.md). |

When you need a new token (e.g. a new surface level), **extend the token set in `variables.scss`** in all three locations (`:root`, `.dark`, and the `@media` mirror). Don't invent one-off CSS custom properties scoped to a single component.

### Global primitives — `src/global.scss`

Reusable classes consume the tokens and are available app-wide:

| Class                       | Purpose                                                 |
| --------------------------- | ------------------------------------------------------- |
| `.app-section`              | Page section wrapper (padding + bottom margin)          |
| `.app-section-header`       | Flex row with leading icon + `<h2>`, primary underline  |
| `.button-group`             | Flex-wrap row of buttons                                |
| `.chip-group`               | Flex-wrap row of chips                                  |
| `.badge-group`              | Flex-wrap row of badges                                 |
| `.spinner-group` / `.spinner-item` | Spinner grid + labeled cell                      |
| `.color-swatch` + `.swatch-{primary\|secondary\|tertiary\|success\|warning\|danger\|medium\|dark\|light}` | Color palette tile using `--ion-color-*-contrast` tokens |
| `.app-native-form`          | Wrapper for plain HTML form elements (`<input>`, `<select>`, `<textarea>`, `<fieldset>`) — tokens-driven, theme-aware |
| `.app-field-row`            | Flex row for side-by-side fields inside `.app-native-form` |
| `.app-native-button`        | Token-styled `<button>` variant (use with `type="button"`) |
| `.text-muted`               | Small muted helper paragraph                            |

Global element styling also lives in `global.scss`: `ion-card` gets `border-radius: var(--app-radius-md)`, `box-shadow: var(--app-shadow-md)`, a token-driven border, and a hover lift on `ion-card[button]`. `ion-item` uses `--app-divider-color`. New pages should rely on these defaults instead of redeclaring card/item styling locally.

### Rules for new pages

- Build layouts from `.app-section` + `.app-section-header` + `<ion-card>`.
- Use `--app-spacing-*` instead of hard-coded pixel margins/paddings.
- Use `--app-radius-*` and `--app-shadow-*` instead of arbitrary literals.
- Use `--app-text-muted` instead of `var(--ion-color-medium)` for secondary text.
- Component SCSS files should stay minimal — layout-only adjustments that can't be expressed via globals or tokens. The showcase page's `.scss` is intentionally empty as the model to follow.
- When the toggle/OS sets dark mode, the tokens flip automatically — do not write manual dark overrides unless the global token system genuinely doesn't cover the case. If you must, use `html.dark .my-class { ... }` (Ionic 8 puts `md`/`ios`/`dark` classes on `<html>`, not `<body>`). Never use `:root.dark` or `body.dark` as the sole selector.

## Common Pitfalls

1. **Don't introduce standalone components, Signal Store, or replace IonicModule** as a side-effect — these are large cross-cutting changes for this codebase. Match the surrounding style. Components currently carry explicit `standalone: false` because Angular 19+ flipped the default; keep that flag when adding components to an existing feature module.
2. **Don't remove AngularFire compat** unless explicitly migrating; both the modular SDK and compat layer are intentionally present.
3. **Don't forget to register** new reducers (`state/reducers/index.ts`) and effects (`AppModule`'s `EffectsModule.forRoot`).
4. **Don't forget the AGPL header** on new source files.
5. **Don't commit `.env*` files** or newly-generated `src/environments/environment.ts` secrets. The file is tracked today, but regenerating it via `generate-env:dev` can introduce real keys (e.g. `GOOGLE_MAPS_API_KEY`) that weren't in the prior committed copy.
6. **Don't bypass `FirestoreService`** for one-off Firestore calls in feature code — go through the service so behavior stays consistent.
7. **Don't re-initialize `firebase-admin`** in Cloud Functions — reuse the existing bootstrap.
8. **Don't add a new framework (Express, NestJS, etc.) to functions** without asking.
9. **Don't bump Angular / NgRx / Ionic / Capacitor majors silently** — these are coordinated upgrades.
10. **Don't change Prettier or ESLint config** to make a file pass — fix the file.
11. **In tests, don't mutate inputs or state and call `detectChanges()` alone** — with `enableProdMode()` active you must use `componentRef.setInput()` or `markForCheck()` first (see Testing section).
12. **Don't hard-code spacing, radius, or shadow values** in component SCSS — use the `--app-*` tokens from `src/theme/variables.scss`. If a value isn't covered, extend the token set rather than inventing a one-off. See the **Styling & Design System** section.

## Future Direction / Migration Targets

The codebase still uses several older Angular patterns (NgModules, `IonicModule`, classic NgRx, AngularFire compat, constructor injection). The long-term goal is to modernize toward current Angular best practices. **Do not perform these migrations as side effects** of unrelated work, but **do** prefer the modern pattern when creating brand-new files in isolation, and **do** flag opportunistic migration candidates to the user when touching adjacent code.

Remaining target end state, in rough order of priority:

1. **Standalone components everywhere** — drop NgModules. New components/pages/pipes/directives should be authored as `standalone: true` when they don't need to be declared in an existing feature module. Long-term, migrate each feature module by converting pages to standalone and replacing the `*.module.ts` with route arrays exported from `*.routes.ts`. Today, components carry explicit `standalone: false` because they belong to feature modules.
2. **Individual Ionic standalone imports** — replace `IonicModule` with explicit `Ion*` component imports (`IonHeader`, `IonContent`, `IonButton`, etc.). Smaller bundles, tree-shakable, Ionic 7+ official guidance.
3. **Angular Signals + Signal Store** — for new local component state, use `signal()` / `computed()` / `effect()` instead of `BehaviorSubject` or class fields. For new global state slices, prefer `@ngrx/signals` (`signalStore`, `withState`, `withComputed`, `withMethods`, `withHooks`) over classic Store/Effects/Entity. Existing classic NgRx slices stay as-is until coordinated migration.
4. **`inject()` function** — in new functional contexts (route guards, resolvers, interceptors, factory functions) use `inject()`. New service classes may also use `inject()` field initializers in place of constructor params when stylistically consistent.
5. **Firebase modular SDK only** — phase out `@angular/fire/compat` (`AngularFireModule`, `AngularFirestoreModule`, `AngularFireStorageModule`). New Firestore/Storage/Auth code should use the modular SDK directly (`getFirestore`, `collection`, `doc`, `getDoc`, `onSnapshot`, `getAuth`, `onAuthStateChanged`, `getStorage`, `ref`, `uploadBytes`, etc.). The `rxfire` package (already a dep) bridges modular Firestore queries to RxJS observables and is the preferred adapter when an `Observable` is needed.
6. **Lazy `loadComponent` routes** — when converting a feature to standalone, replace `loadChildren: () => import('...module').then(m => m.FeatureModule)` with either `loadComponent` (single page) or `loadChildren: () => import('...routes').then(m => m.FEATURE_ROUTES)` (route group).
7. **Functional guards/interceptors/resolvers** — prefer `CanActivateFn`, `HttpInterceptorFn`, `ResolveFn` over class-based equivalents.
8. **Cloud Functions modernization (ongoing)** — new functions should use `firebase-functions/v2` (`onCall`, `onRequest`, `onDocumentWritten`, `onSchedule`) and `defineSecret()` from Secret Manager for credentials.
9. **Vitest for functions tests** is a possible future swap from Mocha, but only if there's a clear win — Mocha + emulator is fine.

**Recently completed** (no longer migration targets, do not regress):

- Built-in template control flow (`@if` / `@for` / `@switch`) — bulk of templates migrated.
- Capacitor 8 upgrade with all `@capacitor/*` plugins on majors.
- Cloud Functions on Node 22 runtime, `firebase-admin` 13, `firebase-functions` 7, ESLint 9 + `@typescript-eslint` 8.
- Angular 21, NgRx 21, Ionic 8.8, Firebase 12, ngx-translate 17, TypeScript ~6.0.

### Rules for agents working on migrations

- When creating an **entirely new** feature in isolation, default to the target state above (standalone + signals + modular SDK + `inject()` + `@if`/`@for`).
- When **editing existing** code, match the surrounding style unless the user explicitly asks for migration. Mixing styles file-by-file is acceptable; mixing styles *within a single file* is not.
- When you spot a high-value, low-risk migration candidate adjacent to your work (e.g. a single page that could go standalone, a guard that could go functional), **mention it** at the end of your response so the user can decide — don't silently expand the diff.
- Coordinated migrations (e.g. "convert all of `account/` to standalone") must be their own task with the user's explicit go-ahead.

## Agent Behavior

1. **Correct misconceptions directly** — if the user states something factually incorrect about the codebase, a technology, or a concept, say so clearly before proceeding.
2. **Never claim tests pass when output shows failure** — report the actual test result verbatim; do not summarize failures as passing.
3. **Verify work before claiming done** — run builds, tests, or type-checks as appropriate to confirm changes work; only say "done" after verification succeeds.
4. **Match existing patterns** before introducing new ones. If a refactor is warranted, propose it explicitly instead of slipping it into an unrelated change. See **Future Direction / Migration Targets** above for the project's intended end state.
