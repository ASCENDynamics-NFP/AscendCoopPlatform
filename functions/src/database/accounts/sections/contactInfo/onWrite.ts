/** Geocode and normalize contact info addresses on subdocument writes */
import {onDocumentWritten} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {admin} from "../../../../utils/firebase";
import {geocodeAddress} from "../../../../utils/geocoding";

export const onWriteContactInfo = onDocumentWritten(
  {
    document: "accounts/{accountId}/sections/contactInfo",
    region: "us-central1",
  },
  async (event) => {
    if (!event.data?.after) return;

    const after =
      (event.data.after.data && event.data.after.data()) ||
      (event.data.after as any).data?.() ||
      {};
    const before = event.data.before
      ? (event.data.before.data && event.data.before.data()) ||
        (event.data.before as any).data?.() ||
        {}
      : {};

    const addressesBefore = before?.addresses || [];
    const addressesAfter = after?.addresses || [];

    // Check if any addresses need geocoding (missing geopoint or address changed)
    let needsUpdate = false;
    const addressesNeedingGeocode: boolean[] = [];

    for (let i = 0; i < addressesAfter.length; i++) {
      const addrAfter = addressesAfter[i];
      const addrBefore = addressesBefore[i];

      // Skip if no meaningful address data
      if (
        !addrAfter?.street &&
        !addrAfter?.city &&
        !addrAfter?.state &&
        !addrAfter?.country
      ) {
        addressesNeedingGeocode.push(false);
        continue;
      }

      // Check if address already has geopoint
      if (addrAfter.geopoint) {
        // If address has geopoint, check if address fields changed
        const beforeStr = addrBefore
          ? [
              addrBefore.street,
              addrBefore.city,
              addrBefore.state,
              addrBefore.country,
            ]
              .filter(Boolean)
              .join(",")
          : "";
        const afterStr = [
          addrAfter.street,
          addrAfter.city,
          addrAfter.state,
          addrAfter.country,
        ]
          .filter(Boolean)
          .join(",");

        if (beforeStr === afterStr) {
          // Address unchanged, keep existing geopoint
          addressesNeedingGeocode.push(false);
          continue;
        }
      }

      // Address needs geocoding (new, changed, or missing geopoint)
      addressesNeedingGeocode.push(true);
      needsUpdate = true;
    }

    if (!needsUpdate) return;

    try {
      logger.info("Geocoding contactInfo addresses for account", {
        accountId: event.params.accountId,
        addressCount: addressesAfter.length,
        addressesNeedingGeocode: addressesNeedingGeocode.filter(Boolean).length,
      });

      const newAddresses = await Promise.all(
        addressesAfter.map(async (addr: any, i: number) => {
          // Skip if this address doesn't need geocoding
          if (!addressesNeedingGeocode[i]) {
            return addr;
          }

          const addrStr = [addr.street, addr.city, addr.state, addr.country]
            .filter(Boolean)
            .join(", ");

          if (!addrStr) return addr;

          const geocoded = await geocodeAddress(addrStr);
          if (geocoded) {
            return {
              ...addr,
              formatted: geocoded.formatted_address,
              geopoint: new admin.firestore.GeoPoint(
                geocoded.lat,
                geocoded.lng,
              ),
            };
          }
          return addr;
        }),
      );

      await event.data.after.ref.update({addresses: newAddresses});
      logger.info("Updated contactInfo addresses with geocoded data", {
        accountId: event.params.accountId,
      });
    } catch (err) {
      logger.error("Error geocoding contactInfo addresses", err);
    }
  },
);
