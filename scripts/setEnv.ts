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
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const targetPath = "./src/environments/environment.prod.ts";
const envConfigFile = `
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${process.env["FIREBASE_API_KEY"]}',
    authDomain: '${process.env["FIREBASE_AUTH_DOMAIN"]}',
    projectId: '${process.env["FIREBASE_PROJECT_ID"]}',
    storageBucket: '${process.env["FIREBASE_STORAGE_BUCKET"]}',
    messagingSenderId: '${process.env["FIREBASE_MESSAGING_SENDER_ID"]}',
    appId: '${process.env["FIREBASE_APP_ID"]}',
    measurementId: '${process.env["FIREBASE_MEASUREMENT_ID"]}',
  }
};
`;
fs.writeFileSync(targetPath, envConfigFile);
