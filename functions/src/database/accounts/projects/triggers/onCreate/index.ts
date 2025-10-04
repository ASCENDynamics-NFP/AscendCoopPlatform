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
// functions/src/database/accounts/projects/triggers/onCreate/index.ts

import {
  onDocumentCreated,
  FirestoreEvent,
} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";
import {admin} from "../../../../../utils/firebase";

export const onCreateProject = onDocumentCreated(
  {
    document: "accounts/{accountId}/projects/{projectId}",
    region: "us-central1",
  },
  handleProjectCreate,
);

/**
 * Handle creation of a new project document.
 * Automatically adds missing fields like archived, createdAt, and lastModifiedAt.
 *
 * @param {FirestoreEvent} event - Firestore event containing the project data and params.
 * @return {Promise<void>} Resolves when processing is complete.
 */
async function handleProjectCreate(
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {accountId: string; projectId: string}
  >,
) {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No document data found in create event");
    return;
  }

  const projectData = snapshot.data();
  const updates: Record<string, any> = {};

  // Add archived field if missing (default to false)
  if (projectData.archived === undefined) {
    updates.archived = false;
  }

  // Add createdAt if missing
  if (!projectData.createdAt) {
    updates.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }

  // Add lastModifiedAt if missing
  if (!projectData.lastModifiedAt) {
    updates.lastModifiedAt = admin.firestore.FieldValue.serverTimestamp();
  }

  // For createdBy and lastModifiedBy, we expect the client to set these
  // but we can add fallback logic if needed
  if (!projectData.createdBy) {
    // As a fallback, we could try to get the account owner/creator
    // This is useful if projects are created through admin interfaces or migrations
    try {
      const accountDoc = await admin
        .firestore()
        .doc(`accounts/${event.params.accountId}`)
        .get();

      if (accountDoc.exists) {
        const accountData = accountDoc.data();
        if (accountData?.createdBy) {
          updates.createdBy = accountData.createdBy;
          logger.info(
            `Set createdBy from account owner for project ${event.params.projectId}`,
          );
        }
      }
    } catch (error) {
      logger.warn(
        `Could not infer createdBy for project ${event.params.projectId}:`,
        error,
      );
    }
  }

  if (!projectData.lastModifiedBy) {
    // For new projects, lastModifiedBy should be the same as createdBy
    if (projectData.createdBy) {
      updates.lastModifiedBy = projectData.createdBy;
    } else if (updates.createdBy) {
      updates.lastModifiedBy = updates.createdBy;
    }
  }

  // Only update if we have fields to add
  if (Object.keys(updates).length > 0) {
    try {
      await snapshot.ref.update(updates);
      logger.info(
        `Added missing fields to project ${event.params.projectId}: ${JSON.stringify(updates)}`,
      );
    } catch (error) {
      logger.error("Error updating project with missing fields:", error);
    }
  }
}
