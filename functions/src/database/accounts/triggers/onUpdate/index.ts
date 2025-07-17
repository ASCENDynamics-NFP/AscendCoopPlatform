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

import {
  onDocumentUpdated,
  Change,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";
import {geocodeAddress} from "../../../../utils/geocoding";

/**
 * Cloud Function triggered when a document in the `accounts` collection is updated.
 */
export const onUpdateAccount = onDocumentUpdated(
  "accounts/{accountId}",
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) => {
    if (!event.data?.after || !event.data?.before) {
      logger.error("Missing before or after data in update event");
      return;
    }

    const after = event.data.after.data();
    const before = event.data.before.data();
    const uid = event.params.accountId;

    try {
      // 1) Existing logic to check & update custom claims if relevant fields changed
      if (
        before.type !== after.type ||
        before.name !== after.name ||
        before.heroImage !== after.heroImage ||
        before.iconImage !== after.iconImage ||
        before.tagline !== after.tagline ||
        before.settings !== after.settings
      ) {
        await admin.auth().setCustomUserClaims(uid, {
          type: after.type,
          displayName: after.name,
          heroImage: after.heroImage,
          iconImage: after.iconImage,
          tagline: after.tagline,
          settings: after.settings,
        });
        logger.info("User type custom claim updated successfully.");
      }

      // 2) Check if addresses changed (simplified approach)
      const addressesBefore = before.contactInformation?.addresses || [];
      const addressesAfter = after.contactInformation?.addresses || [];
      let addressesNeedUpdate = false;

      // If the number of addresses changed, or (optionally) deep-compare each
      if (addressesBefore.length !== addressesAfter.length) {
        addressesNeedUpdate = true;
      } else {
        // If the number of addresses is the same, deep-compare each
        addressesNeedUpdate = addressesBefore.some(
          (
            addr: {street: any; city: any; state: any; country: any},
            index: string | number,
          ) => {
            const afterAddr = addressesAfter[index];
            return (
              addr.street !== afterAddr.street ||
              addr.city !== afterAddr.city ||
              addr.state !== afterAddr.state ||
              addr.country !== afterAddr.country
            );
          },
        );
      }

      if (addressesNeedUpdate) {
        logger.info("Addresses changed; attempting geocode updates...");

        // 3) Loop over each address and geocode if needed
        const newAddresses = await Promise.all(
          addressesAfter.map(async (addr: any) => {
            // If there's no actual address data, skip
            if (!addr.street && !addr.city && !addr.state && !addr.country) {
              return addr;
            }

            const parts = [addr.street, addr.city, addr.state, addr.country]
              .filter(Boolean)
              .join(", ");

            // Call the geocodeAddress UTIL FUNCTION
            const geocoded = await geocodeAddress(parts);
            if (geocoded) {
              // Attach geocoding results
              return {
                ...addr,
                formatted: geocoded.formatted_address,
                geopoint: new admin.firestore.GeoPoint(
                  geocoded.lat,
                  geocoded.lng,
                ),
              };
            } else {
              return addr; // fallback to original address if geocoding fails
            }
          }),
        );

        // 4) Update the Firestore doc with new addresses
        await event.data.after.ref.update({
          "contactInformation.addresses": newAddresses,
        });
        logger.info("Updated addresses with geocoded data");
      }
    } catch (error) {
      logger.error("Error in onUpdateAccount function:", error);
    }
  },
);
