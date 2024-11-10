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
// src/app/models/auth-user.model.ts

import {ParsedToken} from "firebase/auth";
import {Settings} from "./account.model";

export interface AuthUser {
  uid: string;
  displayName: string | null;
  name?: string | null;
  email: string | null;
  emailVerified: boolean;
  heroImage: string | null;
  iconImage: string | null;
  tagline: string | null;
  type: string | null;
  createdAt: Date | null;
  lastLoginAt: Date | null;
  phoneNumber?: string | null;
  providerData: any[];
  settings?: Settings;
  claims?: ParsedToken;
}
