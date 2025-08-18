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
      await deleteUserRelatedData(user.uid);
      logger.info(
        `Account and related data for ${user.uid} deleted successfully.`,
      );
    } catch (error) {
      logger.error(`Error deleting account data for ${user.uid}:`, error);
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
  logger.info(`Deleted account document for user: ${accountId}`);
}

/**
 * Deletes all user-related data from Firestore.
 * @param {string} uid - The user ID whose related data should be deleted.
 * @return {Promise<void>} - Resolves when all related data is deleted.
 */
async function deleteUserRelatedData(uid: string): Promise<void> {
  const batch = db.batch();

  try {
    // Delete user's listings
    const listingsSnapshot = await db
      .collection("listings")
      .where("accountId", "==", uid)
      .get();

    listingsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Anonymize user's time entries (preserve for organizational records)
    const timeEntriesSnapshot = await db
      .collection("timeEntries")
      .where("accountId", "==", uid)
      .get();

    timeEntriesSnapshot.docs.forEach((doc) => {
      // Anonymize instead of delete to preserve organizational records
      batch.update(doc.ref, {
        userName: "Deleted User",
        userId: "deleted",
        notes: doc.data().notes
          ? "[Content removed - user deleted]"
          : undefined,
      });
    });

    // Delete user's related accounts (connections)
    const relatedAccountsSnapshot = await db
      .collection("relatedAccounts")
      .where("accountId", "==", uid)
      .get();

    relatedAccountsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete connections where user is the related account
    const connectionsSnapshot = await db
      .collection("relatedAccounts")
      .where("relatedAccountId", "==", uid)
      .get();

    connectionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete user's chat participations
    const chatsSnapshot = await db
      .collection("chats")
      .where("participants", "array-contains", uid)
      .get();

    chatsSnapshot.docs.forEach((doc) => {
      // Update chat to remove user from participants instead of deleting entire chat
      const currentParticipants = doc.data().participants || [];
      const updatedParticipants = currentParticipants.filter(
        (p: string) => p !== uid,
      );

      if (updatedParticipants.length > 0) {
        batch.update(doc.ref, {participants: updatedParticipants});
      } else {
        // If no participants left, delete the chat
        batch.delete(doc.ref);
      }
    });

    // Delete user's messages
    const messagesSnapshot = await db
      .collection("messages")
      .where("senderId", "==", uid)
      .get();

    messagesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit all deletions
    await batch.commit();
    logger.info(`Deleted related data for user: ${uid}`);
  } catch (error) {
    logger.error(`Error deleting related data for user ${uid}:`, error);
    throw error;
  }
}
