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
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
const db = admin.firestore();

export const onRelationshipCreation = functions.firestore
  .document("relationships/{relationshipId}")
  .onCreate(handleRelationshipCreation);

export const onRelationshipUpdate = functions.firestore
  .document("relationships/{relationshipId}")
  .onUpdate(handleRelationshipUpdate);

export const onRelationshipDeletion = functions.firestore
  .document("relationships/{relationshipId}")
  .onDelete(handleRelationshipDeletion);

/**
 * Asynchronously handles updates to relationships in the database.
 * This function logs relevant relationship changes, and depending on the status and type of relationship,
 * updates the database accordingly.
 *
 * @async
 * @function handleRelationshipUpdate
 * @param {Object} change - The change object containing the 'before' and 'after' snapshots of a document.
 * @param {Object} _context - The context in which the function is being called. Currently not used in this function.
 * @return {Promise<void>} - Returns a promise that resolves when the operation is complete.
 * @throws Will throw an error if the relationship type is not recognized.
 */
async function handleRelationshipUpdate(change: any, _context: any) {
  const before = change.before.data();
  const after = change.after.data();

  if (before && after && before.status !== after.status) {
    const senderId = after.senderId;
    const receiverId = after.receiverId;

    logger.info("senderId: ", senderId, "receiverId: ", receiverId);

    if (senderId && receiverId) {
      // Use a transaction to ensure atomic update
      return db.runTransaction(async (transaction) => {
        if (after.type === "friend") {
          const sender = await fetchUser(transaction, senderId);
          const receiver = await fetchUser(transaction, receiverId);

          logger.info("sender: ", sender.data(), "receiver: ", receiver.data());

          if (after.status === "pending") {
            // Add each user to the other's pendingFriends array
            requestedFriends(transaction, senderId, receiverId);
          } else if (after.status === "accepted") {
            // Add each user to the other's friends array
            acceptedFriends(transaction, senderId, receiverId);
          } else if (after.status === "rejected") {
            // Remove each user from the other's pendingFriends and friends arrays
            removeFriend(transaction, senderId, receiverId);
          }
        } else if (after.type === "group") {
          const sender = await fetchGroup(transaction, senderId);
          const receiver = await fetchGroup(transaction, receiverId);

          logger.info("sender: ", sender.data(), "receiver: ", receiver.data());

          if (after.status === "pending") {
            // Add each user to the other's pendingFriends array
            requestGroupCollaboration(transaction, senderId, receiverId);
          } else if (after.status === "accepted") {
            // Add each user to the other's friends array
            acceptGroupCollaboration(transaction, senderId, receiverId);
          } else if (after.status === "rejected") {
            // Remove each user from the other's pendingFriends and friends arrays
            removeGroupCollaboration(transaction, senderId, receiverId);
          }
        } else if (after.type === "member") {
          const sender = await fetchUser(transaction, senderId);
          const receiver = await fetchGroup(transaction, receiverId);

          logger.info("sender: ", sender.data(), "receiver: ", receiver.data());

          if (after.status === "pending") {
            // Add to the other's pending groups and members array
            requestGroupMembership(transaction, senderId, receiverId);
          } else if (after.status === "accepted") {
            // Add to the other's groups and members array
            acceptGroupMembership(transaction, senderId, receiverId);
          } else if (after.status === "rejected") {
            // Remove each user from the other's pendingMembers and groups arrays
            removeGroupMembership(transaction, senderId, receiverId);
          }
        } else {
          logger.error("Relationship type not found");
          throw new Error("Relationship type not found");
        }
      });
    }
  }
}

/**
 * Asynchronously handles deletions of relationships in the database.
 * This function logs relevant relationship changes, and depending on the type of relationship,
 * updates the database to reflect the deletion.
 *
 * @async
 * @function handleRelationshipDeletion
 * @param {Object} snapshot - The snapshot of the document that was deleted.
 * @param {Object} _context - The context in which the function is being called. Currently not used in this function.
 * @return {Promise<void>} - Returns a promise that resolves when the operation is complete.
 * @throws Will throw an error if the relationship type is not recognized or if a user/group is not found.
 */
async function handleRelationshipDeletion(snapshot: any, _context: any) {
  const deletedRelationship = snapshot.data();

  if (deletedRelationship) {
    const senderId = deletedRelationship.senderId;
    const receiverId = deletedRelationship.receiverId;
    logger.info("senderId: ", senderId, "receiverId: ", receiverId);

    if (senderId && receiverId) {
      // Use a transaction to ensure atomic update
      return db.runTransaction(async (transaction) => {
        if (deletedRelationship.type === "friend") {
          const sender = await fetchUser(transaction, senderId);
          const receiver = await fetchUser(transaction, receiverId);

          logger.info("sender: ", sender.data(), "receiver: ", receiver.data());

          // Remove each user from the other's friends array
          removeFriend(transaction, senderId, receiverId);
        } else if (deletedRelationship.type === "group") {
          const sender = await fetchGroup(transaction, senderId);
          const receiver = await fetchGroup(transaction, receiverId);

          logger.info("sender: ", sender.data(), "receiver: ", receiver.data());

          // Remove each user from the other's friends array
          removeGroupCollaboration(transaction, senderId, receiverId);
        } else if (deletedRelationship.type === "member") {
          const sender = await fetchUser(transaction, senderId);
          const receiver = await fetchGroup(transaction, receiverId);

          logger.info("sender: ", sender.data(), "receiver: ", receiver.data());

          // Remove each user from the other's friends array
          removeGroupMembership(transaction, senderId, receiverId);
        } else {
          logger.error("Relationship type not found");
          throw new Error("Relationship type not found");
        }
      });
    }
  }
}

