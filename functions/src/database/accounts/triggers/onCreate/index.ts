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

import {
  onDocumentCreated,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

export const onCreateAccount = onDocumentCreated(
  "accounts/{accountId}",
  async (
    event: FirestoreEvent<QueryDocumentSnapshot | undefined, {accountId: string}>,
  ) => {
    if (!event.data) {
      logger.error("No document data found in create event");
      return;
    }

    const accountId = event.params.accountId;
    const data = event.data.data();

    if (
      data.type === "group" &&
      (data.groupType === "Nonprofit" || data.groupType === "Community")
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
  },
);
