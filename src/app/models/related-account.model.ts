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
import {BaseDocument} from "./base-document";

export type RelatedAccount = BaseDocument & {
  id: string; // The ID of the related account
  name: string; // Name of the related user or group
  iconImage: string; // URL or path to the icon image
  tagline: string; // Tagline or short description
  type: "user" | "group"; // Type of the related account
  status: "pending" | "accepted" | "rejected"; // Relationship status
  relationship: string; // Details about the relationship (e.g., 'friend', 'member')
};
