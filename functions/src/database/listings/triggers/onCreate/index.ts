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
import {EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Reference to the Firestore database
const db = admin.firestore();

export const onCreateListing = functions.firestore
  .document("listings/{listingId}")
  .onCreate(handleListingCreate);

/**
 * Handles the creation of a new listing document in Firestore.
 * This function is triggered when a new listing is created and creates a relatedListing
 * document in the `relatedListings` sub-collection under the associated account's document.
 * The relatedListing is linked to the listing and includes metadata such as the relationship
 * to the account (set as "owner") and the status of the listing.
 *
 * @param {QueryDocumentSnapshot} snapshot - The snapshot of the newly created listing document.
 * @param {EventContext} context - The context object containing metadata about the event, including the listing ID.
 * @return {Promise<void>} A promise that resolves when the relatedListing document is created, or logs an error if it fails.
 */
async function handleListingCreate(
  snapshot: QueryDocumentSnapshot,
  context: EventContext,
) {
  const listingId = context.params.listingId;
  const listing = snapshot.data();
  const accountId = listing.createdBy;

  if (!accountId) {
    logger.error(`No authenticated user found for listing ${listingId}`);
    return;
  }

  try {
    const accountDoc = await db.collection("accounts").doc(accountId).get();

    if (!accountDoc.exists) {
      logger.error(`Account ${accountId} not found`);
      return;
    }

    // Create the relatedListing document
    const relatedListing: any = {
      id: listingId,
      accountId: accountId,
      title: listing.title,
      organization: listing.organization,
      type: listing.type,
      remote: listing.remote ?? false,
      iconImage: listing.iconImage ?? null,
      status: listing.status,
      relationship: "owner", // Set to owner
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
    logger.error("Error creating relatedListing document: ", error);
  }
}
