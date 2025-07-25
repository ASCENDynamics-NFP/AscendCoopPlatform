import {
  onDocumentCreated,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

const db = admin.firestore();

export const onCreateAccount = onDocumentCreated(
  {document: "accounts/{accountId}", region: "us-central1"},
  handleAccountCreate,
);

async function handleAccountCreate(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined, {accountId: string}>,
) {
  const snapshot = event.data;
  const accountId = event.params.accountId;
  if (!snapshot) {
    logger.error("No document data found in create event");
    return;
  }

  const account = snapshot.data() as any;
  const groupType = account.groupDetails?.groupType;
  if (groupType !== "Nonprofit" && groupType !== "Community") {
    logger.info(`No volunteer project needed for groupType ${groupType}`);
    return;
  }

  try {
    await db
      .collection("accounts")
      .doc(accountId)
      .collection("projects")
      .add({
        name: "Volunteer",
        accountId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: accountId,
      });
    logger.info(`Volunteer project created for account ${accountId}`);
  } catch (error) {
    logger.error("Error creating volunteer project:", error);
  }
}
