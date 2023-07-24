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

export interface AppRelationship {
  createdAt: Timestamp; // When the user was added
  createdBy: string; // User ID of the user who created the user document
  id: string | null; // The ID of the request
  senderId: string; // The user or group who initiated the request (user-id or group-id)
  receiverId: string; // The user or group the request is directed to (user-id or group-id)
  type: string; // The type of request (friend, group, etc.)
  status: string; // The status of the request (pending, accepted, rejected)
  membershipRole: string; // The role of the user in the group (admin, member, etc.)
  receiverRelationship: string; // The relationship of the receiver to the sender ('mother', 'sibling', 'parent', 'child', 'external', etc.)
  senderRelationship: string; // The relationship of the sender to the receiver ('mother', 'sibling', 'parent', 'child', 'external', etc.)
  senderName: string; // The display name of who initiated the request
  senderImage: string; // The display image of who initiated the request
  senderTagline: string; // The display tagline of who initiated the request
  receiverName: string; // The display name of who the request is directed to
  receiverImage: string; // The display image of who the request is directed to
  receiverTagline: string; // The display tagline of who the request is directed to
  lastModifiedAt: Timestamp; // When the user document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the user document
}
