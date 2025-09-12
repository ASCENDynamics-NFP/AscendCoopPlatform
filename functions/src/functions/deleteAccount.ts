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
import {logger} from "firebase-functions/v2";
import {admin} from "../utils/firebase";
import {AccountService} from "../services/accountService";

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
      logger.info(`Initiating full account deletion for user: ${uid}`);

      // Use centralized service to delete Firestore data (including subcollections)
      // and the Auth user in a consistent, robust flow.
      // 1) Purge Firestore account data (sections + root + references)
      await AccountService.purgeAccountData(uid);

      // 2) Delete Auth user
      try {
        await admin.auth().deleteUser(uid);
      } catch (e: any) {
        if (e?.code !== "auth/user-not-found") throw e;
      }

      // 3) Fallback verification
      const db = admin.firestore();
      const accRef = db.collection("accounts").doc(uid);
      const accSnap = await accRef.get();
      if (accSnap.exists) {
        logger.warn(
          `Account root doc still exists; deleting explicitly: ${uid}`,
        );
        await accRef.delete();
      }
      try {
        await admin.auth().getUser(uid);
        logger.warn(`Auth user still exists; deleting explicitly: ${uid}`);
        await admin.auth().deleteUser(uid);
      } catch (e: any) {
        if (e?.code !== "auth/user-not-found") throw e;
      }

      logger.info(`Successfully deleted account and user: ${uid}`);

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
