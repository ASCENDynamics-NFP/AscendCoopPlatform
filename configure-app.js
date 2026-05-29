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
// configure-app.js
//
// One-shot rebrand script for forks.  Updates the native bundle ID, optionally
// the human-readable app name, and syncs the Android Google Sign-In client ID
// from your .env files into android/app/src/main/res/values/strings.xml.
//
// Usage:
//   node configure-app.js <new-bundle-id> [--name "My App"]
//   npm run set-bundle-id -- com.yourorg.yourapp
//   npm run set-bundle-id -- com.yourorg.yourapp --name "My Cooperative"
//
// The script reads the CURRENT bundle ID from capacitor.config.ts, then applies
// a global find-and-replace across every file that embeds it.  If the ID is
// already the requested value, nothing is changed.
//
// Files patched (if they contain the old bundle ID or are affected by --name):
//   capacitor.config.ts                                       (appId, appName)
//   android/app/build.gradle
//   android/app/src/main/AndroidManifest.xml
//   android/app/src/main/res/values/strings.xml               (incl. server_client_id, app_name)
//   android/app/src/main/java/<old/pkg/path>/MainActivity.java  (renamed)
//   ios/App/App.xcodeproj/project.pbxproj                      (if present)
//   src/app/state/effects/auth.effects.ts
//   src/app/modules/info/pages/landing/landing.page.html
//   src/manifest.json                                          (--name only)
//
// After running this script, execute `npx cap sync` so Capacitor propagates
// any remaining build-tool references.

"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// 1. Parse arguments
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
let newBundleId = null;
let newAppName = null;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--name" || a === "-n") {
    newAppName = argv[++i];
  } else if (a.startsWith("--name=")) {
    newAppName = a.slice("--name=".length);
  } else if (!newBundleId && !a.startsWith("-")) {
    newBundleId = a;
  }
}

if (!newBundleId) {
  console.error(
    "Error: No bundle ID provided.\n" +
      'Usage: node configure-app.js <new-bundle-id> [--name "My App"]\n' +
      "       npm run set-bundle-id -- com.yourorg.yourapp",
  );
  process.exit(1);
}

