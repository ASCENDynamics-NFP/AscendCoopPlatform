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

/** Firebase Cloud Function for Homepage Listings */
import {onRequest} from "firebase-functions/v2/https";
import {admin} from "../../utils/firebase";

/**
 * Calculate distance between two latitude/longitude points using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @return {number} The distance between the two points in kilometers.
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Extract the closest geopoint from an array of addresses based on proximity.
 *
 * @param {Array<any>} addresses - The list of addresses to evaluate.
 * @param {number} queryLat - Latitude from the query.
 * @param {number} queryLon - Longitude from the query.
 * @return {number | null} The closest distance in kilometers, or null if no valid geopoints are found.
 */
function getClosestGeopoint(
  addresses: {
    remote?: boolean;
    geopoint?: {latitude: number; longitude: number};
  }[],
  queryLat: number,
  queryLon: number,
): number | null {
  if (!addresses || !Array.isArray(addresses)) return null;

  let closestDistance: number | null = null;

  for (const address of addresses) {
    if (address.remote === true) {
      return 0; // Prioritize remote listings as the closest
    }

    if (address.geopoint?.latitude && address.geopoint?.longitude) {
      const distance = calculateDistance(
        queryLat,
        queryLon,
        address.geopoint.latitude,
        address.geopoint.longitude,
      );

      if (closestDistance === null || distance < closestDistance) {
        closestDistance = distance;
      }
    }
  }

  return closestDistance;
}

/**
 * Fetch homepage listings with optional geolocation sorting and remote filtering.
 *
 * @return {Promise<void>} A promise that resolves once the response is sent.
 */
export const getHomepageListings = onRequest(
  {region: "us-central1", timeoutSeconds: 60, memory: "256MiB", cors: true},
  async (req, res): Promise<void> => {
    try {
      const {
        limit = 4,
        status = "active",
        latitude,
        longitude,
        category,
      } = req.query;

      // ✅ Validate Inputs
      const queryLimit = Math.min(
        Math.max(parseInt(limit as string) || 4, 1),
        100,
      );
      const queryStatus = typeof status === "string" ? status : "active";
      const queryCategory =
        category && typeof category === "string" ? category : null;

      const queryLatitude = latitude ? parseFloat(latitude as string) : null;
      const queryLongitude = longitude ? parseFloat(longitude as string) : null;

      // ✅ Fetch More Data Initially
      let query = admin
        .firestore()
        .collection("listings")
        .where("status", "==", queryStatus)
        .limit(queryLimit * 3); // Fetch 3x the limit initially

      if (queryCategory) {
        query = query.where("category", "==", queryCategory);
      }

      const snapshot = await query.get();
      let listings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Apply Geolocation Filtering and Remote Inclusion
      listings = listings
        .filter(
          (listing) =>
            (listing as any).contactInformation?.addresses?.length > 0,
        )
        .map((listing) => {
          const addresses = (listing as any).contactInformation.addresses;
          const closestDistance = getClosestGeopoint(
            addresses,
            queryLatitude || 0,
            queryLongitude || 0,
          );

          return {
            ...listing,
            distance:
              closestDistance !== null ? closestDistance : Number.MAX_VALUE,
          };
        })
        .sort((a, b) => a.distance - b.distance) // Sort by proximity or remote first
        .slice(0, queryLimit); // Apply final limit

      res.status(200).json(listings);
    } catch (error) {
      console.error("Error fetching homepage listings:", error);
      res.status(500).json({error: "Internal server error"});
    }
  },
);
