/**
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
import * as functions from "firebase-functions/v1";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {AccountService} from "../../../../services/accountService";

// Triggered when a user is deleted from Firebase Authentication
// Note: Firebase Functions v2 doesn't have an equivalent for auth user deletion
// so we keep this as v1
export const onUserRecordDeletion = functions
  .region("us-central1")
  .auth.user()
  .onDelete(async (user: admin.auth.UserRecord) => {
    try {
      // Centralized cleanup of all Firestore data for this account
      await AccountService.purgeAccountData(user.uid);
      logger.info(
        `Account and related data for ${user.uid} deleted successfully.`,
      );
    } catch (error) {
      logger.error(`Error deleting account data for ${user.uid}:`, error);
      // Log the error, as throwing won't affect Firebase's handling of the deletion
    }
  });