// Basic reverse-DNS validation (letters, digits, dots, hyphens; at least two segments)
if (!/^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*){1,}$/.test(newBundleId)) {
  console.error(
    `Error: "${newBundleId}" does not look like a valid bundle ID.\n` +
      "Expected reverse-DNS format, e.g. com.example.myapp",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Detect the current bundle ID from capacitor.config.ts
// ---------------------------------------------------------------------------

const capConfigPath = path.resolve("capacitor.config.ts");

if (!fs.existsSync(capConfigPath)) {
  console.error(
    "Error: capacitor.config.ts not found. Run from the project root.",
  );
  process.exit(1);
}

const capConfigContent = fs.readFileSync(capConfigPath, "utf8");
const appIdMatch = capConfigContent.match(/appId:\s*["']([^"']+)["']/);

if (!appIdMatch) {
  console.error(
    "Error: Could not detect current appId in capacitor.config.ts. " +
      'Make sure it contains: appId: "...",',
  );
  process.exit(1);
}

const oldBundleId = appIdMatch[1];
const bundleIdChanged = oldBundleId !== newBundleId;

if (!bundleIdChanged) {
  console.log(`Bundle ID is already set to "${newBundleId}".`);
} else {
  console.log(`\nUpdating bundle ID:\n  ${oldBundleId}\n  → ${newBundleId}\n`);
}

// ---------------------------------------------------------------------------
// 3. Helper: patch a single file (no-op if file absent or ID not found)
// ---------------------------------------------------------------------------

function patchFile(relPath) {
  const abs = path.resolve(relPath);
  if (!fs.existsSync(abs)) return;
  const before = fs.readFileSync(abs, "utf8");
  if (!before.includes(oldBundleId)) return;
  const after = before.split(oldBundleId).join(newBundleId);
  fs.writeFileSync(abs, after, "utf8");
  console.log(`  patched  ${relPath}`);
}

// ---------------------------------------------------------------------------
// 4. Patch text-based config files
// ---------------------------------------------------------------------------

if (bundleIdChanged) {
  patchFile("capacitor.config.ts");
  patchFile("android/app/build.gradle");
  patchFile("android/app/src/main/AndroidManifest.xml");
  patchFile("android/app/src/main/res/values/strings.xml");
  patchFile("src/app/state/effects/auth.effects.ts");
  patchFile("src/app/modules/info/pages/landing/landing.page.html");

  // iOS project file — no-op if the ios/ directory hasn't been added yet
  patchFile("ios/App/App.xcodeproj/project.pbxproj");
}

// ---------------------------------------------------------------------------
// 5. Rename the Android Java source directory and update the package declaration
// ---------------------------------------------------------------------------

if (bundleIdChanged) {
  const javaBase = path.resolve("android/app/src/main/java");
  const oldJavaDir = path.join(javaBase, ...oldBundleId.split("."));
  const newJavaDir = path.join(javaBase, ...newBundleId.split("."));
  const mainActivitySrc = path.join(oldJavaDir, "MainActivity.java");

  if (fs.existsSync(mainActivitySrc)) {
    // Update the package declaration inside the file
    const javaBefore = fs.readFileSync(mainActivitySrc, "utf8");
    const javaAfter = javaBefore.split(oldBundleId).join(newBundleId);

    // Create the new directory tree and write the patched file
    fs.mkdirSync(newJavaDir, {recursive: true});
    fs.writeFileSync(
      path.join(newJavaDir, "MainActivity.java"),
      javaAfter,
      "utf8",
    );

    // Remove the old directory subtree from the first diverging segment up
    // (avoids deleting a shared ancestor like "org/")
    const oldSegs = oldBundleId.split(".");
    const newSegs = newBundleId.split(".");
    let commonLen = 0;
    while (
      commonLen < oldSegs.length &&
      commonLen < newSegs.length &&
      oldSegs[commonLen] === newSegs[commonLen]
    ) {
      commonLen++;
    }
    const cleanupRoot = path.join(javaBase, ...oldSegs.slice(0, commonLen + 1));
    fs.rmSync(cleanupRoot, {recursive: true, force: true});

    console.log(
      `  renamed  android/app/src/main/java/[${oldBundleId}] → [${newBundleId}]`,
    );
  }
}

// ---------------------------------------------------------------------------
// 6. Optional: apply a new app display name
// ---------------------------------------------------------------------------

function replaceInFile(relPath, regex, replacement, label) {
  const abs = path.resolve(relPath);
  if (!fs.existsSync(abs)) return false;
  const before = fs.readFileSync(abs, "utf8");
  const after = before.replace(regex, replacement);
  if (after === before) return false;
  fs.writeFileSync(abs, after, "utf8");
  console.log(`  ${label}  ${relPath}`);
  return true;
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

if (newAppName) {
  console.log(`\nApplying app name: "${newAppName}"`);
  const tsName = newAppName.replace(/"/g, '\\"');
  const xmlName = escapeXml(newAppName);
  const jsonName = JSON.stringify(newAppName).slice(1, -1); // strip outer quotes

  // Capacitor config: appName: "..."
  replaceInFile(
    "capacitor.config.ts",
    /(appName:\s*)"[^"]*"/,
    `$1"${tsName}"`,
    "patched ",
  );

  // Android strings.xml: app_name and title_activity_main
  replaceInFile(
    "android/app/src/main/res/values/strings.xml",
    /(<string\s+name="app_name">)[^<]*(<\/string>)/,
    `$1${xmlName}$2`,
    "patched ",
  );
  replaceInFile(
    "android/app/src/main/res/values/strings.xml",
    /(<string\s+name="title_activity_main">)[^<]*(<\/string>)/,
    `$1${xmlName}$2`,
    "patched ",
  );

  // PWA manifest: name + short_name
  replaceInFile(
    "src/manifest.json",
    /("name"\s*:\s*)"[^"]*"/,
    `$1"${jsonName}"`,
    "patched ",
  );
  replaceInFile(
    "src/manifest.json",
    /("short_name"\s*:\s*)"[^"]*"/,
    `$1"${jsonName}"`,
    "patched ",
  );

  // iOS Info.plist CFBundleDisplayName (no-op if file missing)
  replaceInFile(
    "ios/App/App/Info.plist",
    /(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${xmlName}$2`,
    "patched ",
  );
}

// ---------------------------------------------------------------------------
// 7. Sync Google Sign-In web client ID from .env into Android strings.xml
// ---------------------------------------------------------------------------

function parseEnvFile(relPath) {
  const abs = path.resolve(relPath);
  if (!fs.existsSync(abs)) return {};
  const out = {};
  for (const line of fs.readFileSync(abs, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

const envProd = parseEnvFile(".env.production");
const envDev = parseEnvFile(".env.development");
const webClientId =
  envProd.GOOGLE_AUTH_WEB_CLIENT_ID || envDev.GOOGLE_AUTH_WEB_CLIENT_ID;

if (webClientId) {
  const updated = replaceInFile(
    "android/app/src/main/res/values/strings.xml",
    /(<string\s+name="server_client_id">)[^<]*(<\/string>)/,
    `$1${escapeXml(webClientId)}$2`,
    "synced  ",
  );
  if (updated) {
    console.log(
      `  → Android server_client_id set from ${
        envProd.GOOGLE_AUTH_WEB_CLIENT_ID
          ? ".env.production"
          : ".env.development"
      }`,
    );
  }
} else {
  console.log(
    "\nNote: GOOGLE_AUTH_WEB_CLIENT_ID not found in .env.production or .env.development.\n" +
      "      Android Google Sign-In server_client_id was NOT updated.\n" +
      "      Set it in your .env file and re-run this script, or edit\n" +
      "      android/app/src/main/res/values/strings.xml by hand.",
  );
}

// ---------------------------------------------------------------------------
// 8. Done
// ---------------------------------------------------------------------------

console.log(
  "\nDone. Next steps:" +
    "\n  1. Run `npx cap sync` to propagate any remaining build-tool references." +
    "\n  2. Register the new bundle ID in your Firebase console and replace" +
    "\n     android/app/google-services.json (Android) and" +
    "\n     ios/App/GoogleService-Info.plist (iOS) with the new files." +
    "\n  3. Update your Apple Sign-In Services ID in Apple Developer portal (if applicable).",
);
