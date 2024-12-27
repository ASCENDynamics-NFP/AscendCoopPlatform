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
import {geocodeAddress} from "../../../../utils/geocoding"; // <-- using the same utility

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
 * - Geocodes the listing's addresses array (if present)
 * - Creates a relatedAccount document in `listings/{listingId}/relatedAccounts`
 * - Creates a relatedListing document in `accounts/{accountId}/relatedListings`
 * Both documents are linked to the listing creator with "owner" relationship status.
 *
 * @param {QueryDocumentSnapshot} snapshot - The snapshot of the newly created listing document.
 * @param {EventContext} context - The context object containing metadata about the event, including the listing ID.
 * @return {Promise<void>} A promise that resolves when both relationship documents are created, or logs an error if it fails.
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
    // 1) Geocode addresses if any are present
    const addresses: any[] = listing.contactInformation.addresses || [];

    if (addresses.length > 0) {
      logger.info(
        `Found ${addresses.length} addresses for listing ${listingId}; attempting geocode...`,
      );

      // Iterate over the addresses, geocode each
      const geocodedAddresses = await Promise.all(
        addresses.map(async (addr: any) => {
          // Skip if it doesn't have meaningful address data
          if (!addr.street && !addr.city && !addr.state && !addr.country) {
            return addr; // just return as-is
          }

          const parts = [addr.street, addr.city, addr.state, addr.country]
            .filter(Boolean)
            .join(", ");

          // Call the geocodeAddress utility
          const geocoded = await geocodeAddress(parts);

          if (geocoded) {
            return {
              ...addr,
              formatted: geocoded.formatted_address,
              geopoint: new admin.firestore.GeoPoint(
                geocoded.lat,
                geocoded.lng,
              ),
            };
          } else {
            return addr; // fallback to original if geocoding fails
          }
        }),
      );

      // 2) Update the listing doc with geocoded addresses
      await snapshot.ref.update({
        contactInformation: {addresses: geocodedAddresses},
      });
      logger.info(`Successfully geocoded addresses for listing ${listingId}`);
    } else {
      logger.info(`No addresses to geocode for listing ${listingId}`);
    }

    // 3) Set up the relationship docs
    const accountDoc = await db.collection("accounts").doc(accountId).get();
    if (!accountDoc.exists) {
      logger.error(`Account ${accountId} not found`);
      return;
    }

    const account = accountDoc.data();

    // Create relatedAccount document
    const relatedAccount: any = {
      id: accountId,
      listingId: listingId,
      name: account?.name,
      email: account?.email,
      phone: account?.phone ?? null,
      iconImage: account?.iconImage ?? null,
      status: "active",
      relationship: "owner",
      applicationDate: admin.firestore.FieldValue.serverTimestamp(),
      notes: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: accountId,
      lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModifiedBy: accountId,
    };

    // Create relatedListing document
    const relatedListing: any = {
      id: listingId,
      accountId: accountId,
      title: listing.title,
      organization: listing.organization,
      type: listing.type,
      remote: listing.remote ?? false,
      iconImage: listing.iconImage ?? null,
      status: listing.status,
      relationship: "owner",
      applicationDate: admin.firestore.FieldValue.serverTimestamp(),
      notes: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: accountId,
      lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModifiedBy: accountId,
    };

    await Promise.all([
      db
        .collection("listings")
        .doc(listingId)
        .collection("relatedAccounts")
        .doc(accountId)
        .set(relatedAccount),
      db
        .collection("accounts")
        .doc(accountId)
        .collection("relatedListings")
        .doc(listingId)
        .set(relatedListing),
    ]);

    logger.info(
      `Successfully created relatedAccount and relatedListing for listing ${listingId} and account ${accountId}`,
    );
  } catch (error) {
    logger.error("Error creating listing or relationship documents: ", error);
  }
}
