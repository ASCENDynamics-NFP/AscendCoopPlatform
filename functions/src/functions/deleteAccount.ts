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
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {admin} from "../utils/firebase";
import {logger} from "firebase-functions/v2";

/**
 * Cloud Function to delete a user account and all related data.
 * This function deletes the user from Firebase Auth, which automatically
 * triggers the onUserRecordDeletion function to clean up Firestore data.
 */
export const deleteAccount = onCall(
  {region: "us-central1"},
  async (request) => {
    const {auth} = request;

    // Check if user is authenticated
    if (!auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const uid = auth.uid;

    try {
      logger.info(`Initiating account deletion for user: ${uid}`);

      // Delete user from Firebase Authentication
      // This will automatically trigger onUserRecordDeletion to clean up Firestore data
      await admin.auth().deleteUser(uid);

      logger.info(`Successfully deleted Firebase Auth user: ${uid}`);
      logger.info(`onUserRecordDeletion trigger will handle Firestore cleanup`);

      return {
        success: true,
        message: "Account deleted successfully",
      };
    } catch (error) {
      logger.error(`Error deleting account for user ${uid}:`, error);

      // Return specific error messages based on the type of error
      if (error instanceof Error) {
        throw new HttpsError(
          "internal",
          `Failed to delete account: ${error.message}`,
        );
      }

      throw new HttpsError(
        "internal",
        "An unexpected error occurred while deleting the account",
      );
    }
  },
);
