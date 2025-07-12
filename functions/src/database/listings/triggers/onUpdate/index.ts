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
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {EventContext} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";
import {geocodeAddress} from "../../../../utils/geocoding"; // Import your geocode utility

const db = admin.firestore();

/**
 * Firebase Cloud Function trigger that handles updates to listing documents.
 * Updates all related documents when a listing is modified and geocodes addresses if they've changed.
 */
export const onUpdateListing = functions.firestore
  .document("listings/{listingId}")
  .onUpdate(handleListingUpdate);

/**
 * Handles updates to a listing document in Firestore.
 * 1. Check for address changes; if changed, geocode each address and update the listing doc.
 * 2. Update all relatedAccount docs in `listings/{listingId}/relatedAccounts`
 * 3. Update all relatedListing docs in `accounts/{accountId}/relatedListings`
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

  // -----------------------
  // 1) Address change logic
  // -----------------------
  const addressesBefore = previousListing.contactInformation.addresses || [];
  const addressesAfter = updatedListing.contactInformation.addresses || [];
  let addressesNeedUpdate = false;

  // Compare lengths
  if (addressesBefore.length !== addressesAfter.length) {
    addressesNeedUpdate = true;
  } else {
    // Deep-compare fields in each address if you want thorough checks
    addressesNeedUpdate = addressesBefore.some((addr: any, i: number) => {
      const afterAddr = addressesAfter[i];
      return (
        addr.street !== afterAddr.street ||
        addr.city !== afterAddr.city ||
        addr.state !== afterAddr.state ||
        addr.country !== afterAddr.country
      );
    });
  }

  // If addresses changed, geocode them
  if (addressesNeedUpdate) {
    logger.info(
      `Listing addresses changed; attempting geocode for ${listingId}...`,
    );

    const newAddresses = await Promise.all(
      addressesAfter.map(async (addr: any) => {
        // Skip if no actual address data
        if (!addr.street && !addr.city && !addr.state && !addr.country) {
          return addr;
        }

        // Build string like "123 Main St, Springfield, IL, USA"
        const parts = [addr.street, addr.city, addr.state, addr.country]
          .filter(Boolean)
          .join(", ");

        // Call the geocoding utility
        const geocoded = await geocodeAddress(parts);
        if (geocoded) {
          return {
            ...addr,
            formatted: geocoded.formatted_address,
            geopoint: new admin.firestore.GeoPoint(geocoded.lat, geocoded.lng),
          };
        } else {
          return addr; // fallback to original if geocoding fails
        }
      }),
    );

    // Update the listing doc with newly geocoded addresses
    await change.after.ref.update({
      contactInformation: {addresses: newAddresses},
    });
    logger.info(`Geocoded addresses for listing ${listingId}`);
  }

  // ----------------------------
  // 2) Relationship update logic
  // ----------------------------
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

  // If no relevant changes for relationships, we can skip the update
  if (!hasAccountChanges && !hasListingChanges) {
    logger.info("No relevant changes detected for relationship documents");
    return;
  }

  // Proceed with existing logic to update related documents
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

      // Build updates for the relatedAccount
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

      // Build updates for the relatedListing
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

      // Update both
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
