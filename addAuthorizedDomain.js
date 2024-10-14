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
// addAuthorizedDomain.js

const admin = require('firebase-admin');
const { URL } = require('url');

// Parse the service account JSON from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function addAuthorizedDomain(previewUrl) {
  try {
    // Extract the domain from the preview URL
    const domain = new URL(previewUrl).hostname;

    console.log(`Adding domain: ${domain} to authorized domains.`);

    // Get the existing list of authorized domains
    const authSettings = await admin.auth().getSettings();
    const authorizedDomains = authSettings.authorizedDomains || [];

    // Check if the domain is already in the list
    if (!authorizedDomains.includes(domain)) {
      // Add the new domain to the list
      authorizedDomains.push(domain);

      // Update the authorized domains in Firebase Authentication
      await admin.auth().updateSettings({ authorizedDomains });

      console.log(`Successfully added ${domain} to authorized domains.`);
    } else {
      console.log(`${domain} is already in authorized domains.`);
    }
  } catch (error) {
    console.error('Error adding authorized domain:', error);
    process.exit(1);
  }
}

// Get the preview URL from the command line arguments
const previewUrl = process.argv[2];

if (previewUrl) {
  console.log(`Received preview URL: ${previewUrl}`);
  addAuthorizedDomain(previewUrl);
} else {
  console.error('Please provide the preview URL as an argument.');
  process.exit(1);
}
