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

// Initialize the Firebase admin SDK if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}
// Reference to the Firestore database
const db = admin.firestore();
// Triggered when a user is deleted from Firebase Authentication (i.e. deleted their account) and deletes the user's document from Firestore.
export const onUserRecordDeletion = functions.auth
  .user()
  .onDelete(async (user) => {
    try {
      await deleteAccountDocument(user.uid);
      logger.info(`Account document for ${user.uid} deleted successfully.`);
    } catch (error) {
      logger.error(`Error deleting account document for ${user.uid}:`, error);
      // Just log the error. Throwing an error in a Firebase Authentication trigger won't propagate it to the client.
    }
  });

/**
 * Deletes the account's document from Firestore.
 * @param {string} accountId - The ID of the user whose document needs to be deleted.
 * @return {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function deleteAccountDocument(accountId: string): Promise<void> {
  // Reference to the account's document in Firestore
  const accountRef = db.collection("accounts").doc(accountId);

  // Delete the account document from Firestore
  await accountRef.delete();
}
