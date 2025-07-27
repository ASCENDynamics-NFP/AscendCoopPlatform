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

// Firestore database reference
const db = admin.firestore();

// Triggered when a user is deleted from Firebase Authentication
// Note: Firebase Functions v2 doesn't have an equivalent for auth user deletion
// so we keep this as v1
export const onUserRecordDeletion = functions
  .region("us-central1")
  .auth.user()
  .onDelete(async (user: admin.auth.UserRecord) => {
    try {
      await deleteAccountDocument(user.uid);
      logger.info(`Account document for ${user.uid} deleted successfully.`);
    } catch (error) {
      logger.error(`Error deleting account document for ${user.uid}:`, error);
      // Log the error, as throwing won't affect Firebase's handling of the deletion
    }
  });

/**
 * Deletes a user's account document from Firestore.
 * @param {string} accountId - The ID of the user whose document needs to be deleted.
 * @return {Promise<void>} - Resolves when the document is deleted.
 */
async function deleteAccountDocument(accountId: string): Promise<void> {
  const accountRef = db.collection("accounts").doc(accountId);
  await accountRef.delete();
}
