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
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {WriteResult} from "firebase-admin/firestore";

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
// Reference to the Firestore database
const db = admin.firestore();
// Triggered when a new user is created in Firebase Authentication (i.e. signed up) and adds a new user profile to Firestore.
export const createUserProfile = functions.auth
  .user()
  .onCreate(async (user) => {
    try {
      await saveUserProfileToFirestore(user);
      logger.info(`User profile for ${user.uid} saved successfully.`);
    } catch (error) {
      logger.error(`Error saving user profile for ${user.uid}:`, error);
      throw error; // This will make the cloud function execution fail and will be retried.
    }
  });

/**
 * Saves the user's profile to Firestore.
 * @param {admin.auth.UserRecord} user - The user record from Firebase Authentication.
 * @return {Promise<WriteResult>} - A promise that resolves when the operation is complete.
 */
async function saveUserProfileToFirestore(
  user: admin.auth.UserRecord,
): Promise<WriteResult> {
  // Reference to the user's profile in Firestore
  const userRef = db.collection("users").doc(user.uid);

  // The data you want to save for the user
  const userProfile = {
    id: user.uid,
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: user.uid,
    lastModifiedBy: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    name: user.displayName ? user.displayName : "Volunteer",
    displayName: user.displayName ? user.displayName : "Volunteer",
    profilePicture: user.photoURL ? user.photoURL : "assets/avatar/male1.png",
    bio: "Glad to be here with everyone!",
    tagline: "Lets help each other out!",
    heroImage: "assets/image/userhero.png",
    dateOfBirth: admin.firestore.FieldValue.serverTimestamp(),
    phoneNumber: user.phoneNumber ? user.phoneNumber : "",
    friends: [],
    groups: [],
    pendingFriends: [],
    pendingGroups: [],
    privacySetting: "public",
    // ... any other fields you want to add
  };

  // Save the user profile to Firestore
  return userRef.set(userProfile);
}
