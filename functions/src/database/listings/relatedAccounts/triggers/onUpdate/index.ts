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
// functions/src/database/listings/relatedAccounts/triggers/onCreate/index.ts

import * as functions from "firebase-functions";
import {admin} from "../../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

const db = admin.firestore();

/**
 * Firebase Cloud Function trigger that handles updates to relatedAccount documents.
 * Keeps the corresponding relatedListing document in sync with any changes.
 */
export const onUpdateListingsRelatedAccount = functions.firestore
  .document("listings/{listingId}/relatedAccounts/{accountId}")
  .onUpdate(handleListingsRelatedAccountUpdate);

/**
 * Handles updates to a relatedAccount document in Firestore.
 * When a relatedAccount document is updated, this function updates the corresponding
 * relatedListing document under the applicant's account to maintain data consistency.
 *
 * @param {functions.Change<QueryDocumentSnapshot>} change - Contains both the previous and current versions of the document
 * @param {EventContext} context - The context object containing metadata about the event, including listingId and accountId
 * @return {Promise<void>} A promise that resolves when the relatedListing document is updated, or logs an error if it fails
 */
async function handleListingsRelatedAccountUpdate(
  change: functions.Change<QueryDocumentSnapshot>,
  context: EventContext,
) {
  const {listingId, accountId} = context.params;
  const updatedAccount = change.after.data();
  const previousAccount = change.before.data();

  // Check specific fields that affect relatedListings
  const hasRelevantChanges = ["relationship", "notes"].some(
    (field) => previousAccount[field] !== updatedAccount[field],
  );

  if (!hasRelevantChanges) {
    logger.info("No relevant changes detected for relatedListings");
    return;
  }

  try {
    const listingDoc = await db.collection("listings").doc(listingId).get();

    if (!listingDoc.exists) {
      logger.error(`Listing ${listingId} not found.`);
      return;
    }

    const listing = listingDoc.data();

    const relatedListing: any = {
      id: listingId,
      accountId: accountId,
      title: listing?.title,
      organization: listing?.organization,
      type: listing?.type,
      remote: listing?.remote ?? false,
      iconImage: listing?.iconImage ?? null,
      status: listing?.status,
      relationship: updatedAccount.relationship || "applicant",
      applicationDate: updatedAccount.applicationDate,
      notes: updatedAccount.notes ?? null,
      lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModifiedBy: accountId,
    };

    await db
      .collection("accounts")
      .doc(accountId)
      .collection("relatedListings")
      .doc(listingId)
      .update(relatedListing);

    logger.info(
      `Successfully updated relatedListing for account ${accountId} and listing ${listingId}`,
    );
  } catch (error) {
    logger.error("Error in handleListingsRelatedAccountUpdate:", error);
  }
}
