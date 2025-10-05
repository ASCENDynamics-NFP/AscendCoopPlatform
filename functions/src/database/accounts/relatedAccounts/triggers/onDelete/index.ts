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
  onDocumentDeleted,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";
import {syncAdminIdsForAccount} from "../adminIds";

// Initialize the Firebase admin SDK
// Reference to the Firestore database
const db = admin.firestore();

/**
 * Cloud Function triggered when a document in the `relatedAccounts` sub-collection of an `accounts` document is deleted.
 */
export const onDeleteRelatedAccount = onDocumentDeleted(
  {
    document: "accounts/{accountId}/relatedAccounts/{relatedAccountId}",
    region: "us-central1",
  },
  handleRelatedAccountDelete,
);

/**
 * Handles the deletion of a related account document, ensuring the corresponding reciprocal document in the target account is also deleted.
 *
 * @param {FirestoreEvent<QueryDocumentSnapshot | undefined>} event - The event for the deleted document.
 */
async function handleRelatedAccountDelete(
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {accountId: string; relatedAccountId: string}
  >,
) {
  const accountId = event.params.accountId;
  const relatedAccountId = event.params.relatedAccountId;

  try {
    const reciprocalRelatedAccountRef = db
      .collection("accounts")
      .doc(relatedAccountId)
      .collection("relatedAccounts")
      .doc(accountId);

    await reciprocalRelatedAccountRef.delete();

    logger.info("Reciprocal related account deleted successfully.");
    // Keep adminIds in sync for both sides
    await Promise.all([
      syncAdminIdsForAccount(accountId),
      syncAdminIdsForAccount(relatedAccountId),
    ]);
  } catch (error) {
    logger.error("Error deleting reciprocal related account: ", error);
  }
}