/**
 * Asynchronously handles the creation of relationships in the database.
 * This function logs relevant relationship changes, and depending on the status and type of the new relationship,
 * updates the database accordingly.
 *
 * @async
 * @function handleRelationshipCreation
 * @param {Object} snapshot - The snapshot of the document that was created.
 * @return {Promise<void>} - Returns a promise that resolves when the operation is complete.
 * @throws Will throw an error if the relationship type is not recognized.
 */
async function handleRelationshipCreation(snapshot: any) {
  const newRelationship = snapshot.data();

  if (newRelationship) {
    if (
      newRelationship.status === "pending" ||
      newRelationship.status === "accepted" ||
      newRelationship.status === "rejected"
    ) {
      const senderId = newRelationship.senderId;
      const receiverId = newRelationship.receiverId;
      logger.info("senderId: ", senderId, "receiverId: ", receiverId);

      if (senderId && receiverId) {
        // Use a transaction to ensure atomic update
        return db.runTransaction(async (transaction) => {
          if (newRelationship.type === "friend") {
            // Handle friend relationship
            const sender = await fetchUser(transaction, senderId);
            const receiver = await fetchUser(transaction, receiverId);

            logger.info(
              "sender: ",
              sender.data(),
              "receiver: ",
              receiver.data(),
            );

            if (newRelationship.status === "pending") {
              // Add each user to the other's pendingFriends array
              requestedFriends(transaction, senderId, receiverId);
            } else if (newRelationship.status === "accepted") {
              // Add each user to the other's friends array
              acceptedFriends(transaction, senderId, receiverId);
            } else if (newRelationship.status === "rejected") {
              // Remove each user from the other's pendingFriends and friends arrays
              removeFriend(transaction, senderId, receiverId);
            }
          } else if (newRelationship.type === "group") {
            // Handle group collaboration
            const sender = await fetchGroup(transaction, senderId);
            const receiver = await fetchGroup(transaction, receiverId);
            logger.info(
              "sender: ",
              sender.data(),
              "receiver: ",
              receiver.data(),
            );

            if (newRelationship.status === "pending") {
              // Add each group to the other's pendingFriends array
              requestGroupCollaboration(transaction, senderId, receiverId);
            } else if (newRelationship.status === "accepted") {
              // Add each user to the other's friends array
              acceptGroupCollaboration(transaction, senderId, receiverId);
            } else if (newRelationship.status === "rejected") {
              // Remove each user from the other's pendingFriends and friends arrays
              removeGroupCollaboration(transaction, senderId, receiverId);
            }
          } else if (newRelationship.type === "member") {
            // Handle group membership
            const sender = await fetchUser(transaction, senderId);
            const receiver = await fetchGroup(transaction, receiverId);
            logger.info(
              "sender: ",
              sender.data(),
              "receiver: ",
              receiver.data(),
            );

            if (newRelationship.status === "pending") {
              // Add each group to the other's pendingFriends array
              requestGroupMembership(transaction, senderId, receiverId);
            } else if (newRelationship.status === "accepted") {
              // Add each user to the other's friends array
              acceptGroupMembership(transaction, senderId, receiverId);
            } else if (newRelationship.status === "rejected") {
              // Remove each user from the other's pendingFriends and friends arrays
              removeGroupMembership(transaction, senderId, receiverId);
            }
          } else {
            logger.error("Relationship type not found");
            throw new Error("Relationship type not found");
          }
        });
      }
    }
  }
}

/**
 * Fetches a group document based on the provided groupId
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} groupId - The ID of the group to fetch
 * @return {Promise<admin.firestore.DocumentSnapshot>} A promise that resolves with the fetched user document
 */
