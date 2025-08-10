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
// src/app/core/services/analytics.service.ts

import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable, combineLatest} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {GroupRole} from "../../../../shared/models/group-role.model";
import {Project} from "../../../../shared/models/project.model";
import {StandardRoleCategory} from "../../../../shared/models/standard-role-template.model";
import {StandardProjectCategory} from "../../../../shared/models/standard-project-template.model";

export interface RoleAnalytics {
  totalRoles: number;
  rolesByCategory: {[key in StandardRoleCategory]?: number};
  rolesByType: {organization: number; user: number};
  standardVsCustomRoles: {standard: number; custom: number};
  accountsWithRoles: number;
  averageRolesPerAccount: number;
}

export interface ProjectAnalytics {
  totalProjects: number;
  projectsByCategory: {[key in StandardProjectCategory]?: number};
  projectsByStatus: {[status: string]: number};
  activeProjects: number;
  archivedProjects: number;
  standardVsCustomProjects: {standard: number; custom: number};
  accountsWithProjects: number;
  averageProjectsPerAccount: number;
}

export interface CrossAccountMetrics {
  totalAccounts: number;
  accountsByType: {[type: string]: number};
  roleMetrics: RoleAnalytics;
  projectMetrics: ProjectAnalytics;
  engagementMetrics: {
    accountsWithBothRolesAndProjects: number;
    mostCommonRoleCategories: Array<{
      category: StandardRoleCategory;
      count: number;
    }>;
    mostCommonProjectCategories: Array<{
      category: StandardProjectCategory;
      count: number;
    }>;
  };
}

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  constructor(private firestore: AngularFirestore) {}

  /**
   * Get comprehensive analytics across all accounts
   */
  getCrossAccountAnalytics(): Observable<CrossAccountMetrics> {
    return combineLatest([
      this.getRoleAnalytics(),
      this.getProjectAnalytics(),
      this.getAccountAnalytics(),
    ]).pipe(
      map(([roleMetrics, projectMetrics, accountMetrics]) => ({
        totalAccounts: accountMetrics.totalAccounts,
        accountsByType: accountMetrics.accountsByType,
        roleMetrics,
        projectMetrics,
        engagementMetrics: {
          accountsWithBothRolesAndProjects: this.calculateEngagementOverlap(
            roleMetrics,
            projectMetrics,
          ),
          mostCommonRoleCategories: this.getTopCategories(
            roleMetrics.rolesByCategory as {[key: string]: number},
          ),
          mostCommonProjectCategories: this.getTopCategories(
            projectMetrics.projectsByCategory as {[key: string]: number},
          ),
        },
      })),
    );
  }

  /**
   * Get role analytics using collection group queries
   */
  getRoleAnalytics(): Observable<RoleAnalytics> {
    return this.firestore
      .collectionGroup<GroupRole>("roles")
      .valueChanges()
      .pipe(
        map((roles) => {
          const rolesByCategory: {[key in StandardRoleCategory]?: number} = {};
          const rolesByType = {organization: 0, user: 0};
          const standardVsCustomRoles = {standard: 0, custom: 0};
          const accountIds = new Set<string>();

          roles.forEach((role) => {
            // Extract accountId from role ID or use a different method
            const accountId = this.extractAccountIdFromRole(role);
            if (accountId) accountIds.add(accountId);

            // Count by category
            if (role.standardCategory) {
              rolesByCategory[role.standardCategory] =
                (rolesByCategory[role.standardCategory] || 0) + 1;
            }

            // Count by type
            rolesByType[role.roleType || "organization"]++;

            // Count standard vs custom
            if (role.isStandardRole) {
              standardVsCustomRoles.standard++;
            } else {
              standardVsCustomRoles.custom++;
            }
          });

          return {
            totalRoles: roles.length,
            rolesByCategory,
            rolesByType,
            standardVsCustomRoles,
            accountsWithRoles: accountIds.size,
            averageRolesPerAccount:
              accountIds.size > 0 ? roles.length / accountIds.size : 0,
          };
        }),
      );
  }

  /**
   * Get project analytics using collection group queries
   */
  getProjectAnalytics(): Observable<ProjectAnalytics> {
    return this.firestore
      .collectionGroup<Project>("projects")
      .valueChanges()
      .pipe(
        map((projects) => {
          const projectsByCategory: {
            [key in StandardProjectCategory]?: number;
          } = {};
          const projectsByStatus: {[status: string]: number} = {};
          const standardVsCustomProjects = {standard: 0, custom: 0};
          const accountIds = new Set<string>();

          let activeProjects = 0;
          let archivedProjects = 0;

          projects.forEach((project) => {
            accountIds.add(project.accountId);

            // Count by category
            if (project.standardCategory) {
              projectsByCategory[project.standardCategory] =
                (projectsByCategory[project.standardCategory] || 0) + 1;
            }

            // Count by status
            const status = project.status || "Unknown";
            projectsByStatus[status] = (projectsByStatus[status] || 0) + 1;

            // Count active vs archived
            if (project.archived) {
              archivedProjects++;
            } else {
              activeProjects++;
            }

            // Count standard vs custom
            if (project.isStandardProject) {
              standardVsCustomProjects.standard++;
            } else {
              standardVsCustomProjects.custom++;
            }
          });

          return {
            totalProjects: projects.length,
            projectsByCategory,
            projectsByStatus,
            activeProjects,
            archivedProjects,
            standardVsCustomProjects,
            accountsWithProjects: accountIds.size,
            averageProjectsPerAccount:
              accountIds.size > 0 ? projects.length / accountIds.size : 0,
          };
        }),
      );
  }

  /**
   * Get basic account analytics
   */
  getAccountAnalytics(): Observable<{
    totalAccounts: number;
    accountsByType: {[type: string]: number};
  }> {
    return this.firestore
      .collection("accounts")
      .valueChanges()
      .pipe(
        map((accounts: any[]) => {
          const accountsByType: {[type: string]: number} = {};

          accounts.forEach((account) => {
            const type = account.type || "Unknown";
            accountsByType[type] = (accountsByType[type] || 0) + 1;
          });

          return {
            totalAccounts: accounts.length,
            accountsByType,
          };
        }),
      );
  }

  /**
   * Get analytics for a specific role category across all accounts
   */
  getRoleCategoryAnalytics(category: StandardRoleCategory): Observable<{
    totalRoles: number;
    accountsUsingCategory: number;
    averageRolesPerAccount: number;
    roleNames: {[name: string]: number};
  }> {
    return this.firestore
      .collectionGroup<GroupRole>("roles", (ref) =>
        ref.where("standardCategory", "==", category),
      )
      .valueChanges()
      .pipe(
        map((roles) => {
          const accountIds = new Set<string>();
          const roleNames: {[name: string]: number} = {};

          roles.forEach((role) => {
            const accountId = this.extractAccountIdFromRole(role);
            if (accountId) accountIds.add(accountId);

            roleNames[role.name] = (roleNames[role.name] || 0) + 1;
          });

          return {
            totalRoles: roles.length,
            accountsUsingCategory: accountIds.size,
            averageRolesPerAccount:
              accountIds.size > 0 ? roles.length / accountIds.size : 0,
            roleNames,
          };
        }),
      );
  }

  /**
   * Get analytics for a specific project category across all accounts
   */
  getProjectCategoryAnalytics(category: StandardProjectCategory): Observable<{
    totalProjects: number;
    accountsUsingCategory: number;
    averageProjectsPerAccount: number;
    projectNames: {[name: string]: number};
    statusDistribution: {[status: string]: number};
  }> {
    return this.firestore
      .collectionGroup<Project>("projects", (ref) =>
        ref.where("standardCategory", "==", category),
      )
      .valueChanges()
      .pipe(
        map((projects) => {
          const accountIds = new Set<string>();
          const projectNames: {[name: string]: number} = {};
          const statusDistribution: {[status: string]: number} = {};

          projects.forEach((project) => {
            accountIds.add(project.accountId);

            projectNames[project.name] = (projectNames[project.name] || 0) + 1;

            const status = project.status || "Unknown";
            statusDistribution[status] = (statusDistribution[status] || 0) + 1;
          });

          return {
            totalProjects: projects.length,
            accountsUsingCategory: accountIds.size,
            averageProjectsPerAccount:
              accountIds.size > 0 ? projects.length / accountIds.size : 0,
            projectNames,
            statusDistribution,
          };
        }),
      );
  }

  /**
   * Compare standardization adoption across account types
   */
  getStandardizationAdoption(): Observable<{
    roleStandardization: {
      [accountType: string]: {standard: number; custom: number};
    };
    projectStandardization: {
      [accountType: string]: {standard: number; custom: number};
    };
  }> {
    return this.firestore
      .collection("accounts")
      .valueChanges()
      .pipe(
        switchMap((accounts: any[]) => {
          const accountMap = new Map<string, any>();
          accounts.forEach((acc) => accountMap.set(acc.id, acc));

          return combineLatest([
            this.firestore.collectionGroup<GroupRole>("roles").valueChanges(),
            this.firestore.collectionGroup<Project>("projects").valueChanges(),
          ]).pipe(
            map(([roles, projects]) => {
              const roleStandardization: {
                [accountType: string]: {standard: number; custom: number};
              } = {};
              const projectStandardization: {
                [accountType: string]: {standard: number; custom: number};
              } = {};

              // Analyze roles
              roles.forEach((role) => {
                const accountId = this.extractAccountIdFromRole(role);
                const account = accountId ? accountMap.get(accountId) : null;
                if (!account) return;

                const accountType = account.type || "Unknown";
                if (!roleStandardization[accountType]) {
                  roleStandardization[accountType] = {standard: 0, custom: 0};
                }

                if (role.isStandardRole) {
                  roleStandardization[accountType].standard++;
                } else {
                  roleStandardization[accountType].custom++;
                }
              });

              // Analyze projects
              projects.forEach((project) => {
                const account = accountMap.get(project.accountId);
                if (!account) return;

                const accountType = account.type || "Unknown";
                if (!projectStandardization[accountType]) {
                  projectStandardization[accountType] = {
                    standard: 0,
                    custom: 0,
                  };
                }

                if (project.isStandardProject) {
                  projectStandardization[accountType].standard++;
                } else {
                  projectStandardization[accountType].custom++;
                }
              });

              return {roleStandardization, projectStandardization};
            }),
          );
        }),
      );
  }

  private extractAccountIdFromRole(role: GroupRole): string | null {
    // Since we're using subcollections, we need to extract accountId from the role structure
    // This might require adjusting based on how you structure your role IDs
    // For now, assume role.id contains the accountId prefix
    if (role.id && role.id.includes("_")) {
      return role.id.split("_")[0];
    }
    return null;
  }

  private calculateEngagementOverlap(
    roleMetrics: RoleAnalytics,
    projectMetrics: ProjectAnalytics,
  ): number {
    // This is a simplified calculation - you might want to implement a more accurate one
    return Math.min(
      roleMetrics.accountsWithRoles,
      projectMetrics.accountsWithProjects,
    );
  }

  private getTopCategories(categoryMap: {
    [key: string]: number;
  }): Array<{category: any; count: number}> {
    return Object.entries(categoryMap)
      .map(([category, count]) => ({category, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories
  }
}
