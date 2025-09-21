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
import {map, switchMap, catchError} from "rxjs/operators";
import {TimeTrackingService} from "./time-tracking.service";
import {GroupRole} from "../../../../shared/models/group-role.model";
import {Project} from "../../../../shared/models/project.model";
import {TimeEntry} from "../../../../shared/models/time-entry.model";
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

export interface TimeTrackingAnalytics {
  totalEntries: number;
  totalHours: number;
  totalApprovedHours: number;
  entriesByStatus: {[status: string]: number};
  hoursByStatus: {[status: string]: number};
  entriesByProject: {
    [projectId: string]: {name: string; entries: number; hours: number};
  };
  entriesByUser: {
    [userId: string]: {
      name: string;
      entries: number;
      hours: number;
      approvedHours: number;
    };
  };
  monthlyStats: {
    [month: string]: {entries: number; hours: number; approvedHours: number};
  };
  weeklyStats: {
    [week: string]: {entries: number; hours: number; approvedHours: number};
  };
  averageHoursPerEntry: number;
  averageApprovalTime: number; // in days
  mostActiveUsers: Array<{
    userId: string;
    userName: string;
    totalHours: number;
    approvedHours: number;
  }>;
  mostActiveProjects: Array<{
    projectId: string;
    projectName: string;
    totalHours: number;
    entriesCount: number;
  }>;
  approvalMetrics: {
    approvalRate: number; // percentage of entries approved
    rejectionRate: number; // percentage of entries rejected
    pendingRate: number; // percentage of entries pending
    averageDaysToApproval: number;
  };
  timeDistribution: {
    byDayOfWeek: {[day: string]: number}; // hours by day of week
    byTimeOfMonth: {[period: string]: number}; // beginning, middle, end of month
  };
}

export interface TimeTrackingReportFilters {
  accountId?: string;
  userId?: string;
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: "draft" | "pending" | "approved" | "rejected";
  timePeriod?: "week" | "month" | "quarter" | "year";
  category?: StandardProjectCategory;
}

export interface CSVExportOptions {
  format: "detailed" | "summary" | "analytics";
  includeHeaders?: boolean;
  dateFormat?: "ISO" | "US" | "EU";
  includeCalculatedFields?: boolean;
  customColumns?: string[];
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
  constructor(
    private firestore: AngularFirestore,
    private timeTrackingService: TimeTrackingService,
  ) {}

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

  /**
   * Get comprehensive time tracking analytics with project data for category filtering
   */
  getTimeTrackingAnalyticsWithProjects(
    filters?: TimeTrackingReportFilters,
  ): Observable<TimeTrackingAnalytics> {
    // Validate filters first
    this.validateFilters(filters);

    if (!filters?.accountId) {
      throw new Error("accountId is required for time tracking analytics");
    }

    // Get both time entries and project data for category filtering
    return combineLatest([
      this.timeTrackingService.getAccountTimeEntries(filters.accountId, {
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      }),
      this.firestore
        .collection(`accounts/${filters.accountId}/projects`)
        .valueChanges(),
    ]).pipe(
      map(([entries, projects]) => {
        let filteredEntries = entries;

        if (filters) {
          // Create a map of project ID to project category for efficient lookup
          const projectCategoryMap = new Map<string, StandardProjectCategory>();
          (projects as any[]).forEach((project) => {
            if (project.id && project.standardCategory) {
              projectCategoryMap.set(project.id, project.standardCategory);
            }
          });

          filteredEntries = entries.filter((entry) => {
            const entryAny = entry as any;

            if (filters.userId && entryAny.userId !== filters.userId)
              return false;
            if (filters.projectId && entryAny.projectId !== filters.projectId)
              return false;
            if (filters.status && entryAny.status !== filters.status)
              return false;

            // Category filtering using project data lookup
            if (filters.category && entryAny.projectId) {
              const projectCategory = projectCategoryMap.get(
                entryAny.projectId,
              );
              if (projectCategory !== filters.category) return false;
            }

            if (filters.startDate || filters.endDate) {
              const entryDate = this.toDate(entryAny.date);
              if (!entryDate) return false;

              // Include entries on the start date
              if (filters.startDate) {
                const startOfDay = new Date(filters.startDate);
                startOfDay.setHours(0, 0, 0, 0);
                if (entryDate < startOfDay) return false;
              }

              // Include entries on the end date (through end of day)
              if (filters.endDate) {
                const endOfDay = new Date(filters.endDate);
                endOfDay.setHours(23, 59, 59, 999);
                if (entryDate > endOfDay) return false;
              }
            }

            return true;
          });
        }

        return this.calculateTimeTrackingMetrics(
          filteredEntries as unknown as TimeEntry[],
        );
      }),
      catchError((error) => {
        console.error(
          "Error loading time tracking analytics with projects:",
          error,
        );
        throw error;
      }),
    );
  }

