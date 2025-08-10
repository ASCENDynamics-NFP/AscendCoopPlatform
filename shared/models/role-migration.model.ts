/*******************************************************************************
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
 *******************************************************************************/
// shared/models/role-migration.model.ts

import {GroupRole} from "./group-role.model";
import {
  StandardRoleTemplate,
  STANDARD_ROLE_TEMPLATES,
} from "./standard-role-template.model";

export interface RoleMigrationPlan {
  /** Phase 1: Move roles from account.roles to accounts/{accountId}/roles subcollection */
  moveToSubcollection: boolean;

  /** Phase 2: Add standard role templates to each account */
  addStandardRoles: boolean;

  /** Phase 3: Optionally move to global roles collection for better analytics */
  moveToGlobalCollection: boolean;

  /** Backup existing roles during migration */
  createBackup: boolean;
}

export interface RoleMigrationStatus {
  accountId: string;
  phase1Complete: boolean; // Roles moved to subcollection
  phase2Complete: boolean; // Standard roles added
  phase3Complete: boolean; // Moved to global collection
  backupCreated: boolean;
  rolesCount: number;
  migrationDate: Date;
  errors?: string[];
}

// Service interface for role migration
export interface RoleMigrationService {
  /**
   * Phase 1: Move roles from account.roles array to accounts/{accountId}/roles subcollection
   */
  migrateRolesToSubcollection(accountId: string): Promise<RoleMigrationStatus>;

  /**
   * Phase 2: Add standard role templates to account based on account type
   */
  addStandardRolesToAccount(
    accountId: string,
    accountType: string,
    groupType?: string,
  ): Promise<void>;

  /**
   * Phase 3: Optionally move to global roles collection with accountId reference
   */
  migrateToGlobalRolesCollection(accountId: string): Promise<void>;

  /**
   * Rollback migration if issues occur
   */
  rollbackMigration(accountId: string): Promise<void>;

  /**
   * Get migration status for an account
   */
  getMigrationStatus(accountId: string): Promise<RoleMigrationStatus>;
}

/**
 * Determines which standard roles should be added based on account type
 */
export function getStandardRolesForAccountType(
  accountType: string,
  groupType?: string,
): StandardRoleTemplate[] {
  const baseRoles = [
    STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_admin")!,
    STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_member")!,
  ];

  switch (groupType) {
    case "Nonprofit":
      return [
        ...baseRoles,
        STANDARD_ROLE_TEMPLATES.find(
          (r) => r.id === "std_volunteer_coordinator",
        )!,
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_volunteer")!,
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_project_lead")!,
      ];

    case "Community":
      return [
        ...baseRoles,
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_community_leader")!,
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_resident")!,
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_volunteer")!,
      ];

    case "Business":
      return [
        ...baseRoles,
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_department_head")!,
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_employee")!,
      ];

    case "Family":
      return [
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_family_head")!,
        STANDARD_ROLE_TEMPLATES.find((r) => r.id === "std_family_member")!,
      ];

    default:
      return baseRoles;
  }
}

/**
 * Converts a standard role template to a GroupRole instance
 */
export function convertTemplateToGroupRole(
  template: StandardRoleTemplate,
  accountId: string,
): GroupRole {
  return {
    id: `${accountId}_${template.id}`,
    name: template.name,
    description: template.description,
    roleType:
      template.category === "Family" || template.category === "Friends"
        ? "user"
        : "organization",
    permissions: template.defaultPermissions,
    standardRoleTemplateId: template.id,
    standardCategory: template.category,
    isStandardRole: true,
    isCustomRole: false,
    icon: template.icon,
    sortOrder: 0,
  };
}
