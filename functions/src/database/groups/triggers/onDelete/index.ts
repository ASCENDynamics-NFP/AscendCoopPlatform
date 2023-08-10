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

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
// Reference to the Firestore database
const db = admin.firestore();
// Triggered when a group is deleted in Firestore and deletes all associated relationships in the database.
export const onGroupDeletion = functions.firestore
  .document("groups/{groupId}")
  .onDelete(handleGroupDeletion);

/**
 * Asynchronously handles the deletion of groups in the database.
 * This function deletes all associated relationships for the deleted group.
 * @param {Object} _snapshot - The snapshot of the group document that was deleted.
 * @param {Object} context - The context in which the function is run, including event context.
 * @return {Promise<void>} - Returns a promise that resolves when the operation is complete
 */
async function handleGroupDeletion(_snapshot: any, context: any) {
  try {
    const groupId = context.params.groupId;

    // Query for relationships where the relatedIds field contains the groupId
    const querySnapshot = await db
      .collection("relationships")
      .where("relatedIds", "array-contains", groupId)
      .get();

    // Create a batch to handle the deletion of all associated relationships
    const batch = db.batch();

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();
  } catch (error) {
    logger.error("Error deleting associated relationships: ", error);
    // Just log the error. Throwing an error in a Firestore trigger won't propagate it to the client.
  }
}
