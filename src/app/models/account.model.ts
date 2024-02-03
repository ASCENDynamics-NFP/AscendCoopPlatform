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
  type: string;
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

type LegalAgreement = {
  accepted: boolean;
  datetime: Timestamp;
  version: string;
};

type LegalAgreements = {
  termsOfService: LegalAgreement;
  privacyPolicy: LegalAgreement;
};

export type Account = BaseDocument & {
  id: string;
  type: "user" | "group";
  name: string;
  description: string;
  lastLoginAt: Timestamp;
  relatedAccounts: Partial<RelatedAccount>[];
  address: Address;
  tagline: string;
  email: string;
  emailVerified: boolean;
  phone: Phone;
  legalAgreements: LegalAgreements;
  language: string;
  associations: Associations;
  userDetails?: UserSpecific;
  groupDetails?: GroupSpecific;
  privacySetting:
    | "public"
    | "accepted-users-only"
    | "accepted-groups-only"
    | "private"; // Privacy setting
  iconImage: string;
  heroImage: string;
};

export type RelatedAccount = BaseDocument & {
  id: string; // The ID of the related account
  name: string; // Name of the related user or group
  iconImage: string; // URL or path to the icon image
  tagline: string; // Tagline or short description
  type: "user" | "group"; // Type of the related account
  status: "pending" | "accepted" | "rejected" | "blocked"; // Relationship status
  relationship: "admin" | "friend" | "member" | "partner"; // Details about the relationship (e.g., 'friend', 'member')
  initiatorId: string; // ID of the account who initiated the request
  targetId: string; // ID of the account who received the request
};
