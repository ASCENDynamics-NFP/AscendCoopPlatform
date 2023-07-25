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

export interface AppRequest {
  createdAt: Timestamp | null; // When the user was added
  createdBy: string | null; // User ID of the user who created the user document
  id: string | null; // The ID of the request
  senderId: string; // The user or group who initiated the request (user-id or group-id)
  receiverId: string; // The user or group the request is directed to (user-id or group-id)
  type: string; // The type of request (friend, group, etc.)
  status: string; // The status of the request (pending, accepted, rejected)
  name: string; // The display name of who initiated the request
  image: string; // The display image of who initiated the request
  description: string; // The display short description of who initiated the request
  lastModifiedAt: Timestamp | null; // When the user document was last modified
  lastModifiedBy: string | null; // User ID of the user who last modified the user document
}
