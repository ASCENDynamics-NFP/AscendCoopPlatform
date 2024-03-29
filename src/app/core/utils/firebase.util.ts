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
import {Timestamp} from "@angular/fire/firestore";

// Preparing data before creating a new document in Firestore
export function prepareDataForCreate(data: any, accountId: string | undefined) {
  if (!accountId) throw new Error("User must have a uid");
  const timestamp = Timestamp.now();
  return {
    ...data,
    createdBy: accountId,
    createdDate: timestamp,
    lastModifiedBy: accountId,
    lastModifiedDate: timestamp,
    relatedAccounts: null, // This is to clear any related accounts before creating a new document
  };
}

// Preparing data before updating an existing document in Firestore
export function prepareDataForUpdate(data: any, accountId: string | undefined) {
  if (!accountId) throw new Error("User must have a uid");
  const timestamp = Timestamp.now();
  return {
    ...data,
    lastModifiedBy: accountId,
    lastModifiedDate: timestamp,
    relatedAccounts: null, // This is to clear any related accounts before updating an existing document
  };
}
