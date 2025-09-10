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
import {
  STANDARD_ROLE_TEMPLATES,
  StandardRoleTemplate,
} from "../../../../../../shared/models/standard-role-template.model";
import {
  STANDARD_PROJECT_TEMPLATES,
  StandardProjectTemplate,
} from "../../../../../../shared/models/standard-project-template.model";

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
      await createStandardRoles(accountId, accountType, account);
      await createStandardProjects(accountId, accountType, account);
      logger.info(
        `Successfully initialized group account ${accountId} with standard roles and projects`,
      );
    } else if (accountType === "user") {
      // Users don't need roles/projects by default, but we could add user-specific initialization here
      logger.info(
        `User account ${accountId} created - no additional initialization needed`,
      );
    }

    // Sync contactInformation into gated subdocument for rules-based access
    if (account.contactInformation) {
      await admin
        .firestore()
        .doc(`accounts/${accountId}/sections/contactInfo`)
        .set(account.contactInformation, {merge: true});
      logger.info(
        `Initialized sections/contactInfo for account ${accountId} from base document`,
      );
    }
  } catch (error) {
    logger.error(`Error initializing account ${accountId}:`, error);
  }
}

/**
 * Creates standard roles for the account based on its type
 * @param {string} accountId - The unique identifier of the account
 * @param {string} accountType - The type of account (user or group)
 * @param {any} account - The full account data
 */
async function createStandardRoles(
  accountId: string,
  accountType: string,
  account: any,
) {
  if (accountType !== "group") {
    logger.info(
      `Skipping role creation for non-group account type: ${accountType}`,
    );
    return;
  }

  try {
    const standardRoles = getStandardRolesForAccountType(accountType, account);
    const rolesCollection = admin
      .firestore()
      .collection("accounts")
      .doc(accountId)
      .collection("roles");

    const batch = admin.firestore().batch();

    for (const role of standardRoles) {
      // Generate a new document ID for each role
      const roleDoc = rolesCollection.doc();

      batch.set(roleDoc, {
        id: roleDoc.id, // Use generated Firestore document ID
        name: role.name,
        description: role.description,
        category: role.category,
        standardRoleTemplateId: role.id, // Reference to template
        permissions: role.defaultPermissions || [],
        icon: role.icon,
        isStandardRole: true,
        isCustomRole: false,
        applicableGroupTypes: role.applicableGroupTypes || [],
        suggestedChildRoles: role.suggestedChildRoles || [],
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
 * @param {string} accountId - The unique identifier of the account
 * @param {string} accountType - The type of account (user or group)
 * @param {any} account - The full account data
 */
async function createStandardProjects(
  accountId: string,
  accountType: string,
  account: any,
) {
  if (accountType !== "group") {
    logger.info(
      `Skipping project creation for non-group account type: ${accountType}`,
    );
    return;
  }

  try {
    const standardProjects = getStandardProjectsForAccountType(
      accountType,
      account,
    );
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
        id: projectDoc.id, // Use generated Firestore document ID
        name: project.name,
        description: project.description,
        accountId: accountId,
        archived: false,
        category: project.category,
        standardProjectTemplateId: project.id, // Reference to template
        icon: project.icon,
        color: project.color,
        complexity: project.complexity,
        estimatedTimeframe: project.estimatedTimeframe,
        defaultTasks: project.defaultTasks || [],
        requiredRoles: project.requiredRoles || [],
        suggestedMetrics: project.suggestedMetrics || [],
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
 * Determines which standard roles should be added based on account type and group details
 * @param {string} accountType - The type of account (user or group)
 * @param {any} account - The full account data including groupType
 * @return {Array} Array of standard role objects to create
 */
function getStandardRolesForAccountType(
  accountType: string,
  account: any,
): StandardRoleTemplate[] {
  if (accountType !== "group") {
    return [];
  }

  const groupType = account.groupType || account.groupDetails?.groupType;
  if (!groupType) {
    return [];
  }

  // Filter standard roles based on applicable group types
  return STANDARD_ROLE_TEMPLATES.filter(
    (template) =>
      template.applicableGroupTypes?.includes(groupType) ||
      template.applicableGroupTypes?.includes("Community"), // Community roles apply broadly
  );
}

/**
 * Determines which standard projects should be created based on account type and group details
 * @param {string} accountType - The type of account (user or group)
 * @param {any} account - The full account data including groupType
 * @return {Array} Array of standard project objects to create
 */
function getStandardProjectsForAccountType(
  accountType: string,
  account: any,
): StandardProjectTemplate[] {
  if (accountType !== "group") {
    return [];
  }

  const groupType = account.groupType || account.groupDetails?.groupType;
  if (!groupType) {
    return [];
  }

  // Filter standard projects based on applicable group types
  // For nonprofits and communities, include volunteer projects
  const applicableProjects = STANDARD_PROJECT_TEMPLATES.filter(
    (template) =>
      template.applicableGroupTypes?.includes(groupType) ||
      template.applicableGroupTypes?.includes("Community"), // Community projects apply broadly
  );

  // Always include at least one basic project for getting started
  if (applicableProjects.length === 0) {
    // Find a general project template
    const generalProject = STANDARD_PROJECT_TEMPLATES.find(
      (template) => template.category === "General",
    );
    if (generalProject) {
      applicableProjects.push(generalProject);
    }
  }

  return applicableProjects;
}
