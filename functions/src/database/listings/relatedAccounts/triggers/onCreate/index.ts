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
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

admin.initializeApp();

const db = admin.firestore();

// Existing triggers...

// New trigger for applicantAccounts onCreate
export const onCreateApplicantAccount = functions.firestore
  .document("listings/{listingId}/applicantAccounts/{accountId}")
  .onCreate(handleApplicantAccountCreate);

/**
 * Handles the creation of a new applicantAccount document in Firestore.
 * When a user applies to a listing, this function creates a relatedListing
 * document under the applicant's account, linking the account to the listing.
 *
 * @param {QueryDocumentSnapshot} snapshot - The snapshot of the newly created applicantAccount document.
 * @param {EventContext} context - The context object containing metadata about the event, including listingId and accountId.
 * @return {Promise<void>} A promise that resolves when the relatedListing document is created, or logs an error if it fails.
 */
async function handleApplicantAccountCreate(
  snapshot: QueryDocumentSnapshot,
  context: EventContext,
) {
  const {listingId, accountId} = context.params;
  const applicantAccount = snapshot.data();

  try {
    // Fetch the listing details
    const listingDoc = await db.collection("listings").doc(listingId).get();

    if (!listingDoc.exists) {
      logger.error(`Listing ${listingId} not found.`);
      return;
    }

    const listing = listingDoc.data();

    // Create the relatedListing document
    const relatedListing: any = {
      id: listingId,
      accountId: accountId,
      title: listing?.title,
      type: listing?.type,
      remote: listing?.remote ?? false,
      iconImage: listing?.iconImage ?? null,
      status: listing?.status,
      relationship: "applicant",
      applicationDate:
        applicantAccount.applicationDate ??
        admin.firestore.FieldValue.serverTimestamp(),
      notes: applicantAccount.notes ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: accountId,
      lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModifiedBy: accountId,
    };

    await db
      .collection("accounts")
      .doc(accountId)
      .collection("relatedListings")
      .doc(listingId)
      .set(relatedListing);

    logger.info(
      `Successfully created relatedListing for account ${accountId} and listing ${listingId}`,
    );
  } catch (error) {
    logger.error("Error in handleApplicantAccountCreate:", error);
  }
}
