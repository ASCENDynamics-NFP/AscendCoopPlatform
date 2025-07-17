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
// utils/geocoding.ts

import fetch from "node-fetch";
import * as logger from "firebase-functions/logger";
import {defineSecret} from "firebase-functions/params";

/**
 * Represents a geocoding result from Google's Geocoding API
 */
export interface GeocodeResult {
  formatted_address: string;
  lat: number;
  lng: number;
}

// Define the secret
const googleApiKey = defineSecret("GOOGLE_API_KEY");

/**
 * Geocode an address string using Google's Geocoding API
 *
 * @param {string} address - The address string to geocode
 * @return {Promise<GeocodeResult | null>} A promise that resolves to a `GeocodeResult` or `null` if not found
 */
export async function geocodeAddress(
  address: string,
): Promise<GeocodeResult | null> {
  if (!address) {
    logger.warn("geocodeAddress called without an address");
    return null;
  }

  try {
    const apiKey = googleApiKey.value();

    if (!apiKey) {
      logger.error(
        "Google API key is missing. Please set GOOGLE_API_KEY secret.",
      );
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${apiKey}`;

    const res = await fetch(url);
    const data = (await res.json()) as any;

    if (data.status === "OK" && data.results.length > 0) {
      const first = data.results[0];
      return {
        formatted_address: first.formatted_address,
        lat: first.geometry.location.lat,
        lng: first.geometry.location.lng,
      };
    } else {
      logger.warn("Geocoding not successful:", data);
      return null;
    }
  } catch (err) {
    logger.error("Geocoding error:", err);
    return null;
  }
}
