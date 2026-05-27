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
// generate-env.js

const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Determine the environment
const env = process.env.NODE_ENV || "development";

// Load environment variables from the appropriate .env file (only in local development)
if (process.env.CI !== "true") {
  const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
  dotenv.config({path: envFilePath});
}

// Verify that required environment variables are set
const requiredEnvVars = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_DATABASE_URL",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_MEASUREMENT_ID",
  "FIREBASE_API_URL",
  "GOOGLE_AUTH_WEB_CLIENT_ID",
  "GOOGLE_AUTH_ANDROID_CLIENT_ID",
  "APP_BASE_URL",
  "APP_NAME",
  "APP_DESCRIPTION",
  "SUPPORT_EMAIL",
  "PRIVACY_EMAIL",
  "ORG_MAILING_ADDRESS",
  "ORG_JURISDICTION",
  "LEGAL_EFFECTIVE_DATE",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`Warning: ${varName} is not set.`);
  }
});

// Set the target path based on the environment
const targetPath =
  env === "production"
    ? "./src/environments/environment.prod.ts"
    : "./src/environments/environment.ts";

// Escape values destined for single-quoted TS string literals.
function tsEscape(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

// Generate the environment configuration file content
const envConfigFile = `
export const environment = {
  production: ${env === "production"},
  firebaseConfig: {
    apiKey: '${tsEscape(process.env.FIREBASE_API_KEY)}',
    authDomain: '${tsEscape(process.env.FIREBASE_AUTH_DOMAIN)}',
    databaseURL: '${tsEscape(process.env.FIREBASE_DATABASE_URL)}',
    projectId: '${tsEscape(process.env.FIREBASE_PROJECT_ID)}',
    storageBucket: '${tsEscape(process.env.FIREBASE_STORAGE_BUCKET)}',
    messagingSenderId: '${tsEscape(process.env.FIREBASE_MESSAGING_SENDER_ID)}',
    appId: '${tsEscape(process.env.FIREBASE_APP_ID)}',
    measurementId: '${tsEscape(process.env.FIREBASE_MEASUREMENT_ID)}',
    apiUrl: '${tsEscape(process.env.FIREBASE_API_URL)}',
  },
  googleAuth: {
    webClientId: '${tsEscape(process.env.GOOGLE_AUTH_WEB_CLIENT_ID)}',
    androidClientId: '${tsEscape(process.env.GOOGLE_AUTH_ANDROID_CLIENT_ID)}',
  },
  googleMapsApiKey: '${tsEscape(process.env.GOOGLE_MAPS_API_KEY)}',
  appBaseUrl: '${tsEscape(process.env.APP_BASE_URL)}',
  appName: '${tsEscape(process.env.APP_NAME)}',
  appDescription: '${tsEscape(process.env.APP_DESCRIPTION)}',
  supportEmail: '${tsEscape(process.env.SUPPORT_EMAIL)}',
  privacyEmail: '${tsEscape(process.env.PRIVACY_EMAIL)}',
  org: {
    mailingAddress: '${tsEscape(process.env.ORG_MAILING_ADDRESS)}',
    phone: '${tsEscape(process.env.ORG_PHONE)}',
    communityUrl: '${tsEscape(process.env.ORG_COMMUNITY_URL)}',
    jurisdiction: '${tsEscape(process.env.ORG_JURISDICTION)}',
    legalEffectiveDate: '${tsEscape(process.env.LEGAL_EFFECTIVE_DATE)}',
  },
};
`;

// Write the configuration to the appropriate environment file
fs.writeFileSync(targetPath, envConfigFile);

console.log(`Environment file generated at ${targetPath}`);

// ---------------------------------------------------------------------------
// Template substitution for static, non-Angular-bundled source files.
//
// src/index.html and src/funding.json contain hostable, fork-specific text
// (page title, meta description, canonical URL, funding contact) that needs
// to land in the built output as plain HTML/JSON for SEO crawlers and the
// FUNDING.json spec.
//
// We commit *.template siblings containing __TOKEN__ placeholders and write
// the substituted result to the un-suffixed path on every build. The output
// files (src/index.html, src/funding.json) are gitignored so switching
// between dev/prod envs never produces a diff.
// ---------------------------------------------------------------------------
const templatePairs = [
  ["./src/index.html.template", "./src/index.html"],
  ["./src/funding.json.template", "./src/funding.json"],
];

// HTML-encode values when they're being injected into an HTML attribute value.
// JSON contexts use the JSON-safe escaped form.
function htmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function jsonEscape(value) {
  return JSON.stringify(String(value || "")).slice(1, -1);
}

const tokenValues = {
  APP_NAME: process.env.APP_NAME || "",
  APP_DESCRIPTION: process.env.APP_DESCRIPTION || "",
  APP_BASE_URL: process.env.APP_BASE_URL || "",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "",
  PRIVACY_EMAIL: process.env.PRIVACY_EMAIL || "",
  GOOGLE_AUTH_WEB_CLIENT_ID: process.env.GOOGLE_AUTH_WEB_CLIENT_ID || "",
};

for (const [templatePath, outputPath] of templatePairs) {
  if (!fs.existsSync(templatePath)) {
    console.warn(`Warning: template ${templatePath} not found; skipping.`);
    continue;
  }
  const template = fs.readFileSync(templatePath, "utf8");
  const isJson = outputPath.endsWith(".json");
  const rendered = template.replace(/__([A-Z_]+)__/g, (match, key) => {
    if (!(key in tokenValues)) return match;
    return isJson ? jsonEscape(tokenValues[key]) : htmlEscape(tokenValues[key]);
  });
  fs.writeFileSync(outputPath, rendered);
  console.log(`Rendered ${templatePath} -> ${outputPath}`);
}
