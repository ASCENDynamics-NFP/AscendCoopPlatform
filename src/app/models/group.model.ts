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

export interface Group {
  createdAt: Timestamp; // When the group was added
  createdBy: string | null; // User ID of the user who created the group
  description: string | null; // Description of group
  groupPicture: string | null; // base64 string
  id: string | null; // Firestore document ID
  lastModifiedAt: Timestamp | null; // When the group document was last modified
  lastModifiedBy: string | null; // User ID of the user who last modified the group
  // lastModifiedByDisplayName: string | null; // Display name of the user who last modified the group
  name: string; // Name of group
  // Other properties...
}
