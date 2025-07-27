/**
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
import * as functions from "firebase-functions/v1";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {Timestamp} from "firebase-admin/firestore";

// Firestore database reference
const db = admin.firestore();

// Triggered when a new user is created in Firebase Authentication
// Note: Firebase Functions v2 doesn't have a direct equivalent for auth user creation
// so we keep this as v1
export const createUserProfile = functions
  .region("us-central1")
  .auth.user()
  .onCreate(async (user: admin.auth.UserRecord) => {
    try {
      await saveAccountToFirestore(user);
      logger.info(`User profile for ${user.uid} saved successfully.`);
    } catch (error) {
      logger.error(`Error saving user profile for ${user.uid}:`, error);
      throw error;
    }
  });

/**
 * Saves a new user account document to Firestore in the 'accounts' collection.
 * @param {admin.auth.UserRecord} user - User record from Firebase Authentication.
 * @return {Promise<void>} - Resolves when the document is created.
 */
async function saveAccountToFirestore(
  user: admin.auth.UserRecord,
): Promise<void> {
  const accountRef = db.collection("accounts").doc(user.uid);

  const accountData = {
    id: user.uid,
    name: user.displayName || user.email?.split("@")[0],
    tagline: "New and looking to help!",
    iconImage:
      user.photoURL ||
      "assets/image/logo/ASCENDynamics NFP-logos_transparent.png",
    heroImage: "assets/image/userhero.png",
    type: "new", // New accounts need to complete registration
    contactInformation: {
      privacy: "private",
      emails: [{email: user.email}],
      phoneNumbers: [],
      addresses: [],
    },
    email: user.email,
    privacy: "public",
    totalHours: 0,
    legalAgreements: {
      termsOfService: {
        accepted: true,
        datetime: Timestamp.now(),
        version: "1.0.0",
      },
      privacyPolicy: {
        accepted: true,
        datetime: Timestamp.now(),
        version: "1.0.0",
      },
    },
    createdAt: Timestamp.now(),
    createdBy: user.uid,
    lastLoginAt: Timestamp.now(),
    lastModifiedAt: Timestamp.now(),
    lastModifiedBy: user.uid,
  };

  await accountRef.set(accountData);
}
