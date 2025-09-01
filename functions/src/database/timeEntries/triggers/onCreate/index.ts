import {
  onDocumentCreated,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

export const onCreateTimeEntry = onDocumentCreated(
  {
    document: "accounts/{accountId}/timeEntries/{entryId}",
    region: "us-central1",
  },
  handleTimeEntryCreate,
);

/**
 * Handle creation of a new time entry document.
 *
 * @param {FirestoreEvent} event - Firestore event containing the time entry data and params.
 * @return {Promise<void>} Resolves when processing is complete.
 */
async function handleTimeEntryCreate(
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {accountId: string; entryId: string}
  >,
) {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No document data found in create event");
    return;
  }

  const entry = snapshot.data();
  const userId = entry.userId;
  const hours = entry.hours || 0;
  const projectId = entry.projectId;
  const accountId = event.params.accountId;

  if (!userId) {
    logger.error("Time entry missing userId");
    return;
  }

  if (entry.status === "approved") {
    try {
      await admin
        .firestore()
        .doc(`accounts/${userId}`)
        .update({
          totalHours: admin.firestore.FieldValue.increment(hours),
        });
    } catch (error) {
      logger.error("Error updating total hours:", error);
    }
  }

  // Maintain per-project timeEntryCount aggregate
  if (projectId && accountId) {
    try {
      await admin
        .firestore()
        .doc(`accounts/${accountId}/projects/${projectId}`)
        .update({
          timeEntryCount: admin.firestore.FieldValue.increment(1),
          lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      logger.error("Error incrementing project timeEntryCount:", error);
    }
  } else {
    logger.error("Time entry missing projectId or accountId for aggregation");
  }
}
