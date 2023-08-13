import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
// Reference to the Firestore database
const db = admin.firestore();

// Triggered when a user is updated in Firestore
export const onUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate(handleUserUpdate);

/**
 * Asynchronously handles the update of users in the database.
 * This function updates all associated relationships for the updated user.
 * @param {Object} change - Contains before and after states of the updated user document.
 * @param {Object} context - The context in which the function is run, including event context.
 * @return {Promise<void>} - Returns a promise that resolves when the operation is complete
 */
async function handleUserUpdate(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: any,
) {
  try {
    const userId = context.params.userId;
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Check if tagline, name, or logoImage fields have changed
    if (
      beforeData?.tagline !== afterData?.tagline ||
      beforeData?.name !== afterData?.name ||
      beforeData?.profilePicture !== afterData?.profilePicture
    ) {
      // Query for relationships where the relatedIds field contains the userId
      const querySnapshot = await db
        .collection("relationships")
        .where("relatedIds", "array-contains", userId)
        .get();

      // Create a batch to handle the update of all associated relationships
      const batch = db.batch();

      querySnapshot.forEach((doc) => {
        // Update the relationship fields based on whether the user is the sender or receiver.
        if (doc.data().senderId === userId) {
          batch.update(doc.ref, {
            senderTagline: afterData?.tagline,
            senderName: afterData?.name,
            senderImage: afterData?.profilePicture,
          });
        } else if (doc.data().receiverId === userId) {
          batch.update(doc.ref, {
            receiverTagline: afterData?.tagline,
            receiverName: afterData?.name,
            receiverImage: afterData?.profilePicture,
          });
        }
      });

      // Commit the batch
      await batch.commit();
    }
  } catch (error) {
    logger.error("Error updating associated relationships: ", error);
    // Just log the error. Throwing an error in a Firestore trigger won't propagate it to the client.
  }
}
