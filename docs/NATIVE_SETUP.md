# Native Setup Guide — Google Maps & SSO (Android / iOS)

This document explains how to configure Google Maps, Google Sign-In, and Apple Sign-In for
native (Android / iOS) builds of the ASCENDynamics NFP Collaborative Platform. It is written
for operators deploying the production app **and** fork maintainers running their own instance.

---

## Table of Contents

1. [How configuration flows](#how-configuration-flows)
2. [Google Maps API Key](#google-maps-api-key)
3. [Google Sign-In — Android](#google-sign-in--android)
4. [Google Sign-In — iOS](#google-sign-in--ios)
5. [Apple Sign-In — iOS](#apple-sign-in--ios)
6. [Fork maintainer checklist](#fork-maintainer-checklist)

---

## How configuration flows

```
.env.development  ─┐
.env.production   ─┤── node generate-env.js ──► src/environments/environment.ts (gitignored)
                   │                                     │
                   │                                     └── imported by Angular at runtime
                   │
capacitor.config.ts  ◄── manually set for native plugin bootstrap
                         (loaded before Angular; cannot read from environment.ts)
```

Keys used **only** in the Angular app (Google Maps, Google Auth web client ID) flow through
`.env.*` → `generate-env.js` → `environment.ts`.

Keys required by the **Capacitor plugin at plugin-init time** (`iosClientId`,
`androidClientId`) must be set directly in `capacitor.config.ts`.

> **Tip**: Keep the same value in both places for any key that appears in both
> (e.g. `androidClientId`). Running `npm run generate-env:dev` will catch
> any missing env variable with an empty string warning.

---

## Google Maps API Key

### 1. Create the key

1. Open [Google Cloud Console](https://console.cloud.google.com) → your project.
2. Navigate to **APIs & Services → Credentials → + Create Credentials → API key**.
3. Copy the generated key.

### 2. Restrict the key (strongly recommended for public repos)

On the **Edit API key** screen:

| Platform | Restriction type   | Value                                                                                           |
| -------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| Web      | **HTTP referrers** | Add your hosting domain(s), e.g. `https://yourapp.web.app/*` and `http://localhost:*`           |
| Android  | **Android apps**   | Add package name + SHA-1 fingerprint (see [Google Sign-In — Android](#google-sign-in--android)) |
| iOS      | **iOS apps**       | Add your bundle ID, e.g. `org.ascendynamics.coopplatform`                                       |

Under **API restrictions**, select **Restrict key** and choose:

- Maps JavaScript API
- Maps SDK for Android
- Maps SDK for iOS

### 3. Set the key in your environment

Add to `.env.development` (for dev) or `.env.production` (for prod, gitignored):

```env
GOOGLE_MAPS_API_KEY=AIzaSy...your-key-here...
```

`generate-env.js` injects this into `environment.ts` as `googleMapsApiKey`.

### 4. How the app uses the key

Both map pages (`listings.page.ts` and `directory.page.ts`) read
`environment.googleMapsApiKey` and dynamically load the Maps JavaScript API script.
If the key equals the placeholder `"YOUR_GOOGLE_MAPS_API_KEY"` or is empty, the map
shows a "not configured" state instead of crashing.

### Dev vs prod key policy

- `.env.development` **is tracked in git** — it contains the shared dev Firebase project
  config. The dev Maps key should be restricted to `http://localhost:*` and the dev
  hosting domain only.
- `.env.production` **is gitignored** — never commit it. CI/CD injects it at build time.

---

## Google Sign-In — Android

### Prerequisites

- `google-services.json` placed at `android/app/google-services.json`
  (download from Firebase Console → Project Settings → Your apps → Android app).
- SHA-1 fingerprint of your signing keystore registered in both Firebase and GCP.

### Get your SHA-1 fingerprint

**Debug keystore** (for local dev):

```bash
keytool -list -v -keystore ~/.android/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android
```

**Release keystore**:

```bash
keytool -list -v -keystore /path/to/your.keystore \
  -alias your-alias -storepass yourpass
```

Copy the `SHA1:` value.

### Create the Android OAuth 2.0 client in GCP

1. GCP Console → **APIs & Services → Credentials → + Create Credentials → OAuth client ID**.
2. Application type: **Android**.
3. Package name: `org.ascendynamics.coopplatform` (or your fork's package name).
4. SHA-1 certificate fingerprint: paste the value from above.
5. Click **Create**. The resulting client ID ends in `.apps.googleusercontent.com`.

### Set the values

**`.env.development`** (and `.env.production`):

```env
GOOGLE_AUTH_ANDROID_CLIENT_ID=XXXXXXXXXX-xxxxxxxxxxxx.apps.googleusercontent.com
```

**`capacitor.config.ts`** — the `androidClientId` field:

```typescript
androidClientId: "XXXXXXXXXX-xxxxxxxxxxxx.apps.googleusercontent.com",
```

> The debug and production Android client IDs are different (different SHA-1s).
> The commented-out debug line in `capacitor.config.ts` shows the debug client ID.
> Switch to it when running `ionic capacitor run android` without a signed APK.

---

## Google Sign-In — iOS

### Prerequisites

- Xcode installed with the iOS target added: `npx cap add ios` (if not already present).
- An Apple Developer account and the app registered under the bundle ID
  `org.ascendynamics.coopplatform`.

### Create the iOS OAuth 2.0 client in GCP

1. GCP Console → **APIs & Services → Credentials → + Create Credentials → OAuth client ID**.
2. Application type: **iOS**.
3. Bundle ID: `org.ascendynamics.coopplatform` (or your fork's bundle ID from `capacitor.config.ts`).
4. Click **Create**. The resulting client ID ends in `.apps.googleusercontent.com`.

### Download and place GoogleService-Info.plist

1. In GCP Console → Credentials, find your iOS client ID → **Download (⬇)**.
   **Or** use Firebase Console → Project Settings → Your apps → iOS app → Download
   `GoogleService-Info.plist` (it contains the same client ID plus other Firebase settings).
2. Place the file at `ios/App/App/GoogleService-Info.plist`.
3. In Xcode, right-click `App/App` → **Add Files to "App"** → select the plist file
   (ensure **Copy items if needed** is checked).

### Extract the CLIENT_ID

Open `GoogleService-Info.plist` in a text editor and find:

```xml
<key>CLIENT_ID</key>
<string>XXXXXXXXXX-xxxxxxxxxxxx.apps.googleusercontent.com</string>
```

### Set the values

**`.env.development`** (and `.env.production`):

```env
GOOGLE_AUTH_IOS_CLIENT_ID=XXXXXXXXXX-xxxxxxxxxxxx.apps.googleusercontent.com
```

**`capacitor.config.ts`** — the `iosClientId` field:

```typescript
iosClientId: "XXXXXXXXXX-xxxxxxxxxxxx.apps.googleusercontent.com",
```

### Add the URL scheme in Xcode

The `@southdevs/capacitor-google-auth` plugin requires a URL scheme so Google can redirect
back to your app after sign-in.

1. In Xcode, select the **App** target → **Info** tab → **URL Types**.
2. Click **+** and set:
   - **Identifier**: `com.googleusercontent.apps` (or any descriptive name)
   - **URL Schemes**: the **reversed** client ID, e.g.
     `com.googleusercontent.apps.XXXXXXXXXX-xxxxxxxxxxxx`
     (take the `CLIENT_ID` and reverse the domain segments).

After these changes run:

```bash
npx cap sync ios
```

---

## Apple Sign-In — iOS

Apple Sign-In is handled by `@capacitor-community/apple-sign-in` on iOS and falls back to
a Firebase popup on web.

### Apple Developer portal setup

1. [Apple Developer](https://developer.apple.com) → **Certificates, Identifiers & Profiles
   → Identifiers**.
2. Select (or create) the App ID for `org.ascendynamics.coopplatform`.
3. Under **Capabilities**, enable **Sign In with Apple** → Save.

### Firebase console setup

1. Firebase Console → **Authentication → Sign-in method → Apple**.
2. Enable it. No Service ID is required for native iOS (only for web/Android flows).
3. For the web fallback (popup) to work, add your Firebase OAuth redirect domain
   (`yourproject.firebaseapp.com`) in Apple Developer → **Services → Sign In with Apple
   → Configure**.

### Xcode capability

1. Open `ios/App/App.xcworkspace` in Xcode.
2. Select the **App** target → **Signing & Capabilities**.
3. Click **+ Capability** → search for **Sign In with Apple** → double-click to add.

### How the nonce works (for reviewers)

`performAppleSignIn()` in `auth.effects.ts` generates a cryptographically random `rawNonce`,
hashes it with SHA-256, and sends only the **hash** to Apple (`nonce: hashedNonce`). The
**raw** nonce is then passed to Firebase (`rawNonce`). Firebase re-hashes and compares to
verify the token was not replayed. This is the recommended pattern per Apple and Firebase
documentation.

---

## Fork maintainer checklist

When deploying your own instance:

- [ ] Create a new Firebase project (or use an existing one).
- [ ] Register Android app in Firebase → download `google-services.json` → place at
      `android/app/google-services.json`.
- [ ] Register iOS app in Firebase → download `GoogleService-Info.plist` → place at
      `ios/App/App/GoogleService-Info.plist`.
- [ ] Create a Google Maps API key in GCP Console → restrict it to your domains/bundle IDs.
- [ ] Create an OAuth 2.0 **Web** client → copy client ID to `GOOGLE_AUTH_WEB_CLIENT_ID`.
- [ ] Create an OAuth 2.0 **Android** client (with your SHA-1) →
      copy to `GOOGLE_AUTH_ANDROID_CLIENT_ID` in `.env.*` and `androidClientId` in
      `capacitor.config.ts`.
- [ ] Create an OAuth 2.0 **iOS** client (with your bundle ID) →
      copy to `GOOGLE_AUTH_IOS_CLIENT_ID` in `.env.*` and `iosClientId` in
      `capacitor.config.ts`.
- [ ] Add the reversed iOS client ID as a URL scheme in Xcode (Info tab → URL Types).
- [ ] Enable Apple Sign-In in Apple Developer portal and Firebase console.
- [ ] Add Xcode **Sign In with Apple** capability.
- [ ] Never commit `.env.production` or `src/environments/environment.ts`.
- [ ] Run `npm run generate-env:dev` (or `:prod`) before every build.
