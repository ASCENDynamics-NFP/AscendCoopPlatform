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
import {CapacitorConfig} from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "org.ascendynamics.coopplatform",
  appName: "ASCENDynamics NFP Platform",
  webDir: "public",
  server: {
    androidScheme: "https",
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      clientId:
        "1031671694911-3ejesivnlk5fhr8l29ne74fhp0smdltn.apps.googleusercontent.com",
      // androidClientId is intentionally omitted: the plugin reads it with
      // higher priority than clientId and passes it to requestIdToken(), but
      // requestIdToken() only accepts a web (type-3) client ID. Passing
      // clientId explicitly in GoogleAuth.initialize() overrides this anyway.
      iosClientId:
        "1031671694911-runsg35uo786dmgrlsqqg2gv291m398o.apps.googleusercontent.com", // See docs/NATIVE_SETUP.md — create OAuth 2.0 iOS client in GCP Console
      serverClientId:
        "1031671694911-3ejesivnlk5fhr8l29ne74fhp0smdltn.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
