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
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subject, combineLatest, Subscription} from "rxjs";
import {takeUntil, map} from "rxjs/operators";
import {
  AnalyticsService,
  TimeTrackingAnalytics,
  TimeTrackingReportFilters,
} from "../../../../core/services/analytics.service";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AuthUser} from "../../../../../../shared/models/auth-user.model";
import {Project} from "../../../../../../shared/models/project.model";
import {
  Account,
  RelatedAccount,
} from "../../../../../../shared/models/account.model";
import {selectActiveProjectsByAccount} from "../../../../state/selectors/projects.selectors";
import {selectRelatedAccountsByAccountId} from "../../../../state/selectors/account.selectors";
import * as ProjectsActions from "../../../../state/actions/projects.actions";
import {ChartData, ChartOptions, ChartType} from "chart.js";

export interface ReportConfig {
  name: string;
  description: string;
  type: "monthly" | "quarterly" | "yearly" | "custom" | "user" | "project";
  icon: string;
  enabled: boolean;
}

@Component({
  selector: "app-reports",
  templateUrl: "./reports.page.html",
  styleUrls: ["./reports.page.scss"],
})
export class ReportsPage implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private analyticsSubscription?: Subscription;

  // Chart data for ng2-charts
  public statusChartData: ChartData<"doughnut"> = {
    labels: [],
    datasets: [],
  };
  public statusChartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage =
              total > 0 ? Math.round((context.parsed * 100) / total) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };
  public statusChartType: "doughnut" = "doughnut";

  // Project distribution chart
  public projectChartData: ChartData<"bar"> = {
    labels: [],
    datasets: [],
  };
  public projectChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Projects",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };
  public projectChartType: "bar" = "bar";

  // Monthly trend chart
  public trendChartData: ChartData<"line"> = {
    labels: [],
    datasets: [],
  };
  public trendChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time Period",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };
  public trendChartType: "line" = "line";

  // User and account information
  authUser$: Observable<AuthUser | null>;
  currentAccountId: string = "";
  availableProjects$: Observable<Project[]> = new Observable();
  availableUsers$: Observable<RelatedAccount[]> = new Observable();

  // Analytics data
  analytics$: Observable<TimeTrackingAnalytics | null> = new Observable();
  currentAnalytics: TimeTrackingAnalytics | null = null;
  isLoading = false;
  error: string | null = null;

  // Report configuration
  availableReports: ReportConfig[] = [
    {
      name: "Monthly Report",
      description: "Volunteer hours and activities for the current month",
      type: "monthly",
      icon: "calendar-outline",
      enabled: true,
    },
    {
      name: "Quarterly Report",
      description: "Comprehensive volunteer impact for the quarter",
      type: "quarterly",
      icon: "bar-chart-outline",
      enabled: true,
    },
    {
      name: "Yearly Summary",
      description: "Annual volunteer contribution analysis",
      type: "yearly",
      icon: "trophy-outline",
      enabled: true,
    },
    {
      name: "User Report",
      description: "Individual volunteer contribution details",
      type: "user",
      icon: "person-outline",
      enabled: true,
    },
    {
      name: "Project Report",
      description: "Project-specific time tracking analysis",
      type: "project",
      icon: "folder-outline",
      enabled: true,
    },
    {
      name: "Custom Report",
      description: "Generate custom reports with date ranges and filters",
      type: "custom",
      icon: "filter-outline",
      enabled: true,
    },
  ];

  // Current report settings
  selectedReportType: ReportConfig["type"] = "monthly";
  selectedUserId: string = "";
  selectedProjectId: string = "";
  customStartDate: string = "";
  customEndDate: string = "";

  constructor(
    private store: Store,
    private analyticsService: AnalyticsService,
    private route: ActivatedRoute,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
  }

  ngOnInit() {
    // Get accountId from route parameters
    this.currentAccountId = this.route.snapshot.paramMap.get("accountId") ?? "";

    if (this.currentAccountId) {
      // Dispatch action to load projects into the store
      this.store.dispatch(
        ProjectsActions.loadProjects({accountId: this.currentAccountId}),
      );

      this.loadAvailableProjects();
      this.loadAvailableUsers();
      this.generateReport();
    }
  }

  ngAfterViewInit() {
    // Charts will be initialized when analytics data is loaded
  }

  ngOnDestroy() {
    // Clean up analytics subscription
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAvailableProjects() {
    this.availableProjects$ = this.store.select(
      selectActiveProjectsByAccount(this.currentAccountId),
    );
  }

  private loadAvailableUsers() {
    this.availableUsers$ = this.store
      .select(selectRelatedAccountsByAccountId(this.currentAccountId))
      .pipe(
        map((relatedAccounts) =>
          relatedAccounts.filter(
            (account) =>
              account.status === "accepted" && account.type === "user",
          ),
        ),
      );
  }

  /**
   * Generate report based on current settings
   */
  generateReport() {
    if (!this.currentAccountId) return;

    // Unsubscribe from any existing analytics subscription
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }

    this.isLoading = true;
    this.error = null;

    const filters: TimeTrackingReportFilters = {
      accountId: this.currentAccountId,
    };

    // Add filters based on report type
    switch (this.selectedReportType) {
      case "monthly":
        this.analytics$ = this.analyticsService.getMonthlyTimeTrackingReport(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          this.currentAccountId,
        );
        break;

      case "quarterly":
        const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
        this.analytics$ = this.analyticsService.getQuarterlyTimeTrackingReport(
          new Date().getFullYear(),
          currentQuarter,
          this.currentAccountId,
        );
        break;

      case "yearly":
        filters.startDate = new Date(new Date().getFullYear(), 0, 1);
        filters.endDate = new Date(new Date().getFullYear(), 11, 31);
        this.analytics$ =
          this.analyticsService.getTimeTrackingAnalytics(filters);
        break;

      case "user":
        if (this.selectedUserId) {
          filters.userId = this.selectedUserId;
        }
        this.analytics$ =
          this.analyticsService.getTimeTrackingAnalytics(filters);
        break;

      case "project":
        if (this.selectedProjectId) {
          filters.projectId = this.selectedProjectId;
        }
        this.analytics$ =
          this.analyticsService.getTimeTrackingAnalytics(filters);
        break;

      case "custom":
        if (this.customStartDate) {
          filters.startDate = new Date(this.customStartDate);
        }
        if (this.customEndDate) {
          filters.endDate = new Date(this.customEndDate);
        }
        this.analytics$ =
          this.analyticsService.getTimeTrackingAnalytics(filters);
        break;

      default:
        this.analytics$ =
          this.analyticsService.getTimeTrackingAnalytics(filters);
    }

    // Handle loading state and create charts when data is ready
    this.analyticsSubscription = this.analytics$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (analytics) => {
          this.isLoading = false;
          this.currentAnalytics = analytics;
          if (analytics) {
            // Update chart data when analytics data is available
            this.updateChartData(analytics);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.error = "Failed to load report data. Please try again.";
          this.currentAnalytics = null;
          console.error("Analytics error:", error);
        },
      });
  }

  /**
   * Updates chart data for ng2-charts
   */
  private updateChartData(analytics: TimeTrackingAnalytics) {
    // Update status chart data
    const statusEntries = Object.entries(analytics.entriesByStatus);
    this.statusChartData = {
      labels: statusEntries.map(
        ([status]) => status.charAt(0).toUpperCase() + status.slice(1),
      ),
      datasets: [
        {
          data: statusEntries.map(([, count]) => count),
          backgroundColor: [
            "#4CAF50", // Green for approved
            "#FFC107", // Amber for pending
            "#F44336", // Red for rejected
            "#9E9E9E", // Grey for draft
          ],
          borderWidth: 0,
        },
      ],
    };

    // Update project distribution chart
    const projectEntries = Object.entries(analytics.entriesByProject);
    const topProjects = projectEntries
      .sort(([, a], [, b]) => b.hours - a.hours)
      .slice(0, 10); // Show top 10 projects

    this.projectChartData = {
      labels: topProjects.map(([, project]) => project.name || "Unknown"),
      datasets: [
        {
          label: "Hours",
          data: topProjects.map(([, project]) => project.hours),
          backgroundColor: "#3880FF",
          borderColor: "#3880FF",
          borderWidth: 1,
        },
      ],
    };

    // Update monthly trend chart
    const monthlyEntries = Object.entries(analytics.monthlyStats);
    const sortedMonths = monthlyEntries.sort(([a], [b]) => a.localeCompare(b));

    this.trendChartData = {
      labels: sortedMonths.map(([month]) => month),
      datasets: [
        {
          label: "Total Hours",
          data: sortedMonths.map(([, stats]) => stats.hours),
          borderColor: "#3880FF",
          backgroundColor: "rgba(56, 128, 255, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Approved Hours",
          data: sortedMonths.map(([, stats]) => stats.approvedHours),
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }

  /**
   * Handle report type selection
   */
  onReportTypeChange(reportType: ReportConfig["type"]) {
    this.selectedReportType = reportType;
    this.generateReport();
  }

  /**
   * Handle user selection for user reports
   */
  onUserSelectionChange(userId: string) {
    this.selectedUserId = userId;
    if (this.selectedReportType === "user") {
      this.generateReport();
    }
  }

  /**
   * Handle project selection for project reports
   */
  onProjectSelectionChange(projectId: string) {
    this.selectedProjectId = projectId;
    if (this.selectedReportType === "project") {
      this.generateReport();
    }
  }

  /**
   * Export current report data as CSV
   */
  async exportToCSV() {
    if (!this.currentAccountId) return;

    try {
      const filters: TimeTrackingReportFilters = {
        accountId: this.currentAccountId,
      };

      // Apply current report filters
      if (this.selectedUserId) filters.userId = this.selectedUserId;
      if (this.selectedProjectId) filters.projectId = this.selectedProjectId;
      if (this.customStartDate)
        filters.startDate = new Date(this.customStartDate);
      if (this.customEndDate) filters.endDate = new Date(this.customEndDate);

      this.analyticsService
        .exportTimeTrackingData(filters)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.downloadCSV(data);
        });
    } catch (error) {
      console.error("Export error:", error);
      this.error = "Failed to export data. Please try again.";
    }
  }

  /**
   * Download data as CSV file
   */
  private downloadCSV(data: any[]) {
    if (data.length === 0) {
      this.error = "No data available for export.";
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape quotes and wrap in quotes if necessary
            return typeof value === "string" && value.includes(",")
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `time-tracking-report-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Get chart data for visualizations
   */
  getChartData(analytics: TimeTrackingAnalytics | null) {
    if (!analytics) return null;

    return {
      statusPieChart: {
        labels: Object.keys(analytics.entriesByStatus),
        data: Object.values(analytics.entriesByStatus),
      },
      monthlyTrendChart: {
        labels: Object.keys(analytics.monthlyStats).sort(),
        data: Object.keys(analytics.monthlyStats)
          .sort()
          .map((month) => analytics.monthlyStats[month].hours),
      },
      dayOfWeekChart: {
        labels: Object.keys(analytics.timeDistribution.byDayOfWeek),
        data: Object.values(analytics.timeDistribution.byDayOfWeek),
      },
    };
  }

  /**
   * Get summary statistics for display
   */
  getSummaryStats(analytics: TimeTrackingAnalytics | null) {
    if (!analytics) return null;

    return [
      {
        label: "Total Hours",
        value: analytics.totalHours,
        icon: "time-outline",
        color: "primary",
      },
      {
        label: "Approved Hours",
        value: analytics.totalApprovedHours,
        icon: "checkmark-circle-outline",
        color: "success",
      },
      {
        label: "Total Entries",
        value: analytics.totalEntries,
        icon: "list-outline",
        color: "medium",
      },
      {
        label: "Approval Rate",
        value: `${analytics.approvalMetrics.approvalRate.toFixed(1)}%`,
        icon: "trending-up-outline",
        color: "warning",
      },
    ];
  }

  /**
   * Refresh current report
   */
  refreshReport() {
    this.generateReport();
  }
}
