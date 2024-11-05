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
import {Change, EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
// Reference to the Firestore database
const db = admin.firestore();

/**
 * Cloud Function triggered when a document in the `relatedAccounts` sub-collection of an `accounts` document is updated.
 */
export const onUpdateRelatedAccount = functions.firestore
  .document("accounts/{accountId}/relatedAccounts/{relatedAccountId}")
  .onUpdate(handleRelatedAccountUpdate);

/**
 * Handles the update of a related account document, ensuring the corresponding reciprocal document is also updated.
 *
 * @param {Change<QueryDocumentSnapshot>} change - The change object representing the before and after state of the document.
 * @param {EventContext} context - The context of the event, providing parameters and identifiers.
 */
async function handleRelatedAccountUpdate(
  change: Change<QueryDocumentSnapshot>,
  context: EventContext,
) {
  const accountId = context.params.accountId;
  const relatedAccountId = context.params.relatedAccountId;
  const after = change.after.data();
  const before = change.before.data();

  try {
    if (
      // If the status or relationship has changed, update the reciprocal related account document (prevents infinite loop on lastModifiedAt update)
      before.status !== after.status ||
      before.relationship !== after.relationship
    ) {
      const reciprocalRelatedAccountRef = db
        .collection("accounts")
        .doc(relatedAccountId)
        .collection("relatedAccounts")
        .doc(accountId);

      await reciprocalRelatedAccountRef.update({
        accountId: accountId,
        relationship: after.relationship,
        status: after.status,
        lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastModifiedBy: accountId,
      });

      logger.info("Related accounts updated successfully.");
    }
  } catch (error) {
    logger.error("Error updating related accounts: ", error);
  }
}
