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
// functions/src/database/listings/relatedAccounts/triggers/onUpdate/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Firebase Cloud Function trigger that handles updates to listing documents.
 * Updates all related relatedListing documents when a listing is modified.
 */
export const onUpdateListing = functions.firestore
  .document("listings/{listingId}")
  .onUpdate(handleListingUpdate);

/**
 * Handles updates to a listing document in Firestore.
 * When a listing is updated, this function maintains bidirectional data consistency by:
 * 1. Updating all relatedAccount documents in the `listings/{listingId}/relatedAccounts` collection
 * 2. Updating all relatedListing documents in the `accounts/{accountId}/relatedListings` collection
 * Fresh account data is fetched to ensure accuracy of the updates.
 *
 * @param {functions.Change<QueryDocumentSnapshot>} change - Contains both the previous and current versions of the document
 * @param {EventContext} context - The context object containing metadata about the event
 * @return {Promise<void>} A promise that resolves when all relationship documents are updated
 */
async function handleListingUpdate(
  change: functions.Change<QueryDocumentSnapshot>,
  context: EventContext,
) {
  const listingId = context.params.listingId;
  const updatedListing = change.after.data();
  const previousListing = change.before.data();

  // Check specific fields that affect relatedAccounts
  const hasAccountChanges = [
    "name",
    "email",
    "phone",
    "iconImage",
    "status",
  ].some((field) => previousListing[field] !== updatedListing[field]);

  // Check specific fields that affect relatedListings
  const hasListingChanges = [
    "title",
    "organization",
    "type",
    "remote",
    "iconImage",
    "status",
  ].some((field) => previousListing[field] !== updatedListing[field]);

  if (!hasAccountChanges && !hasListingChanges) {
    logger.info("No relevant changes detected for relationship documents");
    return;
  }

  try {
    const relatedAccountsSnapshot = await db
      .collection("listings")
      .doc(listingId)
      .collection("relatedAccounts")
      .get();

    const updatePromises = relatedAccountsSnapshot.docs.map(async (doc) => {
      const accountId = doc.id;
      const accountDoc = await db.collection("accounts").doc(accountId).get();
      const currentRelatedAccount = doc.data();

      if (!accountDoc.exists) {
        logger.error(`Account ${accountId} not found for listing ${listingId}`);
        return;
      }

      const account = accountDoc.data();

      const relatedAccountUpdate = {
        id: accountId,
        listingId: listingId,
        name: account?.name,
        email: account?.email,
        phone: account?.phone ?? null,
        iconImage: account?.iconImage ?? null,
        status: currentRelatedAccount.status,
        relationship: currentRelatedAccount.relationship,
        lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastModifiedBy: updatedListing.lastModifiedBy,
      };

      const relatedListingUpdate = {
        id: listingId,
        accountId: accountId,
        title: updatedListing.title,
        organization: updatedListing.organization,
        type: updatedListing.type,
        remote: updatedListing.remote ?? false,
        iconImage: updatedListing.iconImage ?? null,
        status: updatedListing.status,
        relationship: currentRelatedAccount.relationship,
        lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastModifiedBy: updatedListing.lastModifiedBy,
      };

      return Promise.all([
        db
          .collection("listings")
          .doc(listingId)
          .collection("relatedAccounts")
          .doc(accountId)
          .update(relatedAccountUpdate),
        db
          .collection("accounts")
          .doc(accountId)
          .collection("relatedListings")
          .doc(listingId)
          .update(relatedListingUpdate),
      ]);
    });

    await Promise.all(updatePromises);

    logger.info(
      `Successfully updated all relationship documents for listing ${listingId}`,
    );
  } catch (error) {
    logger.error("Error updating relationship documents:", error);
  }
}
