import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
const db = admin.firestore();

export const onRelationshipCreation = functions.firestore
  .document("relationships/{relationshipId}")
  .onCreate(async (snapshot) => {
    const newRelationship = snapshot.data();

    if (
      (newRelationship &&
        newRelationship.type === "friend" &&
        newRelationship.status === "pending") ||
      newRelationship.status === "accepted"
    ) {
      const senderId = newRelationship.senderId;
      const receiverId = newRelationship.receiverId;
      logger.info("senderId: ", senderId, "receiverId: ", receiverId);

      if (senderId && receiverId) {
        // Use a transaction to ensure atomic update
        return db.runTransaction(async (transaction) => {
          const sender = await fetchUser(transaction, senderId);
          const receiver = await fetchUser(transaction, receiverId);

          logger.info("sender: ", sender.data(), "receiver: ", receiver.data());

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
        });
      }
    }
  });

export const onRelationshipUpdate = functions.firestore
  .document("relationships/{relationshipId}")
  .onUpdate(async (change, _context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (
      before &&
      after &&
      before.status !== after.status &&
      after.type === "friend"
    ) {
      const senderId = after.senderId;
      const receiverId = after.receiverId;

      logger.info("senderId: ", senderId, "receiverId: ", receiverId);

      if (senderId && receiverId) {
        // Use a transaction to ensure atomic update
        return db.runTransaction(async (transaction) => {
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
        });
      }
    }
  });

export const onRelationshipDeletion = functions.firestore
  .document("relationships/{relationshipId}")
  .onDelete(async (snapshot, _context) => {
    const deletedRelationship = snapshot.data();

    if (deletedRelationship && deletedRelationship.type === "friend") {
      const senderId = deletedRelationship.senderId;
      const receiverId = deletedRelationship.receiverId;
      logger.info("senderId: ", senderId, "receiverId: ", receiverId);

      if (senderId && receiverId) {
        // Use a transaction to ensure atomic update
        return db.runTransaction(async (transaction) => {
          const sender = await fetchUser(transaction, senderId);
          const receiver = await fetchUser(transaction, receiverId);

          if (!sender.exists || !receiver.exists) {
            throw new Error("User not found");
          }

          logger.info("sender: ", sender.data(), "receiver: ", receiver.data());

          // Remove each user from the other's friends array
          removeFriend(transaction, senderId, receiverId);
        });
      }
    }
  });

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
