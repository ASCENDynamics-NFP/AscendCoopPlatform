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

  /**
   * Get comprehensive time tracking analytics
   */
  getTimeTrackingAnalytics(
    filters?: TimeTrackingReportFilters,
  ): Observable<TimeTrackingAnalytics> {
    if (!filters?.accountId) {
      throw new Error("accountId is required for time tracking analytics");
    }

    return this.firestore
      .collection<TimeEntry>(`accounts/${filters.accountId}/timeEntries`)
      .valueChanges()
      .pipe(
        map((entries) => {
          // Apply additional filters if provided
          let filteredEntries = entries;

          if (filters) {
            filteredEntries = entries.filter((entry) => {
              if (filters.userId && entry.userId !== filters.userId)
                return false;
              if (filters.projectId && entry.projectId !== filters.projectId)
                return false;
              if (filters.status && entry.status !== filters.status)
                return false;

              if (filters.startDate || filters.endDate) {
                const entryDate = entry.date.toDate();
                if (filters.startDate && entryDate < filters.startDate)
                  return false;
                if (filters.endDate && entryDate > filters.endDate)
                  return false;
              }

              return true;
            });
          }

          return this.calculateTimeTrackingMetrics(filteredEntries);
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
  ): Observable<TimeTrackingAnalytics> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.getTimeTrackingAnalytics({
      accountId,
      startDate,
      endDate,
      timePeriod: "month",
    });
  }

  /**
   * Generate quarterly time tracking report
   */
  getQuarterlyTimeTrackingReport(
    year: number,
    quarter: number,
    accountId: string,
  ): Observable<TimeTrackingAnalytics> {
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0);

    return this.getTimeTrackingAnalytics({
      accountId,
      startDate,
      endDate,
      timePeriod: "quarter",
    });
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
   * Export time tracking data as CSV-ready format
   */
  exportTimeTrackingData(
    filters?: TimeTrackingReportFilters,
  ): Observable<any[]> {
    if (!filters?.accountId) {
      throw new Error("accountId is required for time tracking data export");
    }

    return this.firestore
      .collection<TimeEntry>(`accounts/${filters.accountId}/timeEntries`)
      .valueChanges()
      .pipe(
        map((entries) => {
          // Apply additional filters if provided
          let filteredEntries = entries;

          if (filters) {
            filteredEntries = entries.filter((entry) => {
              if (filters.userId && entry.userId !== filters.userId)
                return false;
              if (filters.projectId && entry.projectId !== filters.projectId)
                return false;
              if (filters.status && entry.status !== filters.status)
                return false;

              if (filters.startDate || filters.endDate) {
                const entryDate = entry.date.toDate();
                if (filters.startDate && entryDate < filters.startDate)
                  return false;
                if (filters.endDate && entryDate > filters.endDate)
                  return false;
              }

              return true;
            });
          }

          // Convert to CSV-ready format
          return filteredEntries.map((entry) => ({
            "Entry ID": entry.id,
            "Account ID": entry.accountId,
            "Project ID": entry.projectId,
            "Project Name": entry.projectName || "",
            "User ID": entry.userId,
            "User Name": entry.userName || "",
            Date: entry.date.toDate().toISOString().split("T")[0],
            Hours: entry.hours,
            Status: entry.status || "draft",
            Notes: entry.notes || "",
            "Approved By": entry.approvedByName || "",
            "Approved At": entry.approvedAt?.toDate().toISOString() || "",
            "Created At":
              entry.createdAt &&
              typeof entry.createdAt === "object" &&
              "toDate" in entry.createdAt
                ? entry.createdAt.toDate().toISOString()
                : "",
            "Last Modified":
              entry.lastModifiedAt &&
              typeof entry.lastModifiedAt === "object" &&
              "toDate" in entry.lastModifiedAt
                ? entry.lastModifiedAt.toDate().toISOString()
                : "",
          }));
        }),
      );
  }

  private calculateTimeTrackingMetrics(
    entries: TimeEntry[],
  ): TimeTrackingAnalytics {
    const totalEntries = entries.length;
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalApprovedHours = entries
      .filter((entry) => entry.status === "approved")
      .reduce((sum, entry) => sum + entry.hours, 0);

    // Calculate status-based metrics
    const entriesByStatus: {[status: string]: number} = {};
    const hoursByStatus: {[status: string]: number} = {};

    entries.forEach((entry) => {
      const status = entry.status || "draft";
      entriesByStatus[status] = (entriesByStatus[status] || 0) + 1;
      hoursByStatus[status] = (hoursByStatus[status] || 0) + entry.hours;
    });

    // Calculate project-based metrics
    const entriesByProject: {
      [projectId: string]: {name: string; entries: number; hours: number};
    } = {};
    entries.forEach((entry) => {
      if (!entriesByProject[entry.projectId]) {
        entriesByProject[entry.projectId] = {
          name: entry.projectName || "Unknown Project",
          entries: 0,
          hours: 0,
        };
      }
      entriesByProject[entry.projectId].entries++;
      entriesByProject[entry.projectId].hours += entry.hours;
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
      if (!entriesByUser[entry.userId]) {
        entriesByUser[entry.userId] = {
          name: entry.userName || "Unknown User",
          entries: 0,
          hours: 0,
          approvedHours: 0,
        };
      }
      entriesByUser[entry.userId].entries++;
      entriesByUser[entry.userId].hours += entry.hours;
      if (entry.status === "approved") {
        entriesByUser[entry.userId].approvedHours += entry.hours;
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
      const date = entry.date.toDate();
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const weekKey = this.getWeekKey(date);

      // Monthly stats
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {entries: 0, hours: 0, approvedHours: 0};
      }
      monthlyStats[monthKey].entries++;
      monthlyStats[monthKey].hours += entry.hours;
      if (entry.status === "approved") {
        monthlyStats[monthKey].approvedHours += entry.hours;
      }

      // Weekly stats
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = {entries: 0, hours: 0, approvedHours: 0};
      }
      weeklyStats[weekKey].entries++;
      weeklyStats[weekKey].hours += entry.hours;
      if (entry.status === "approved") {
        weeklyStats[weekKey].approvedHours += entry.hours;
      }
    });

    // Calculate approval metrics
    const approvedEntries = entries.filter(
      (e) => e.status === "approved",
    ).length;
    const rejectedEntries = entries.filter(
      (e) => e.status === "rejected",
    ).length;
    const pendingEntries = entries.filter((e) => e.status === "pending").length;

    const approvalRate =
      totalEntries > 0 ? (approvedEntries / totalEntries) * 100 : 0;
    const rejectionRate =
      totalEntries > 0 ? (rejectedEntries / totalEntries) * 100 : 0;
    const pendingRate =
      totalEntries > 0 ? (pendingEntries / totalEntries) * 100 : 0;

    // Calculate average approval time
    const approvedEntriesWithTimes = entries.filter(
      (e) => e.status === "approved" && e.createdAt && e.approvedAt,
    );
    const averageDaysToApproval =
      approvedEntriesWithTimes.length > 0
        ? approvedEntriesWithTimes.reduce((sum, entry) => {
            const created =
              entry.createdAt &&
              typeof entry.createdAt === "object" &&
              "toDate" in entry.createdAt
                ? entry.createdAt.toDate()
                : new Date();
            const approved = entry.approvedAt!.toDate();
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
      const dayOfWeek = dayNames[entry.date.toDate().getDay()];
      byDayOfWeek[dayOfWeek] = (byDayOfWeek[dayOfWeek] || 0) + entry.hours;
    });

    const byTimeOfMonth: {[period: string]: number} = {
      "Beginning (1-10)": 0,
      "Middle (11-20)": 0,
      "End (21-31)": 0,
    };

    entries.forEach((entry) => {
      const dayOfMonth = entry.date.toDate().getDate();
      if (dayOfMonth <= 10) {
        byTimeOfMonth["Beginning (1-10)"] += entry.hours;
      } else if (dayOfMonth <= 20) {
        byTimeOfMonth["Middle (11-20)"] += entry.hours;
      } else {
        byTimeOfMonth["End (21-31)"] += entry.hours;
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
