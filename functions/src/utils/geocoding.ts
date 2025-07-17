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
import {defineString} from "firebase-functions/params";

/**
 * Represents a geocoding result from Google's Geocoding API
 */
export interface GeocodeResult {
  formatted_address: string;
  lat: number;
  lng: number;
}

// Define the Google API key parameter
const googleApiKey = defineString("GOOGLE_API_KEY", {
  description: "Google Maps API key for geocoding",
  default: "",
});

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

  // Get API key at runtime
  const apiKey = googleApiKey.value();

  if (!apiKey) {
    logger.warn(
      "Google API key is missing. Geocoding disabled. Set GOOGLE_API_KEY parameter.",
    );
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${apiKey}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      logger.error(`HTTP error! status: ${res.status}`);
      return null;
    }

    const data = await res.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const first = data.results[0];

      if (!first.geometry?.location) {
        logger.warn("No geometry location in geocoding result");
        return null;
      }

      return {
        formatted_address: first.formatted_address || address,
        lat: first.geometry.location.lat,
        lng: first.geometry.location.lng,
      };
    } else {
      logger.warn("Geocoding not successful:", {
        status: data.status,
        error_message: data.error_message,
      });
      return null;
    }
  } catch (err) {
    logger.error("Geocoding error:", err);
    return null;
  }
}
