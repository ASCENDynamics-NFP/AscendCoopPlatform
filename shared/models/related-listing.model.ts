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
import {ListingType} from "./listing.model";
import {Timestamp, FieldValue} from "firebase/firestore";

export interface RelatedListing extends BaseDocument {
  title: string;
  organization: string;
  type: ListingType;
  remote: boolean;
  heroImage?: string;
  iconImage?: string;
  status: "draft" | "active" | "filled" | "expired";
  relationship: "owner" | "applicant" | "participant";
  /**
   * Optional explicit flag indicating this listing is saved/favorited by the user.
   * Kept alongside legacy relationship === 'saved' for backward compatibility.
   */
  isSaved?: boolean;
  applicationDate?: Timestamp | FieldValue;
  notes?: string;
  accountId: string; // Reference to the parent account
}
