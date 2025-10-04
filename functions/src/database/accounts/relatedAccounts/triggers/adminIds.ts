import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";

const db = admin.firestore();

/**
 * Recomputes adminIds/moderatorIds for the given account from its relatedAccounts where
 * status == 'accepted' and access in {'admin','moderator'}.
 * Safe to call for both users and groups; users will typically produce an empty list.
 *
 * @param {string} accountId - The ID of the account whose admin lists should be synced.
 * @return {Promise<void>} A promise that resolves when the sync completes.
 */
export async function syncAdminIdsForAccount(accountId: string): Promise<void> {
  try {
    const accountSnap = await db.collection("accounts").doc(accountId).get();
    if (!accountSnap.exists) {
      return;
    }
    const acc = accountSnap.data() || {};

    // Only maintain for group accounts
    if (acc.type !== "group") {
      // Clear field if present on non-group to avoid confusion
      const clear: Partial<{adminIds: string[]; moderatorIds: string[]}> = {};
      if (Array.isArray(acc.adminIds) && acc.adminIds.length > 0) {
        clear.adminIds = [];
      }
      if (Array.isArray(acc.moderatorIds) && acc.moderatorIds.length > 0) {
        clear.moderatorIds = [];
      }
      if (Object.keys(clear).length > 0) {
        await accountSnap.ref.update(clear);
      }
      return;
    }

    const relSnap = await accountSnap.ref
      .collection("relatedAccounts")
      .where("status", "==", "accepted")
      .get();

    const adminIds: string[] = [];
    const moderatorIds: string[] = [];
    for (const doc of relSnap.docs) {
      const d = doc.data() as {access?: string} | undefined;
      if (!d) {
        continue;
      }
      if (d.access === "admin") {
        adminIds.push(doc.id);
      }
      if (d.access === "moderator") {
        moderatorIds.push(doc.id);
      }
    }

    await accountSnap.ref.update({adminIds, moderatorIds});
  } catch (err) {
    logger.error("syncAdminIdsForAccount failed", {accountId, err});
  }
}
