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
import {admin} from "../../../../utils/firebase";

export const onCreateAccount = onDocumentCreated(
  {document: "accounts/{accountId}", region: "us-central1"},
  handleAccountCreate,
);

/**
 * Handle creation of a new account document.
 * Enhanced to create standard roles and projects based on account type.
 * Note: New accounts are created with type='new' initially, so we wait for updates.
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
  const accountType = account.type;

  logger.info(`Account created: ${accountId}, type: ${accountType}`);

  // Skip initialization for 'new' accounts - they'll be processed on update
  if (!accountType || accountType === "new") {
    logger.info(
      `Skipping initialization for account ${accountId} with type '${accountType}' - waiting for account setup completion`,
    );
    return;
  }

  try {
    // Only create standard structure for fully configured accounts
    if (accountType === "group") {
      await createStandardRoles(accountId, accountType);
      await createStandardProjects(accountId, accountType);
      logger.info(
        `Successfully initialized group account ${accountId} with standard roles and projects`,
      );
    } else if (accountType === "user") {
      // Users don't need roles/projects by default, but we could add user-specific initialization here
      logger.info(
        `User account ${accountId} created - no additional initialization needed`,
      );
    }
  } catch (error) {
    logger.error(`Error initializing account ${accountId}:`, error);
  }
}

/**
 * Creates standard roles for the account based on its type
 */
async function createStandardRoles(accountId: string, accountType: string) {
  if (accountType !== "group") {
    logger.info(
      `Skipping role creation for non-group account type: ${accountType}`,
    );
    return;
  }

  try {
    const standardRoles = getStandardRolesForAccountType(accountType);
    const rolesCollection = admin
      .firestore()
      .collection("accounts")
      .doc(accountId)
      .collection("roles");

    const batch = admin.firestore().batch();

    for (const role of standardRoles) {
      const roleDoc = rolesCollection.doc(role.id);

      batch.set(roleDoc, {
        ...role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: accountId, // Account creator
        lastModifiedBy: accountId,
      });
    }

    await batch.commit();
    logger.info(
      `Created ${standardRoles.length} standard roles for account ${accountId}`,
    );
  } catch (error) {
    logger.error(
      `Error creating standard roles for account ${accountId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Creates standard projects for the account based on its type
 */
async function createStandardProjects(accountId: string, accountType: string) {
  if (accountType !== "group") {
    logger.info(
      `Skipping project creation for non-group account type: ${accountType}`,
    );
    return;
  }

  try {
    const standardProjects = getStandardProjectsForAccountType(accountType);
    const projectsCollection = admin
      .firestore()
      .collection("accounts")
      .doc(accountId)
      .collection("projects");

    const batch = admin.firestore().batch();

    for (const project of standardProjects) {
      // Generate a new document ID for each project
      const projectDoc = projectsCollection.doc();

      batch.set(projectDoc, {
        id: projectDoc.id, // Set the generated ID
        ...project,
        accountId: accountId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: accountId, // Account creator
        lastModifiedBy: accountId,
      });
    }

    await batch.commit();
    logger.info(
      `Created ${standardProjects.length} standard projects for account ${accountId}`,
    );
  } catch (error) {
    logger.error(
      `Error creating standard projects for account ${accountId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Determines which standard roles should be added based on account type
 */
function getStandardRolesForAccountType(accountType: string) {
  // Return basic standard roles for now
  // This can be expanded later with more sophisticated logic
  return [
    {
      id: `${Date.now()}_admin`,
      name: "Administrator",
      description: "Full system access and management capabilities",
      roleType: "organization",
      permissions: [
        "manage_members",
        "manage_projects",
        "manage_roles",
        "manage_settings",
      ],
      standardCategory: "Organization",
      isStandardRole: true,
      isCustomRole: false,
      icon: "shield-checkmark",
      sortOrder: 0,
    },
    {
      id: `${Date.now() + 1}_member`,
      name: "Member",
      description: "Standard organization member with basic access",
      roleType: "organization",
      permissions: ["view_content", "participate"],
      standardCategory: "Organization",
      isStandardRole: true,
      isCustomRole: false,
      icon: "person",
      sortOrder: 10,
    },
  ];
}

/**
 * Determines which standard projects should be created based on account type
 */
function getStandardProjectsForAccountType(accountType: string) {
  // Return basic standard projects for now
  // This can be expanded later with more sophisticated logic
  return [
    {
      name: "Getting Started",
      description: "Initial setup and onboarding project",
      archived: false,
      standardCategory: "Organization",
      isStandardProject: true,
      icon: "play-circle",
      color: "#00b894",
      complexity: "Simple",
      timeframe: "Short-term",
      status: "Active",
      priority: "High",
      tags: ["setup", "onboarding"],
      goals: ["Complete account setup", "Familiarize with platform"],
    },
    {
      name: "Community Building",
      description: "Build and engage community members",
      archived: false,
      standardCategory: "Community",
      isStandardProject: true,
      icon: "people",
      color: "#0984e3",
      complexity: "Moderate",
      timeframe: "Ongoing",
      status: "Planning",
      priority: "Medium",
      tags: ["community", "engagement"],
      goals: ["Increase member engagement", "Foster community connections"],
    },
  ];
}
