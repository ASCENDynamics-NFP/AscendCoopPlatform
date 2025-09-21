import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";

const db = getFirestore();

/**
 * Recompute adminIds and moderatorIds for a group account from its relatedAccounts
 * where status == 'accepted' and access in {'admin','moderator'}.
 * Safe to call for users; it will no-op or clear stray fields.
 */
export async function syncAdminIdsForAccount(accountId: string): Promise<void> {
  try {
    const accountRef = db.collection("accounts").doc(accountId);
    const snap = await accountRef.get();
    if (!snap.exists) return;
    const acc = snap.data() || {};

    if (acc.type !== "group") {
      const clear: Record<string, any> = {};
      if (Array.isArray(acc.adminIds) && acc.adminIds.length)
        clear.adminIds = [];
      if (Array.isArray(acc.moderatorIds) && acc.moderatorIds.length)
        clear.moderatorIds = [];
      if (Object.keys(clear).length) await accountRef.update(clear);
      return;
    }

    const relSnap = await accountRef
      .collection("relatedAccounts")
      .where("status", "==", "accepted")
      .get();

    const adminIds: string[] = [];
    const moderatorIds: string[] = [];
    for (const d of relSnap.docs) {
      const data = d.data() as {access?: string} | undefined;
      if (!data) continue;
      if (data.access === "admin") adminIds.push(d.id);
      if (data.access === "moderator") moderatorIds.push(d.id);
    }

    await accountRef.update({adminIds, moderatorIds});
  } catch (err) {
    logger.warn("syncAdminIdsForAccount failed", {accountId, err});
  }
}
