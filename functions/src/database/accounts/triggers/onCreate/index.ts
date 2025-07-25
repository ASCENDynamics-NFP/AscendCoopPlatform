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
 ********************************************************************************/
// functions/src/database/accounts/triggers/onCreate/index.ts

import {
  onDocumentCreated,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot, DocumentData} from "firebase-admin/firestore";

export const onCreateAccount = onDocumentCreated(
  {document: "accounts/{accountId}", region: "us-central1"},
  handleAccountCreate,
);

/**
 * Handle creation of a new account document.
 *
 * @param {FirestoreEvent<QueryDocumentSnapshot | undefined, {accountId: string}>} event -
 *   Firestore event containing the new account data and params.
 */
async function handleAccountCreate(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined, {accountId: string}>,
) {
  const snapshot = event.data;
  const accountId = event.params.accountId;
  if (!snapshot) {
    logger.error("No document data found in create event");
    return;
  }

  const account = snapshot.data() as DocumentData;
  const groupType = account.groupDetails?.groupType;
  if (groupType !== "Nonprofit" && groupType !== "Community") {
    logger.info(`No volunteer project needed for groupType ${groupType}`);
    return;
  }

  try {
    if (
      account.type === "group" &&
      (account.groupType === "Nonprofit" || account.groupType === "Community")
    ) {
      try {
        await event.data.ref.collection("projects").add({
          name: "Volunteer",
          accountId,
          archived: false,
        });
        logger.info(`Created Volunteer project for account ${accountId}`);
      } catch (error) {
        logger.error("Error creating Volunteer project:", error);
      }
    }
    logger.info(`Volunteer project created for account ${accountId}`);
  } catch (error) {
    logger.error("Error creating volunteer project:", error);
  }
}
