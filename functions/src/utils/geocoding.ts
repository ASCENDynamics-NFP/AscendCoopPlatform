// utils/geocoding.ts
import fetch from "node-fetch";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";

/**
 * Represents a geocoding result from Google’s Geocoding API
 */
export interface GeocodeResult {
  formatted_address: string;
  lat: number;
  lng: number;
}

// Centralize the API Key (from config or environment)
const apiKey = functions.config().google?.apikey || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  logger.error("Google API key is missing. Please set it in Firebase config.");
  throw new Error("Missing Google API Key. Set it in Firebase config.");
}

/**
 * Geocode an address string using Google’s Geocoding API
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

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
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
