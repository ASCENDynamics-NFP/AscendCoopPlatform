import {
  onDocumentDeleted,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

export const onDeleteTimeEntry = onDocumentDeleted(
  {
    document: "accounts/{accountId}/timeEntries/{entryId}",
    region: "us-central1",
  },
  handleTimeEntryDelete,
);

/**
 * Handle deletion of a time entry document.
 *
 * @param event - Firestore event containing the deleted time entry data and params.
 */
async function handleTimeEntryDelete(
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {accountId: string; entryId: string}
  >,
) {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No document data found in delete event");
    return;
  }

  const entry = snapshot.data();
  const userId = entry.userId;
  const hours = entry.hours || 0;

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
          totalHours: admin.firestore.FieldValue.increment(-hours),
        });
    } catch (error) {
      logger.error("Error updating total hours:", error);
    }
  }
}