  /**
   * Validate filter parameters to prevent runtime errors
   */
  private validateFilters(filters?: TimeTrackingReportFilters): void {
    if (!filters) return;

    // Validate accountId
    if (!filters.accountId || typeof filters.accountId !== "string") {
      throw new Error(
        "Valid accountId is required for time tracking analytics",
      );
    }

    // Validate date range
    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      throw new Error("Start date cannot be later than end date");
    }

    // Validate date objects
    if (
      (filters.startDate && !(filters.startDate instanceof Date)) ||
      (filters.startDate && isNaN(filters.startDate.getTime()))
    ) {
      throw new Error("Invalid start date provided");
    }

    if (
      (filters.endDate && !(filters.endDate instanceof Date)) ||
      (filters.endDate && isNaN(filters.endDate.getTime()))
    ) {
      throw new Error("Invalid end date provided");
    }

    // Validate status
    if (
      filters.status &&
      !["draft", "pending", "approved", "rejected"].includes(filters.status)
    ) {
      throw new Error(
        "Invalid status filter. Must be one of: draft, pending, approved, rejected",
      );
    }

    // Validate timePeriod
    if (
      filters.timePeriod &&
      !["week", "month", "quarter", "year"].includes(filters.timePeriod)
    ) {
      throw new Error(
        "Invalid time period. Must be one of: week, month, quarter, year",
      );
    }
  }

  /**
   * Get comprehensive time tracking analytics
   */
  getTimeTrackingAnalytics(
    filters?: TimeTrackingReportFilters,
  ): Observable<TimeTrackingAnalytics> {
    // Validate filters first
    this.validateFilters(filters);

    if (!filters?.accountId) {
      throw new Error("accountId is required for time tracking analytics");
    }

    // Only pass minimal options to the service to get all relevant data
    // Then do comprehensive filtering client-side for more control
    const requestOptions = {
      // Only pass date filters to the service to reduce the initial dataset
      startDate: filters.startDate?.toISOString(),
      endDate: filters.endDate?.toISOString(),
    };

    return this.timeTrackingService
      .getAccountTimeEntries(filters.accountId, requestOptions)
      .pipe(
        map((entries) => {
          let filteredEntries = entries;

          if (filters) {
            filteredEntries = entries.filter((entry) => {
              const entryAny = entry as any;

              if (filters.userId && entryAny.userId !== filters.userId)
                return false;
              if (filters.projectId && entryAny.projectId !== filters.projectId)
                return false;
              if (filters.status && entryAny.status !== filters.status)
                return false;

              // Category filtering - requires project category data to be available
              // This could be from a joined query or if category was denormalized in time entries
              if (
                filters.category &&
                entryAny.projectCategory &&
                entryAny.projectCategory !== filters.category
              )
                return false;

              if (filters.startDate || filters.endDate) {
                const entryDate = this.toDate(entryAny.date);
                if (!entryDate) return false;

                // Include entries on the start date
                if (filters.startDate) {
                  const startOfDay = new Date(filters.startDate);
                  startOfDay.setHours(0, 0, 0, 0);
                  if (entryDate < startOfDay) return false;
                }

                // Include entries on the end date (through end of day)
                if (filters.endDate) {
                  const endOfDay = new Date(filters.endDate);
                  endOfDay.setHours(23, 59, 59, 999);
                  if (entryDate > endOfDay) return false;
                }
              }

              return true;
            });
          }

          return this.calculateTimeTrackingMetrics(
            filteredEntries as unknown as TimeEntry[],
          );
        }),
        catchError((error) => {
          console.error("Error loading time tracking analytics:", error);
          throw error;
        }),
      );
  }

  /**
   * Generate monthly time tracking report
   */
  getMonthlyTimeTrackingReport(
    year: number,
    month: number,
    accountId: string,
    additionalFilters?: Partial<TimeTrackingReportFilters>,
  ): Observable<TimeTrackingAnalytics> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Merge month date range with additional filters
    const filters: TimeTrackingReportFilters = {
      ...additionalFilters, // Apply additional filters first
      // Then override with required monthly report settings
      accountId,
      startDate,
      endDate,
      timePeriod: "month",
    };

    return this.getTimeTrackingAnalytics(filters);
  }

  /**
   * Generate quarterly time tracking report
   */
  getQuarterlyTimeTrackingReport(
    year: number,
    quarter: number,
    accountId: string,
    additionalFilters?: Partial<TimeTrackingReportFilters>,
  ): Observable<TimeTrackingAnalytics> {
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0);

    // Merge quarter date range with additional filters
    const filters: TimeTrackingReportFilters = {
      ...additionalFilters, // Apply additional filters first
      // Then override with required quarterly report settings
      accountId,
      startDate,
      endDate,
      timePeriod: "quarter",
    };

    return this.getTimeTrackingAnalytics(filters);
  }

  /**
   * Generate individual volunteer contribution report
   */
  getUserTimeTrackingReport(
    userId: string,
    accountId?: string,
    timePeriod?: "month" | "quarter" | "year",
  ): Observable<TimeTrackingAnalytics> {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (timePeriod) {
      const now = new Date();
      switch (timePeriod) {
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case "quarter":
          const currentQuarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
          endDate = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
      }
    }

    return this.getTimeTrackingAnalytics({
      userId,
      accountId,
      startDate,
      endDate,
      timePeriod,
    });
  }

  /**
   * Generate project-based time tracking report
   */
  getProjectTimeTrackingReport(
    projectId: string,
    accountId?: string,
  ): Observable<TimeTrackingAnalytics> {
    return this.getTimeTrackingAnalytics({
      projectId,
      accountId,
    });
  }

  /**
   * Export time tracking data as CSV-ready format with enhanced options
   */
  exportTimeTrackingData(
    filters?: TimeTrackingReportFilters,
    options: CSVExportOptions = {format: "detailed"},
  ): Observable<any[]> {
    // Validate filters first
    this.validateFilters(filters);

    if (!filters?.accountId) {
      throw new Error("accountId is required for time tracking data export");
    }

    // Get both time entries and project data to populate project categories
    return combineLatest([
      this.timeTrackingService.getAccountTimeEntries(filters.accountId, {
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      }),
      this.firestore
        .collection(`accounts/${filters.accountId}/projects`)
        .valueChanges({idField: "id"}),
    ]).pipe(
      map(([entries, projects]) => {
        // Create a map of project ID to project data for efficient lookup
        const projectMap = new Map<string, any>();
        (projects as any[]).forEach((project) => {
          if (project.id) {
            projectMap.set(project.id, project);
          }
        });

        // Populate project category for each time entry
        const enrichedEntries = entries.map((entry) => {
          const entryAny = entry as any;
          const project = projectMap.get(entryAny.projectId);

          const enriched = {
            ...entryAny,
            projectCategory: project?.standardCategory || "",
            projectName: entryAny.projectName || project?.name || "",
          };

          if (!project) {
            console.warn(
              "[Analytics Service] No project found for projectId:",
              entryAny.projectId,
            );
          } else if (!project.standardCategory) {
            console.warn(
              "[Analytics Service] Project missing standardCategory:",
              project.id,
              project.name,
            );
          }

          return enriched;
        });

        let filteredEntries = enrichedEntries;

        if (filters) {
          filteredEntries = enrichedEntries.filter((entry) => {
            const entryAny = entry as any;
            if (filters.userId && entryAny.userId !== filters.userId)
              return false;
            if (filters.projectId && entryAny.projectId !== filters.projectId)
              return false;
            if (filters.status && entryAny.status !== filters.status)
              return false;

            // Category filtering using populated project category data
            if (
              filters.category &&
              entryAny.projectCategory !== filters.category
            )
              return false;

            if (filters.startDate || filters.endDate) {
              const entryDate = this.toDate(entryAny.date);
              if (!entryDate) return false;

              // Include entries on the start date
              if (filters.startDate) {
                const startOfDay = new Date(filters.startDate);
                startOfDay.setHours(0, 0, 0, 0);
                if (entryDate < startOfDay) return false;
              }

              // Include entries on the end date (through end of day)
              if (filters.endDate) {
                const endOfDay = new Date(filters.endDate);
                endOfDay.setHours(23, 59, 59, 999);
                if (entryDate > endOfDay) return false;
              }
            }

            return true;
          });
        }

        // Generate different export formats based on options
        switch (options.format) {
          case "summary":
            return this.generateSummaryCSVData(filteredEntries, options);
          case "analytics":
            return this.generateAnalyticsCSVData(filteredEntries, options);
          case "detailed":
          default:
            return this.generateDetailedCSVData(filteredEntries, options);
        }
      }),
    );
  }

  /**
   * Generate detailed CSV data with all entry information
   */
  private generateDetailedCSVData(
    entries: any[],
    options: CSVExportOptions,
  ): any[] {
    return entries.map((entry) => {
      const entryAny = entry as any;
      const entryDate = this.toDate(entryAny.date);
      const approvedAt = this.toDate(entryAny.approvedAt);
      const createdAt = this.toDate(entryAny.createdAt);
      const lastModifiedAt = this.toDate(entryAny.lastModifiedAt);

      const baseData = {
        "Entry ID": entryAny.id,
        "Account ID": entryAny.accountId,
        "Project ID": entryAny.projectId,
        "Project Name": entryAny.projectName || "",
        "Project Category": entryAny.projectCategory || "",
        "User ID": entryAny.userId,
        "User Name": entryAny.userName || "",
        Date: this.formatDate(entryDate, options.dateFormat),
        Hours: this.coerceNumber(entryAny.hours),
        Status: entryAny.status || "draft",
        Notes: entryAny.notes || "",
        "Approved By": entryAny.approvedByName || "",
        "Approved At": this.formatDate(approvedAt, options.dateFormat),
        "Created At": this.formatDate(createdAt, options.dateFormat),
        "Last Modified": this.formatDate(lastModifiedAt, options.dateFormat),
      };

      // Add calculated fields if requested
      if (options.includeCalculatedFields) {
        const dayOfWeek = entryDate
          ? entryDate.toLocaleDateString("en-US", {weekday: "long"})
          : "";
        const weekNumber = entryDate ? this.getWeekNumber(entryDate) : "";
        const monthYear = entryDate
          ? `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, "0")}`
          : "";

        return {
          ...baseData,
          "Day of Week": dayOfWeek,
          "Week Number": weekNumber,
          "Month Year": monthYear,
          "Days Since Created":
            createdAt && entryDate
              ? Math.floor(
                  (entryDate.getTime() - createdAt.getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : "",
          "Days to Approval":
            createdAt && approvedAt
              ? Math.floor(
                  (approvedAt.getTime() - createdAt.getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : "",
          "Is Approved": entryAny.status === "approved" ? "Yes" : "No",
          "Is Weekend": entryDate
            ? entryDate.getDay() === 0 || entryDate.getDay() === 6
              ? "Yes"
              : "No"
            : "",
        };
      }

      return baseData;
    });
  }

  /**
   * Generate summary CSV data with aggregated information
   */
  private generateSummaryCSVData(
    entries: any[],
    options: CSVExportOptions,
  ): any[] {
    const summaryData: {[key: string]: any} = {};

    // Group by user and project
    entries.forEach((entry) => {
      const entryAny = entry as any;
      const key = `${entryAny.userId || "unknown"}_${entryAny.projectId || "unknown"}`;

      if (!summaryData[key]) {
        summaryData[key] = {
          "User ID": entryAny.userId || "unknown",
          "User Name": entryAny.userName || "Unknown User",
          "Project ID": entryAny.projectId || "unknown",
          "Project Name": entryAny.projectName || "Unknown Project",
          "Project Category": entryAny.projectCategory || "",
          "Total Entries": 0,
          "Total Hours": 0,
          "Approved Hours": 0,
          "Pending Hours": 0,
          "Draft Hours": 0,
          "Rejected Hours": 0,
          "First Entry Date": null,
          "Last Entry Date": null,
          "Average Hours Per Entry": 0,
        };
      }

      const hours = this.coerceNumber(entryAny.hours);
      const entryDate = this.toDate(entryAny.date);
      const status = entryAny.status || "draft";

      summaryData[key]["Total Entries"]++;
      summaryData[key]["Total Hours"] += hours;
      summaryData[key][
        `${status.charAt(0).toUpperCase() + status.slice(1)} Hours`
      ] += hours;

      if (
        !summaryData[key]["First Entry Date"] ||
        (entryDate && entryDate < summaryData[key]["First Entry Date"])
      ) {
        summaryData[key]["First Entry Date"] = entryDate;
      }
      if (
        !summaryData[key]["Last Entry Date"] ||
        (entryDate && entryDate > summaryData[key]["Last Entry Date"])
      ) {
        summaryData[key]["Last Entry Date"] = entryDate;
      }
    });

    // Calculate averages and format dates
    return Object.values(summaryData).map((item: any) => {
      item["Average Hours Per Entry"] =
        item["Total Entries"] > 0
          ? (item["Total Hours"] / item["Total Entries"]).toFixed(2)
          : 0;
      item["First Entry Date"] = this.formatDate(
        item["First Entry Date"],
        options.dateFormat,
      );
      item["Last Entry Date"] = this.formatDate(
        item["Last Entry Date"],
        options.dateFormat,
      );
      return item;
    });
  }

  /**
   * Generate analytics CSV data with metrics and statistics
   */
  private generateAnalyticsCSVData(
    entries: any[],
    options: CSVExportOptions,
  ): any[] {
    const analytics = this.calculateTimeTrackingMetrics(
      entries as unknown as TimeEntry[],
    );

    const analyticsData = [
      // Overall metrics
      {
        Metric: "Total Entries",
        Value: analytics.totalEntries,
        Category: "Overall",
      },
      {Metric: "Total Hours", Value: analytics.totalHours, Category: "Overall"},
      {
        Metric: "Total Approved Hours",
        Value: analytics.totalApprovedHours,
        Category: "Overall",
      },
      {
        Metric: "Average Hours Per Entry",
        Value: analytics.averageHoursPerEntry.toFixed(2),
        Category: "Overall",
      },
      {
        Metric: "Average Approval Time (Days)",
        Value: analytics.averageApprovalTime.toFixed(2),
        Category: "Overall",
      },

      // Approval metrics
      {
        Metric: "Approval Rate (%)",
        Value: analytics.approvalMetrics.approvalRate.toFixed(2),
        Category: "Approval",
      },
      {
        Metric: "Rejection Rate (%)",
        Value: analytics.approvalMetrics.rejectionRate.toFixed(2),
        Category: "Approval",
      },
      {
        Metric: "Pending Rate (%)",
        Value: analytics.approvalMetrics.pendingRate.toFixed(2),
        Category: "Approval",
      },
    ];

    // Add status breakdown
    Object.entries(analytics.entriesByStatus).forEach(([status, count]) => {
      analyticsData.push({
        Metric: `${status.charAt(0).toUpperCase() + status.slice(1)} Entries`,
        Value: count,
        Category: "Status Breakdown",
      });
    });

    // Add hours by status
    Object.entries(analytics.hoursByStatus).forEach(([status, hours]) => {
      analyticsData.push({
        Metric: `${status.charAt(0).toUpperCase() + status.slice(1)} Hours`,
        Value: hours,
        Category: "Hours by Status",
      });
    });

    // Add top users
    analytics.mostActiveUsers.slice(0, 10).forEach((user, index) => {
      analyticsData.push({
        Metric: `Top User ${index + 1}`,
        Value: `${user.userName} (${user.totalHours} hrs)`,
        Category: "Top Users",
      });
    });

    // Add top projects
    analytics.mostActiveProjects.slice(0, 10).forEach((project, index) => {
      analyticsData.push({
        Metric: `Top Project ${index + 1}`,
        Value: `${project.projectName} (${project.totalHours} hrs)`,
        Category: "Top Projects",
      });
    });

    return analyticsData;
  }

  /**
   * Format date based on specified format
   */
  private formatDate(
    date: Date | null,
    format: CSVExportOptions["dateFormat"] = "ISO",
  ): string {
    if (!date) return "";

    switch (format) {
      case "US":
        return date.toLocaleDateString("en-US");
      case "EU":
        return date.toLocaleDateString("en-GB");
      case "ISO":
      default:
        return date.toISOString().split("T")[0];
    }
  }

  private calculateTimeTrackingMetrics(
    entries: TimeEntry[],
  ): TimeTrackingAnalytics {
    const totalEntries = entries.length;
    const totalHours = entries.reduce(
      (sum, entry) => sum + this.coerceNumber((entry as any).hours),
      0,
    );
    const totalApprovedHours = entries
      .filter((entry) => (entry as any).status === "approved")
      .reduce((sum, entry) => sum + this.coerceNumber((entry as any).hours), 0);

    // Calculate status-based metrics
    const entriesByStatus: {[status: string]: number} = {};
    const hoursByStatus: {[status: string]: number} = {};

    entries.forEach((entry) => {
      const entryAny = entry as any;
      const status = entryAny.status || "draft";
      const hours = this.coerceNumber(entryAny.hours);
      entriesByStatus[status] = (entriesByStatus[status] || 0) + 1;
      hoursByStatus[status] = (hoursByStatus[status] || 0) + hours;
    });

    // Calculate project-based metrics
    const entriesByProject: {
      [projectId: string]: {name: string; entries: number; hours: number};
    } = {};
    entries.forEach((entry) => {
      const entryAny = entry as any;
      const projectId = entryAny.projectId || "unknown";
      const hours = this.coerceNumber(entryAny.hours);

      if (!entriesByProject[projectId]) {
        entriesByProject[projectId] = {
          name: entryAny.projectName || "Unknown Project",
          entries: 0,
          hours: 0,
        };
      }
      entriesByProject[projectId].entries++;
      entriesByProject[projectId].hours += hours;
    });

    // Calculate user-based metrics
    const entriesByUser: {
      [userId: string]: {
        name: string;
        entries: number;
        hours: number;
        approvedHours: number;
      };
    } = {};
    entries.forEach((entry) => {
      const entryAny = entry as any;
      const hours = this.coerceNumber(entryAny.hours);
      const userId = entryAny.userId || "unknown";

      if (!entriesByUser[userId]) {
        entriesByUser[userId] = {
          name: entryAny.userName || "Unknown User",
          entries: 0,
          hours: 0,
          approvedHours: 0,
        };
      }
      entriesByUser[userId].entries++;
      entriesByUser[userId].hours += hours;
      if (entryAny.status === "approved") {
        entriesByUser[userId].approvedHours += hours;
      }
    });

    // Calculate monthly and weekly stats
    const monthlyStats: {
      [month: string]: {entries: number; hours: number; approvedHours: number};
    } = {};
    const weeklyStats: {
      [week: string]: {entries: number; hours: number; approvedHours: number};
    } = {};

    entries.forEach((entry) => {
      const entryAny = entry as any;
      const date = this.toDate(entryAny.date);
      if (!date) {
        return;
      }

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const weekKey = this.getWeekKey(date);
      const hours = this.coerceNumber(entryAny.hours);

      // Monthly stats
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {entries: 0, hours: 0, approvedHours: 0};
      }
      monthlyStats[monthKey].entries++;
      monthlyStats[monthKey].hours += hours;
      if (entryAny.status === "approved") {
        monthlyStats[monthKey].approvedHours += hours;
      }

      // Weekly stats
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = {entries: 0, hours: 0, approvedHours: 0};
      }
      weeklyStats[weekKey].entries++;
      weeklyStats[weekKey].hours += hours;
      if (entryAny.status === "approved") {
        weeklyStats[weekKey].approvedHours += hours;
      }
    });

    // Calculate approval metrics
    const approvedEntries = entries.filter(
      (e) => (e as any).status === "approved",
    ).length;
    const rejectedEntries = entries.filter(
      (e) => (e as any).status === "rejected",
    ).length;
    const pendingEntries = entries.filter(
      (e) => (e as any).status === "pending",
    ).length;

    const approvalRate =
      totalEntries > 0 ? (approvedEntries / totalEntries) * 100 : 0;
    const rejectionRate =
      totalEntries > 0 ? (rejectedEntries / totalEntries) * 100 : 0;
    const pendingRate =
      totalEntries > 0 ? (pendingEntries / totalEntries) * 100 : 0;

    // Calculate average approval time
    const approvedEntriesWithTimes = entries.filter((e) => {
      const entryAny = e as any;
      return (
        entryAny.status === "approved" &&
        this.toDate(entryAny.createdAt) &&
        this.toDate(entryAny.approvedAt)
      );
    });
    const averageDaysToApproval =
      approvedEntriesWithTimes.length > 0
        ? approvedEntriesWithTimes.reduce((sum, entry) => {
            const entryAny = entry as any;
            const created = this.toDate(entryAny.createdAt)!;
            const approved = this.toDate(entryAny.approvedAt)!;
            const daysDiff =
              (approved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            return sum + daysDiff;
          }, 0) / approvedEntriesWithTimes.length
        : 0;

    // Get most active users and projects
    const mostActiveUsers = Object.entries(entriesByUser)
      .map(([userId, data]) => ({
        userId,
        userName: data.name,
        totalHours: data.hours,
        approvedHours: data.approvedHours,
      }))
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 10);

    const mostActiveProjects = Object.entries(entriesByProject)
      .map(([projectId, data]) => ({
        projectId,
        projectName: data.name,
        totalHours: data.hours,
        entriesCount: data.entries,
      }))
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 10);

    // Calculate time distribution
    const byDayOfWeek: {[day: string]: number} = {};
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    entries.forEach((entry) => {
      const entryAny = entry as any;
      const date = this.toDate(entryAny.date);
      const hours = this.coerceNumber(entryAny.hours);

      if (!date) {
        return;
      }

      const dayOfWeek = dayNames[date.getDay()];
      byDayOfWeek[dayOfWeek] = (byDayOfWeek[dayOfWeek] || 0) + hours;
    });

    const byTimeOfMonth: {[period: string]: number} = {
      "Beginning (1-10)": 0,
      "Middle (11-20)": 0,
      "End (21-31)": 0,
    };

    entries.forEach((entry) => {
      const entryAny = entry as any;
      const date = this.toDate(entryAny.date);
      const hours = this.coerceNumber(entryAny.hours);

      if (!date) {
        return;
      }

      const dayOfMonth = date.getDate();
      if (dayOfMonth <= 10) {
        byTimeOfMonth["Beginning (1-10)"] += hours;
      } else if (dayOfMonth <= 20) {
        byTimeOfMonth["Middle (11-20)"] += hours;
      } else {
        byTimeOfMonth["End (21-31)"] += hours;
      }
    });

    return {
      totalEntries,
      totalHours,
      totalApprovedHours,
      entriesByStatus,
      hoursByStatus,
      entriesByProject,
      entriesByUser,
      monthlyStats,
      weeklyStats,
      averageHoursPerEntry: totalEntries > 0 ? totalHours / totalEntries : 0,
      averageApprovalTime: averageDaysToApproval,
      mostActiveUsers,
      mostActiveProjects,
      approvalMetrics: {
        approvalRate,
        rejectionRate,
        pendingRate,
        averageDaysToApproval,
      },
      timeDistribution: {
        byDayOfWeek,
        byTimeOfMonth,
      },
    };
  }

  private coerceNumber(value: any): number {
    if (typeof value === "number" && !isNaN(value)) {
      return value;
    }

    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  private toDate(value: any): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === "string") {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof value === "number") {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof value === "object") {
      if (typeof (value as any).toDate === "function") {
        const parsed = (value as any).toDate();
        return isNaN(parsed.getTime()) ? null : parsed;
      }

      if (typeof (value as any).seconds === "number") {
        const seconds = (value as any).seconds;
        const nanos = (value as any).nanoseconds || 0;
        return new Date(seconds * 1000 + nanos / 1e6);
      }

      if (typeof (value as any)._seconds === "number") {
        const seconds = (value as any)._seconds;
        const nanos = (value as any)._nanoseconds || 0;
        return new Date(seconds * 1000 + nanos / 1e6);
      }
    }

    return null;
  }

  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${String(week).padStart(2, "0")}`;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
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
