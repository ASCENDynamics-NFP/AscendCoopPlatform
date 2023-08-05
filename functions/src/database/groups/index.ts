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

const db = admin.firestore();

export const onGroupCreation = functions.firestore
  .document("groups/{groupId}")
  .onCreate(handleGroupCreation);

/**
 * Asynchronously handles the creation of groups in the database.
 * This function logs the group creation, and depending on the status of the new group,
 * creates a corresponding relationship in the database.
 * @param {Object} snapshot - The snapshot of the group document that was created.
 * @param {Object} context - The context in which the function is run, including event context.
 * @return {Promise<void>} - Returns a promise that resolves when the operation is complete
 */
async function handleGroupCreation(snapshot: any, context: any) {
  logger.info("snapshot: ", snapshot);
  logger.info("context: ", context);
  const newGroup = snapshot.data();
  if (newGroup) {
    logger.info("newGroup: ", newGroup);
    // Use a transaction to ensure atomic update
    return db
      .runTransaction(async (transaction) => {
        const userDataSnapshot = await fetchUser(
          transaction,
          newGroup.createdBy,
        );
        logger.info("userDataSnapshot: ", userDataSnapshot);
        if (userDataSnapshot.exists) {
          const userData = userDataSnapshot.data();
          logger.info("userData: ", userData);
          const relationshipData = {
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: newGroup.createdBy,
            senderId: newGroup.createdBy,
            receiverId: context.params.groupId,
            type: "member",
            status: "accepted",
            membershipRole: "admin",
            receiverRelationship: "group",
            senderRelationship: "user",
            senderName: userData?.displayName, // Assuming the user data has a 'displayName' field
            senderImage: userData?.profilePicture, // Assuming the user data has an 'profilePicture' field
            senderTagline: userData?.tagline, // Assuming the user data has a 'tagline' field
            receiverName: newGroup.name, // Assuming the group data has a 'name' field
            receiverImage: newGroup.logoImage, // Assuming the group data has an 'logoImage' field
            receiverTagline: newGroup.tagline, // Assuming the group data has a 'tagline' field
            lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastModifiedBy: newGroup.createdBy,
          };

          await transaction.set(
            db.collection("relationships").doc(),
            relationshipData,
          );
        }
      })
      .catch((error) => {
        logger.error("Transaction failed: ", error);
        throw error;
      });
  }
}

/**
 * Fetches a user document based on the provided userId
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} userId - The ID of the user to fetch
 * @return {Promise<admin.firestore.DocumentSnapshot>} A promise that resolves with the fetched user document
 */
async function fetchUser(
  transaction: admin.firestore.Transaction,
  userId: string,
) {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await transaction.get(userRef);

  if (!userDoc.exists) {
    logger.error("User not found");
    throw new Error("User not found");
  }

  return userDoc;
}
