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

import {
  onDocumentUpdated,
  Change,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

/**
 * Cloud Function triggered when a document in the `accounts` collection is updated.
 */
export const onUpdateAccount = onDocumentUpdated(
  "accounts/{accountId}",
  async (event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) => {
    if (!event.data?.after || !event.data?.before) {
      logger.error("Missing before or after data in update event");
      return;
    }

    const after = event.data.after.data();
    const before = event.data.before.data();
    const uid = event.params.accountId;

    try {
      // 1) Existing logic to check & update custom claims if relevant fields changed
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
        logger.info(`Custom claims updated for user ${uid}:`, {
          type: after.type,
          displayName: after.name,
          // Log other relevant fields for debugging
        });
      }

      // Address geocoding moved to sections/contactInfo subdocument trigger

      // 2) Sync contactInformation to gated subdocument when it changes
      const contactBefore = before.contactInformation || null;
      const contactAfter = after.contactInformation || null;
      const changedContact =
        JSON.stringify(contactBefore) !== JSON.stringify(contactAfter);

      if (changedContact) {
        const subRef = admin
          .firestore()
          .doc(`accounts/${uid}/sections/contactInfo`);
        if (contactAfter) {
          await subRef.set(contactAfter, {merge: true});
          logger.info(
            `Synchronized sections/contactInfo for account ${uid} after contactInformation update`,
          );
        } else {
          // If removed from base doc, remove subdocument to avoid stale data
          await subRef.delete();
          logger.info(
            `Removed sections/contactInfo for account ${uid} as contactInformation was cleared`,
          );
        }
      }
    } catch (error) {
      logger.error("Error in onUpdateAccount function:", error);
    }
  },
);
