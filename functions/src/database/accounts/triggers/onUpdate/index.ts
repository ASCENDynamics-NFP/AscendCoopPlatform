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

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Reference to the Firestore database
// const db = admin.firestore();

/**
 * Cloud Function triggered when a document in the `accounts` collection is updated.
 */
export const onUpdateAccount = functions.firestore
  .document("accounts/{accountId}")
  .onUpdate(handleAccountUpdate);

/**
 * Handles the update of an account document, ensuring the auth user custom claims are updated.
 *
 * @param {Change<QueryDocumentSnapshot>} change - The change object representing the before and after state of the document.
 * @param {EventContext} context - The context of the event, providing parameters and identifiers.
 */
async function handleAccountUpdate(
  change: functions.Change<QueryDocumentSnapshot>,
  context: functions.EventContext,
) {
  const after = change.after.data();
  const before = change.before.data();
  const uid = context.params.accountId;

  try {
    if (
      before.type !== after.type ||
      before.name !== after.name ||
      before.heroImage !== after.heroImage ||
      before.iconImage !== after.iconImage ||
      before.tagline !== after.tagline ||
      before.settings !== after.settings
    ) {
      await admin.auth().setCustomUserClaims(uid, {
        type: after.type,
        displayName: after.name,
        heroImage: after.heroImage,
        iconImage: after.iconImage,
        tagline: after.tagline,
        settings: after.settings,
      });
      logger.info("User type custom claim updated successfully.");
    }
  } catch (error) {
    logger.error("Error updating user type custom claim: ", error);
  }
}
