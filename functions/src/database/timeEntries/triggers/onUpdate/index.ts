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
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 *********************************************************************************/

import {
  onDocumentUpdated,
  Change,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {admin} from "../../../../utils/firebase";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

/**
 * Cloud Function triggered when a time entry document is updated.
 * It updates the user's totalHours on status approval or reversal.
 */
export const onUpdateTimeEntry = onDocumentUpdated(
  {
    document: "accounts/{accountId}/timeEntries/{entryId}",
    region: "us-central1",
  },
  handleTimeEntryUpdate,
);

/**
 * Handle update of a time entry document.
 *
 * @param {FirestoreEvent<
 *   Change<QueryDocumentSnapshot> | undefined,
 *   {accountId: string; entryId: string}
 * >} event - Firestore event containing before and after snapshots and params.
 */
async function handleTimeEntryUpdate(
  event: FirestoreEvent<
    Change<QueryDocumentSnapshot> | undefined,
    {accountId: string; entryId: string}
  >,
) {
  if (!event.data?.after || !event.data?.before) {
    logger.error("Missing before or after data in update event");
    return;
  }

  const after = event.data.after.data();
  const before = event.data.before.data();

  const userId = after.userId || before.userId;
  const hours = after.hours || 0;

  if (!userId) {
    logger.error("Time entry missing userId");
    return;
  }

  try {
    if (before.status !== "approved" && after.status === "approved") {
      // Increment hours when entry is approved
      await admin
        .firestore()
        .doc(`accounts/${userId}`)
        .update({
          totalHours: admin.firestore.FieldValue.increment(hours),
        });
    } else if (before.status === "approved" && after.status !== "approved") {
      // Decrement hours if approval is reversed
      await admin
        .firestore()
        .doc(`accounts/${userId}`)
        .update({
          totalHours: admin.firestore.FieldValue.increment(-hours),
        });
    }
  } catch (error) {
    logger.error("Error updating total hours:", error);
  }
}
