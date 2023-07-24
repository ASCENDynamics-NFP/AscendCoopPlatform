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
* 
* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* 
* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
*/
import {Timestamp} from "firebase/firestore";

export interface AppUser {
  id: string; // User ID
  lastLoginAt: Timestamp; // When the user last logged in
  lastModifiedAt: Timestamp; // When the user document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the user document
  createdAt: Timestamp; // When the user was added
  createdBy: string; // User ID of the user who created the user document
  bio: string; // Short bio
  tagline: string; // Tagline
  displayName: string; // Full name
  email: string; // Email address
  emailVerified: boolean; // Whether the user's email is verified
  name: string; // First and last name
  profilePicture: string; // base64 string
  locale: string; // User's locale
  language: string; // User's language
  friends: string[]; // Array of user IDs of the user's friends
  pendingFriends: string[]; // Array of user IDs of the user's pending friends
  groups: string[]; // Array of group IDs of the groups the user belongs to
  pendingGroups: string[]; // Array of group IDs of the groups the user has requested to join
  // Other properties...
}
