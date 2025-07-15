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
import * as functions from "firebase-functions/v1";
import {admin} from "../../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {EventContext} from "firebase-functions/v1";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

// Initialize the Firebase admin SDK
// Reference to the Firestore database
const db = admin.firestore();

/**
 * Cloud Function triggered when a document in the `relatedAccounts` sub-collection of an `accounts` document is deleted.
 */
export const onDeleteRelatedAccount = functions.firestore
  .document("accounts/{accountId}/relatedAccounts/{relatedAccountId}")
  .onDelete(handleRelatedAccountDelete);

/**
 * Handles the deletion of a related account document, ensuring the corresponding reciprocal document in the target account is also deleted.
 *
 * @param {QueryDocumentSnapshot} _snapshot - The snapshot of the document being deleted.
 * @param {EventContext} context - The context of the event, providing parameters and identifiers.
 */
async function handleRelatedAccountDelete(
  _snapshot: QueryDocumentSnapshot,
  context: EventContext,
) {
  const accountId = context.params.accountId;
  const relatedAccountId = context.params.relatedAccountId;
  try {
    const reciprocalRelatedAccountRef = db
      .collection("accounts")
      .doc(relatedAccountId)
      .collection("relatedAccounts")
      .doc(accountId);

    await reciprocalRelatedAccountRef.delete();

    logger.info("Reciprocal related account deleted successfully.");
  } catch (error) {
    logger.error("Error deleting reciprocal related account: ", error);
  }
}
