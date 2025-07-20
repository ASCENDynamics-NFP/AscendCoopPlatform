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
import {
  onDocumentUpdated,
  FirestoreEvent,
  Change,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

// Initialize the Firebase admin SDK
// Reference to the Firestore database
const db = admin.firestore();

/**
 * Cloud Function triggered when a document in the `relatedAccounts` sub-collection of an `accounts` document is updated.
 */
export const onUpdateRelatedAccount = onDocumentUpdated(
  {
    document: "accounts/{accountId}/relatedAccounts/{relatedAccountId}",
    region: "us-central1",
  },
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) => {
    const accountId = event.params.accountId;
    const relatedAccountId = event.params.relatedAccountId;

    if (!event.data?.after || !event.data?.before) {
      logger.error("Missing before or after data in update event");
      return;
    }

    const after = event.data.after.data();
    const before = event.data.before.data();

    try {
      if (
        // If the status or relationship has changed, update the reciprocal related account document (prevents infinite loop on lastModifiedAt update)
        before.status !== after.status ||
        before.relationship !== after.relationship ||
        before.access !== after.access
      ) {
        const reciprocalRelatedAccountRef = db
          .collection("accounts")
          .doc(relatedAccountId)
          .collection("relatedAccounts")
          .doc(accountId);

        const reciprocalDoc = await reciprocalRelatedAccountRef.get();
        const reciprocalData = reciprocalDoc.data();

        if (
          reciprocalData &&
          (reciprocalData.status !== after.status ||
            reciprocalData.relationship !== after.relationship ||
            reciprocalData.access !== after.access)
        ) {
          await reciprocalRelatedAccountRef.update({
            id: accountId,
            accountId: relatedAccountId,
            relationship: after.relationship,
            status: after.status,
            access: after.access,
            lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastModifiedBy: accountId,
          });

          logger.info("Related accounts updated successfully.");
        }
      }
    } catch (error) {
      logger.error("Error updating related accounts: ", error);
    }
  },
);
