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

type Address = {
  name: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  formatted: string;
  geopoint: string; // or a more specific geopoint type
};

type Phone = {
  countryCode: string;
  number: string;
  phoneType: string;
};

type Associations = {
  accounts: string[];
  feedback: string[];
};

type UserSpecific = {
  dateOfBirth: Timestamp;
  firstName: string;
  lastName: string;
  username: string;
};

type GroupSpecific = {
  admins: string[];
  dateFounded: Timestamp;
  supportedLanguages: string[];
};

export type Account = {
  id: string;
  type: "user" | "group";
  name: string;
  createdAt: Timestamp;
  createdBy: string;
  description: string;
  lastLoginAt: Timestamp;
  lastModifiedAt: Timestamp;
  lastModifiedBy: string;
  address: Address;
  tagline: string;
  email: string;
  emailVerified: boolean;
  phone: Phone[];
  language: string;
  associations: Associations;
  userDetails?: UserSpecific;
  groupDetails?: GroupSpecific;
  privacySetting: "public" | "users-only" | "groups-only" | "private"; // Privacy setting
  iconImage: string;
  heroImage: string;
};
