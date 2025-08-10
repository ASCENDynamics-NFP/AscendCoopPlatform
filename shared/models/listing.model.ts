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
import {ContactInformation} from "./account.model";
import {Timestamp} from "firebase/firestore";
import {BaseDocument} from "./base-document";

export type ListingType = "volunteer" | "job" | "internship" | "gig";

export interface SkillRequirement {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  required: boolean;
}

export interface TimeCommitment {
  hoursPerWeek: number;
  duration: string;
  schedule: string;
  startDate: Timestamp;
  endDate: Timestamp;
  isFlexible: boolean;
}

export interface Listing extends BaseDocument {
  title: string;
  description: string;
  type: ListingType;
  organization: string;
  remote: boolean;
  skills: SkillRequirement[];
  timeCommitment: TimeCommitment;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  iconImage?: string;
  heroImage?: string;
  contactInformation: ContactInformation;
  status: "draft" | "active" | "filled" | "expired";
}
