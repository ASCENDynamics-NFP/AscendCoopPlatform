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

export interface AppGroup {
  id: string; // Firestore document ID
  createdAt: Timestamp; // When the group was added
  createdBy: string; // User ID of the user who created the group
  lastModifiedAt: Timestamp; // When the group document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the group
  addressName: string; // Name of place (e.g. Google Building 41)
  addressStreet: string; // Street address (e.g. 123 Main St)
  addressCity: string; // City
  addressState: string; // State
  addressZipcode: string; // Zip code
  addressCountry: string; // Country
  addressFormatted: string; // Formatted address (e.g. 123 Main St, Anytown, CA 12345, USA)
  addressGeopoint: string; // Geopoint (e.g. 37.4219983,-122.084)
  tagline: string; // Tagline
  name: string; // Name of group
  members: string[]; // User IDs of members of group
  pendingMembers: string[]; // User IDs of pending members of group
  relatedGroups: string[]; // Group IDs of related groups
  pendingRelatedGroups: string[]; // Group IDs of pending related groups
  admins: string[]; // User IDs of admins of group
  description: string; // Description of group
  groupPicture: string; // base64 string
  iconImage: string; // base64 string
  heroImage: string; // base64 string
  phoneCountryCode: string; // Phone country code (e.g. 1 for US)
  number: string; // Phone number (e.g. 1234567890)
  email: string; // Contact email
  dateFounded: Timestamp; // Date founded
  supportedlanguages: string[] | undefined; // Supported languages
  // Other properties...
}
