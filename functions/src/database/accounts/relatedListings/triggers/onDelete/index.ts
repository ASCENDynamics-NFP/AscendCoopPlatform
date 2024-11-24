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
// functions/src/database/accounts/relatedListings/triggers/onDelete/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// New trigger for relatedListings onDelete
export const onDeleteAccountsRelatedListing = functions.firestore
  .document("accounts/{accountId}/relatedListings/{listingId}")
  .onDelete(handleAccountsRelatedListingDelete);

/**
 * Handles the deletion of a relatedListing document in Firestore.
 * When a user removes a relatedListing from their account,
 * this function deletes the corresponding relatedAccount document
 * under the listing, unlinking the account from the listing.
 *
 * @param {QueryDocumentSnapshot} snapshot - The snapshot of the deleted relatedListing document.
 * @param {EventContext} context - The context object containing metadata about the event, including accountId and listingId.
 * @return {Promise<void>} A promise that resolves when the relatedAccount document is deleted, or logs an error if it fails.
 */
async function handleAccountsRelatedListingDelete(
  snapshot: QueryDocumentSnapshot,
  context: EventContext,
) {
  const {accountId, listingId} = context.params;

  try {
    const relatedAccountRef = db
      .collection("listings")
      .doc(listingId)
      .collection("relatedAccounts")
      .doc(accountId);

    const relatedAccountDoc = await relatedAccountRef.get();

    if (!relatedAccountDoc.exists) {
      logger.info(
        `No relatedAccount found for listing ${listingId} and account ${accountId}`,
      );
      return;
    }

    await relatedAccountRef.delete();

    logger.info(
      `Successfully deleted relatedAccount for listing ${listingId} and account ${accountId}`,
    );
  } catch (error) {
    logger.error("Error in handleAccountsRelatedListingDelete:", error);
  }
}
