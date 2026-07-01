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

// ---------------------------------------------------------------------------
// Reference / shape for src/environments/environment.ts and environment.prod.ts.
//
// Those two files are gitignored and regenerated from .env.development /
// .env.production by `node generate-env.js` (or any `npm run generate-env:*`
// / `npm start` / `npm run build:*` script — they chain it automatically).
//
// This file is here so fork maintainers and tooling can see the expected
// shape without exposing secrets. Do NOT import from this file at runtime.
// ---------------------------------------------------------------------------
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000",
    measurementId: "G-XXXXXXXXXX",
    apiUrl: "https://us-central1-your-project.cloudfunctions.net",
  },
  googleAuth: {
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
  },
  googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  appBaseUrl: "https://your-app.example.com",
  appName: "Your App Name",
  appDescription: "Short app description used in <meta> tags and FUNDING.json.",
  supportEmail: "support@example.com",
  privacyEmail: "privacy@example.com",
  org: {
    mailingAddress: "123 Example Street, City, State, Country 00000",
    phone: "",
    communityUrl: "",
    jurisdiction: "State of Example, Country",
    legalEffectiveDate: "January 1, 2025",
  },
  // Build-time brand defaults baked into the JS bundle. Empty strings mean
  // "fall back to the upstream ASCENDynamics defaults defined in
  // BrandingService.BRANDING_DEFAULTS". Set these per-fork so that the first
  // offline visit shows YOUR brand, not the upstream one. Runtime overrides
  // (Firebase Remote Config + per-device localStorage) still win at runtime.
  brand: {
    appName: "",
    tagline: "",
    logoUrl: "",
    primaryColor: "",
    secondaryColor: "",
  },
};