async function fetchGroup(
  transaction: admin.firestore.Transaction,
  groupId: string,
) {
  const groupRef = db.collection("groups").doc(groupId);
  const groupDoc = await transaction.get(groupRef);

  if (!groupDoc.exists) {
    logger.error("Group not found");
    throw new Error("Group not found");
  }

  return groupDoc;
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

/**
 * Adds each user to the other's pendingFriends array
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
function requestedFriends(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("users").doc(senderId);
  const receiverRef = db.collection("users").doc(receiverId);

  transaction.update(senderRef, {
    pendingFriends: admin.firestore.FieldValue.arrayUnion(receiverId),
  });

  transaction.update(receiverRef, {
    pendingFriends: admin.firestore.FieldValue.arrayUnion(senderId),
  });
}

/**
 * Adds each user to the other's friends array
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
function acceptedFriends(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("users").doc(senderId);
  const receiverRef = db.collection("users").doc(receiverId);

  transaction.update(senderRef, {
    pendingFriends: admin.firestore.FieldValue.arrayRemove(receiverId),
    friends: admin.firestore.FieldValue.arrayUnion(receiverId),
  });

  transaction.update(receiverRef, {
    pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId),
    friends: admin.firestore.FieldValue.arrayUnion(senderId),
  });
}

/**
 * Removes each user from the other's friends and pendingFriends array
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
export function removeFriend(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("users").doc(senderId);
  const receiverRef = db.collection("users").doc(receiverId);

  transaction.update(senderRef, {
    friends: admin.firestore.FieldValue.arrayRemove(receiverId),
    pendingFriends: admin.firestore.FieldValue.arrayRemove(receiverId),
  });

  transaction.update(receiverRef, {
    friends: admin.firestore.FieldValue.arrayRemove(senderId),
    pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId),
  });
}

/**
 * Adds each group to the other's groups array
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
function acceptGroupCollaboration(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("groups").doc(senderId);
  const receiverRef = db.collection("groups").doc(receiverId);

  transaction.update(senderRef, {
    pendingRelatedGroups: admin.firestore.FieldValue.arrayRemove(receiverId),
    relatedGroups: admin.firestore.FieldValue.arrayUnion(receiverId),
  });

  transaction.update(receiverRef, {
    pendingRelatedGroups: admin.firestore.FieldValue.arrayRemove(senderId),
    relatedGroups: admin.firestore.FieldValue.arrayUnion(senderId),
  });
}

/**
 * Adds each group to the other's groups array
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
function requestGroupCollaboration(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("groups").doc(senderId);
  const receiverRef = db.collection("groups").doc(receiverId);

  transaction.update(senderRef, {
    pendingRelatedGroups: admin.firestore.FieldValue.arrayUnion(receiverId),
  });

  transaction.update(receiverRef, {
    pendingRelatedGroups: admin.firestore.FieldValue.arrayUnion(senderId),
  });
}

/**
 * Removes each group from the other's relatedGroups and pendingRelatedGroups array
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
export function removeGroupCollaboration(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("groups").doc(senderId);
  const receiverRef = db.collection("groups").doc(receiverId);

  transaction.update(senderRef, {
    relatedGroups: admin.firestore.FieldValue.arrayRemove(receiverId),
    pendingRelatedGroups: admin.firestore.FieldValue.arrayRemove(receiverId),
  });

  transaction.update(receiverRef, {
    relatedGroups: admin.firestore.FieldValue.arrayRemove(senderId),
    pendingRelatedGroups: admin.firestore.FieldValue.arrayRemove(senderId),
  });
}

/**
 * Add membership from both the user's groups array and the group's members array
 * and remove from pending arrays
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
function acceptGroupMembership(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("users").doc(senderId);
  const receiverRef = db.collection("groups").doc(receiverId);

  transaction.update(senderRef, {
    // Update user model
    pendingGroups: admin.firestore.FieldValue.arrayRemove(receiverId),
    groups: admin.firestore.FieldValue.arrayUnion(receiverId),
  });

  transaction.update(receiverRef, {
    // Update group model
    pendingMembers: admin.firestore.FieldValue.arrayRemove(senderId),
    members: admin.firestore.FieldValue.arrayUnion(senderId),
  });
}

/**
 * Adds group or user to the user's pendingGroups array and group's pendingMembers array
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
function requestGroupMembership(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("users").doc(senderId);
  const receiverRef = db.collection("groups").doc(receiverId);

  transaction.update(senderRef, {
    // Add pendingGroups to user model
    pendingGroups: admin.firestore.FieldValue.arrayUnion(receiverId),
  });

  transaction.update(receiverRef, {
    // Add pendingMembers to group model
    pendingMembers: admin.firestore.FieldValue.arrayUnion(senderId),
  });
}

/**
 * Removes membership from both the user's groups array and the group's members array and pending arrays
 * @param {admin.firestore.Transaction} transaction - The Firestore transaction
 * @param {string} senderId - The ID of the sender
 * @param {string} receiverId - The ID of the receiver
 */
export function removeGroupMembership(
  transaction: admin.firestore.Transaction,
  senderId: string,
  receiverId: string,
) {
  const senderRef = db.collection("users").doc(senderId);
  const receiverRef = db.collection("groups").doc(receiverId);

  transaction.update(senderRef, {
    // Update user model
    groups: admin.firestore.FieldValue.arrayRemove(receiverId),
    pendingGroups: admin.firestore.FieldValue.arrayRemove(receiverId),
  });

  transaction.update(receiverRef, {
    // Update group model
    members: admin.firestore.FieldValue.arrayRemove(senderId),
    pendingMembers: admin.firestore.FieldValue.arrayRemove(senderId),
  });
}
