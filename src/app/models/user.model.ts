/***********************************************************************************************
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
import {Timestamp} from "firebase/firestore";

export interface AppUser {
  id: string; // User ID
  lastLoginAt: Timestamp; // When the user last logged in
  lastModifiedAt: Timestamp; // When the user document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the user document
  createdAt: Timestamp; // When the user was added
  createdBy: string; // User ID of the user who created the user document
  addressName: string; // Name of place (e.g. Google Building 41)
  addressStreet: string; // Street address (e.g. 123 Main St)
  addressCity: string; // City
  addressState: string; // State
  addressZipcode: string; // Zip code
  addressCountry: string; // Country
  addressFormatted: string; // Formatted address (e.g. 123 Main St, Anytown, CA 12345, USA)
  addressGeopoint: string; // Geopoint (e.g. 37.4219983,-122.084)
  description: string; // Short description
  tagline: string; // Tagline
  displayName: string; // Full name
  email: string; // Email address
  emailVerified: boolean; // Whether the user's email is verified
  name: string; // First and last name
  heroImage: string; // base64 string
  iconImage: string; // base64 string
  dateOfBirth: Timestamp; // Birthday
  language: string; // User's language
  friends: string[]; // Array of user IDs of the user's friends
  pendingFriends: string[]; // Array of user IDs of the user's pending friends
  groups: string[]; // Array of group IDs of the groups the user belongs to
  pendingGroups: string[]; // Array of group IDs of the groups the user has requested to join
  phoneCountryCode: string; // Phone country code (e.g. 1 for US)
  phoneNumber: string; // Phone number (e.g. 1234567890)
  phoneType: string; // Phone type (mobile, landline, etc.)
  privacySetting: "public" | "friends-only" | "private"; // Privacy setting
  // Other properties...
}
