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
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const envConfig: {[key: string]: string | undefined} = {
  FIREBASE_API_KEY: process.env["FIREBASE_API_KEY"],
  FIREBASE_AUTH_DOMAIN: process.env["FIREBASE_AUTH_DOMAIN"],
  FIREBASE_PROJECT_ID: process.env["FIREBASE_PROJECT_ID"],
  FIREBASE_STORAGE_BUCKET: process.env["FIREBASE_STORAGE_BUCKET"],
  FIREBASE_MESSAGING_SENDER_ID: process.env["FIREBASE_MESSAGING_SENDER_ID"],
  FIREBASE_APP_ID: process.env["FIREBASE_APP_ID"],
  FIREBASE_MEASUREMENT_ID: process.env["FIREBASE_MEASUREMENT_ID"],
};

// Create the environment.ts file content
const envFileContent = `
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${envConfig["FIREBASE_API_KEY"]}',
    authDomain: '${envConfig["FIREBASE_AUTH_DOMAIN"]}',
    projectId: '${envConfig["FIREBASE_PROJECT_ID"]}',
    storageBucket: '${envConfig["FIREBASE_STORAGE_BUCKET"]}',
    messagingSenderId: '${envConfig["FIREBASE_MESSAGING_SENDER_ID"]}',
    appId: '${envConfig["FIREBASE_APP_ID"]}',
    measurementId: '${envConfig["FIREBASE_MEASUREMENT_ID"]}',
  },
};
`;

// Write the environment.ts file
const envFilePath = path.resolve(
  __dirname,
  "../src/environments/environment.prod.ts",
);
fs.writeFileSync(envFilePath, envFileContent);

console.log(`Environment file created at ${envFilePath}`);
