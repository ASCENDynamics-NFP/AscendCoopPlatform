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
 * This function is triggered when a new listing is created and updates it with additional metadata
 * including creator information and timestamps.
 *
 * @param {QueryDocumentSnapshot} snapshot - The snapshot of the newly created listing document
 * @param {EventContext} context - The context object containing metadata about the event
 * @return {Promise<void>} A promise that resolves when the listing has been updated
 */
async function handleListingCreate(
  snapshot: QueryDocumentSnapshot,
  context: EventContext,
) {
  const listingId = context.params.listingId;
  const listing = snapshot.data();
  const accountId = listing.createdBy;

  try {
    if (!accountId) {
      logger.error(`No authenticated user found for listing ${listingId}`);
      return;
    }

    const accountDoc = await db.collection("accounts").doc(accountId).get();

    if (!accountDoc.exists) {
      logger.error(`Account ${accountId} not found`);
      return;
    }

    const account = accountDoc.data();

    const listingUpdate = {
      createdBy: accountId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModifiedBy: accountId,
      heroImage: account?.heroImage,
      iconImage: account?.iconImage,
    };

    await snapshot.ref.update(listingUpdate);
    logger.info(
      `Successfully updated listing ${listingId} with account information`,
    );
  } catch (error) {
    logger.error("Error updating listing with account information: ", error);
  }
}
