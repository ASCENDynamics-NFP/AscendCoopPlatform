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

    let needsUpdate = false;
    if (addressesBefore.length !== addressesAfter.length) {
      needsUpdate = true;
    } else if (addressesAfter.length > 0) {
      needsUpdate = addressesBefore.some((addr: any, i: number) => {
        const b = [addr?.street, addr?.city, addr?.state, addr?.country].join(
          ",",
        );
        const a = [
          addressesAfter[i]?.street,
          addressesAfter[i]?.city,
          addressesAfter[i]?.state,
          addressesAfter[i]?.country,
        ].join(",");
        return b !== a;
      });
    }

    if (!needsUpdate) return;

    try {
      logger.info("Geocoding contactInfo addresses for account", {
        accountId: event.params.accountId,
      });

      const newAddresses = await Promise.all(
        (addressesAfter || []).map(async (addr: any) => {
          if (!addr?.street && !addr?.city && !addr?.state && !addr?.country) {
            return addr;
          }
          const addrStr = [addr.street, addr.city, addr.state, addr.country]
            .filter(Boolean)
            .join(", ");
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
