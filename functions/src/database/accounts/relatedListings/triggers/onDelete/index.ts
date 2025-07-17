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

import {onDocumentDeleted, FirestoreEvent} from "firebase-functions/v2/firestore";
import {admin} from "../../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

const db = admin.firestore();

// New trigger for relatedListings onDelete
export const onDeleteAccountsRelatedListing = onDocumentDeleted(
  {
    document: "accounts/{accountId}/relatedListings/{listingId}",
    region: "us-central1",
  },
  handleAccountsRelatedListingDelete,
);

/**
 * Handles the deletion of a relatedListing document in Firestore.
 * When a user removes a relatedListing from their account,
 * this function deletes the corresponding relatedAccount document
 * under the listing, unlinking the account from the listing.
 *
 * @param {FirestoreEvent<QueryDocumentSnapshot>} event - The event for the deleted document.
 * @return {Promise<void>} A promise that resolves when the relatedAccount document is deleted, or logs an error if it fails.
*/
async function handleAccountsRelatedListingDelete(
  event: FirestoreEvent<QueryDocumentSnapshot>,
) {
  const {accountId, listingId} = event.params;

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
