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
  CSVExportOptions,
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
import {StandardProjectCategory} from "../../../../../../shared/models/standard-project-template.model";
import {
  ChartData,
  ChartOptions,
  ChartType,
  Chart,
  DoughnutController,
  BarController,
  LineController,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
Chart.register(
  DoughnutController,
  BarController,
  LineController,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export interface ReportConfig {
  name: string;
  description: string;
  type:
    | "monthly"
    | "quarterly"
    | "yearly"
    | "custom"
    | "user"
    | "project"
    | "category";
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
  isExporting = false;
  exportProgress = 0;
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
      name: "Category Report",
      description: "Analyze time distribution across project categories",
      type: "category",
      icon: "pie-chart-outline",
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
  selectedCategoryId: StandardProjectCategory | "" = "";
  customStartDate: string = "";
  customEndDate: string = "";

  // Available categories for filtering
  availableCategories: StandardProjectCategory[] = [
    "Volunteer",
    "Fundraising",
    "Event",
    "Education",
    "Outreach",
    "Research",
    "Operations",
    "Marketing",
    "Technology",
    "General",
  ];

  // Category-based analytics
  categoryChartData: ChartData<"doughnut"> = {
    labels: [],
    datasets: [],
  };

  // CSV Export configuration
  showExportModal = false;
  exportConfig = {
    format: "detailed" as "detailed" | "summary" | "analytics",
    dateFormat: "ISO" as "ISO" | "US" | "EU",
    includeCalculatedFields: true,
    includeHeaders: true,
    selectedColumns: [] as string[],
  };

  availableColumns = [
    {key: "entryId", label: "Entry ID", category: "Basic"},
    {key: "accountId", label: "Account ID", category: "Basic"},
    {key: "projectId", label: "Project ID", category: "Basic"},
    {key: "projectName", label: "Project Name", category: "Basic"},
    {key: "projectCategory", label: "Project Category", category: "Basic"},
    {key: "userId", label: "User ID", category: "Basic"},
    {key: "userName", label: "User Name", category: "Basic"},
    {key: "date", label: "Date", category: "Basic"},
    {key: "hours", label: "Hours", category: "Basic"},
    {key: "status", label: "Status", category: "Basic"},
    {key: "notes", label: "Notes", category: "Basic"},
    {key: "approvedBy", label: "Approved By", category: "Approval"},
    {key: "approvedAt", label: "Approved At", category: "Approval"},
    {key: "createdAt", label: "Created At", category: "Timestamps"},
    {key: "lastModified", label: "Last Modified", category: "Timestamps"},
    {key: "dayOfWeek", label: "Day of Week", category: "Calculated"},
    {key: "weekNumber", label: "Week Number", category: "Calculated"},
    {key: "monthYear", label: "Month Year", category: "Calculated"},
    {key: "daysToApproval", label: "Days to Approval", category: "Calculated"},
    {key: "isApproved", label: "Is Approved", category: "Calculated"},
    {key: "isWeekend", label: "Is Weekend", category: "Calculated"},
  ];
  categoryChartOptions: ChartOptions<"doughnut"> = {
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
            return `${context.label}: ${context.parsed} hrs (${percentage}%)`;
          },
        },
      },
    },
  };
  categoryChartType: "doughnut" = "doughnut";

  constructor(
    private store: Store,
    private analyticsService: AnalyticsService,
    private route: ActivatedRoute,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
  }

  ngOnInit() {
    // Get accountId from route parameters (supports both query and path params for backward compatibility)
    this.currentAccountId =
      this.route.snapshot.queryParamMap.get("accountId") ??
      this.route.snapshot.paramMap.get("accountId") ??
      "";

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
    if (!this.currentAccountId) {
      this.error = "Account ID is required to generate reports.";
      return;
    }

    // Validate date range if custom dates are provided
    if (this.customStartDate && this.customEndDate) {
      const startDate = new Date(this.customStartDate);
      const endDate = new Date(this.customEndDate);

      if (startDate > endDate) {
        this.error = "Start date cannot be later than end date.";
        return;
      }
    }

    // Unsubscribe from any existing analytics subscription
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }

    this.isLoading = true;
    this.error = null;

    const filters: TimeTrackingReportFilters = {
      accountId: this.currentAccountId,
    };

    // Add common filters that apply to all report types
    if (this.selectedUserId && this.selectedReportType !== "user") {
      filters.userId = this.selectedUserId;
    }
    if (this.selectedProjectId && this.selectedReportType !== "project") {
      filters.projectId = this.selectedProjectId;
    }
    if (this.selectedCategoryId) {
      filters.category = this.selectedCategoryId;
    }
    if (this.customStartDate) {
      filters.startDate = new Date(this.customStartDate);
    }
    if (this.customEndDate) {
      filters.endDate = new Date(this.customEndDate);
    }

    // Add filters based on report type
    switch (this.selectedReportType) {
      case "monthly":
        // Pass additional filters to monthly report
        const monthlyAdditionalFilters: Partial<TimeTrackingReportFilters> = {};
        if (this.selectedUserId)
          monthlyAdditionalFilters.userId = this.selectedUserId;
        if (this.selectedProjectId)
          monthlyAdditionalFilters.projectId = this.selectedProjectId;
        if (this.selectedCategoryId)
          monthlyAdditionalFilters.category = this.selectedCategoryId;

        this.analytics$ = this.analyticsService.getMonthlyTimeTrackingReport(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          this.currentAccountId,
          monthlyAdditionalFilters,
        );
        break;

      case "quarterly":
        // Pass additional filters to quarterly report
        const quarterlyAdditionalFilters: Partial<TimeTrackingReportFilters> =
          {};
        if (this.selectedUserId)
          quarterlyAdditionalFilters.userId = this.selectedUserId;
        if (this.selectedProjectId)
          quarterlyAdditionalFilters.projectId = this.selectedProjectId;
        if (this.selectedCategoryId)
          quarterlyAdditionalFilters.category = this.selectedCategoryId;

        const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
        this.analytics$ = this.analyticsService.getQuarterlyTimeTrackingReport(
          new Date().getFullYear(),
          currentQuarter,
          this.currentAccountId,
          quarterlyAdditionalFilters,
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

      case "category":
        // For category reports, we'll get all data and process it client-side
        // to group by categories
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
          this.currentAnalytics = null;

          // Handle specific validation errors
          if (error.message.includes("accountId is required")) {
            this.error = "Account ID is required to generate reports.";
          } else if (error.message.includes("Start date cannot be later")) {
            this.error = "Start date cannot be later than end date.";
          } else if (error.message.includes("Invalid")) {
            this.error = `Validation error: ${error.message}`;
          } else {
            this.error = "Failed to load report data. Please try again.";
          }

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

    // Update category chart data (for category reports)
    this.updateCategoryChartData(analytics);
  }

  /**
   * Update category chart data based on project categories
   */
  private updateCategoryChartData(analytics: TimeTrackingAnalytics) {
    // Get projects data and group by category
    const categoryHours: Record<StandardProjectCategory, number> = {
      Volunteer: 0,
      Fundraising: 0,
      Event: 0,
      Education: 0,
      Outreach: 0,
      Research: 0,
      Operations: 0,
      Marketing: 0,
      Technology: 0,
      General: 0,
    };

    // Subscribe to projects to get category information
    this.availableProjects$
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => {
        // Reset category hours
        Object.keys(categoryHours).forEach((key) => {
          categoryHours[key as StandardProjectCategory] = 0;
        });

        // Group project hours by category
        Object.entries(analytics.entriesByProject).forEach(
          ([projectId, projectData]) => {
            const project = projects.find((p) => p.id === projectId);
            const category = project?.standardCategory || "General";
            categoryHours[category] += projectData.hours;
          },
        );

        // Create chart data for categories with hours > 0
        const categoryEntries = Object.entries(categoryHours).filter(
          ([, hours]) => hours > 0,
        );

        this.categoryChartData = {
          labels: categoryEntries.map(([category]) => category),
          datasets: [
            {
              data: categoryEntries.map(([, hours]) => hours),
              backgroundColor: [
                "#FF6B6B", // Volunteer - Red
                "#4ECDC4", // Fundraising - Teal
                "#45B7D1", // Event - Blue
                "#96CEB4", // Education - Green
                "#FFEAA7", // Outreach - Yellow
                "#DDA0DD", // Research - Plum
                "#FFB347", // Operations - Orange
                "#87CEEB", // Marketing - Sky Blue
                "#98D8C8", // Technology - Mint
                "#F7DC6F", // General - Light Yellow
              ],
              borderWidth: 0,
            },
          ],
        };
      });
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
   * Handle category selection for category filtering
   */
  onCategorySelectionChange(categoryId: StandardProjectCategory | "") {
    this.selectedCategoryId = categoryId;
    // Category filtering can be applied to any report type
    this.generateReport();
  }

  /**
   * Get total hours across all categories for percentage calculations
   */
  getTotalCategoryHours(): number {
    if (this.categoryChartData.datasets.length === 0) return 0;

    return this.categoryChartData.datasets[0].data.reduce(
      (total: number, hours: number) => total + hours,
      0,
    );
  }

  /**
   * Get category color for a specific index
   */
  getCategoryColor(index: number): string {
    if (
      this.categoryChartData.datasets.length === 0 ||
      !this.categoryChartData.datasets[0].backgroundColor ||
      !Array.isArray(this.categoryChartData.datasets[0].backgroundColor)
    ) {
      return "#3880FF"; // Default color
    }

    const colors = this.categoryChartData.datasets[0]
      .backgroundColor as string[];
    return colors[index] || "#3880FF";
  }

  /**
   * Get category hours for a specific index
   */
  getCategoryHours(index: number): number {
    if (this.categoryChartData.datasets.length === 0) return 0;

    return (this.categoryChartData.datasets[0].data[index] as number) || 0;
  }

  /**
   * Export current report data as CSV with enhanced options
   */
  async exportToCSV(format: "detailed" | "summary" | "analytics" = "detailed") {
    if (!this.currentAccountId) {
      this.error = "Account ID is required to export data.";
      return;
    }

    // Reset any previous errors
    this.error = null;
    this.isExporting = true;
    this.exportProgress = 0;

    try {
      const filters: TimeTrackingReportFilters = {
        accountId: this.currentAccountId,
      };

      // Apply current report filters
      if (this.selectedUserId) filters.userId = this.selectedUserId;
      if (this.selectedProjectId) filters.projectId = this.selectedProjectId;
      if (this.selectedCategoryId) filters.category = this.selectedCategoryId;
      if (this.customStartDate)
        filters.startDate = new Date(this.customStartDate);
      if (this.customEndDate) filters.endDate = new Date(this.customEndDate);

      const exportOptions: CSVExportOptions = {
        format,
        includeHeaders: true,
        dateFormat: "ISO",
        includeCalculatedFields: format === "detailed",
      };

      // Simulate progress for better UX
      this.exportProgress = 25;

      this.analyticsService
        .exportTimeTrackingData(filters, exportOptions)
        .pipe(
          takeUntil(this.destroy$),
          // Add a delay to show progress for small datasets
          map((data) => {
            this.exportProgress = 75;
            return data;
          }),
        )
        .subscribe({
          next: (data) => {
            this.exportProgress = 100;
            this.downloadCSV(data, format, filters);
            this.isExporting = false;
            this.exportProgress = 0;
          },
          error: (error) => {
            this.isExporting = false;
            this.exportProgress = 0;
            console.error("Export error:", error);

            // Handle specific error types
            if (error.message?.includes("accountId is required")) {
              this.error = "Account ID is required to export data.";
            } else if (error.message?.includes("No data found")) {
              this.error = "No data available for the selected filters.";
            } else if (error.message?.includes("network")) {
              this.error =
                "Network error occurred during export. Please check your connection.";
            } else {
              this.error = "Failed to export data. Please try again.";
            }
          },
        });
    } catch (error) {
      this.isExporting = false;
      this.exportProgress = 0;
      console.error("Export setup error:", error);
      this.error = "Failed to initialize export. Please try again.";
    }
  }

  /**
   * Download data as CSV file with enhanced error handling
   */
  private downloadCSV(
    data: any[],
    format: string,
    filters: TimeTrackingReportFilters,
  ) {
    if (!data || data.length === 0) {
      this.error = "No data available for export with the current filters.";
      this.isExporting = false;
      this.exportProgress = 0;
      return;
    }

    try {
      const headers = Object.keys(data[0]);

      // Validate that we have valid data structure
      if (!headers || headers.length === 0) {
        throw new Error("Invalid data structure for CSV export");
      }

      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              // Enhanced CSV escaping
              if (value === null || value === undefined) {
                return "";
              }
              const stringValue = String(value);
              // Escape quotes and wrap in quotes if necessary
              return stringValue.includes(",") ||
                stringValue.includes('"') ||
                stringValue.includes("\n") ||
                stringValue.includes("\r")
                ? `"${stringValue.replace(/"/g, '""')}"`
                : stringValue;
            })
            .join(","),
        ),
      ].join("\n");

      // Add BOM for UTF-8 encoding to ensure special characters display correctly
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      // Check if blob was created successfully
      if (!blob || blob.size === 0) {
        throw new Error("Failed to create CSV file");
      }

      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          this.generateCSVFilename(format, filters),
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        setTimeout(() => URL.revokeObjectURL(url), 100);

        // Show success message
        console.log(
          `Successfully exported ${data.length} records as ${format} CSV`,
        );
      } else {
        throw new Error("CSV download is not supported in this browser");
      }
    } catch (error) {
      console.error("CSV download error:", error);
      this.error = "Failed to download CSV file. Please try again.";
      this.isExporting = false;
      this.exportProgress = 0;
    }
  }

  /**
   * Generate descriptive filename for CSV export
   */
  private generateCSVFilename(
    format: string,
    filters: TimeTrackingReportFilters,
  ): string {
    const datePart = new Date().toISOString().split("T")[0];
    const reportType = this.selectedReportType || "custom";

    let filename = `time-tracking-${format}-${reportType}-${datePart}`;

    // Add filter details to filename
    const filterParts: string[] = [];

    if (filters.userId && this.selectedReportType !== "user") {
      // Try to find user name from available users
      this.availableUsers$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
        const user = users.find((u) => u.id === filters.userId);
        if (user) {
          filterParts.push(`user-${user.name?.replace(/[^a-zA-Z0-9]/g, "")}`);
        }
      });
    }

    if (filters.projectId && this.selectedReportType !== "project") {
      // Try to find project name from available projects
      this.availableProjects$
        .pipe(takeUntil(this.destroy$))
        .subscribe((projects) => {
          const project = projects.find((p) => p.id === filters.projectId);
          if (project) {
            filterParts.push(
              `project-${project.name?.replace(/[^a-zA-Z0-9]/g, "")}`,
            );
          }
        });
    }

    if (filters.category) {
      filterParts.push(`category-${filters.category}`);
    }

    if (filters.status) {
      filterParts.push(`status-${filters.status}`);
    }

    if (filters.startDate || filters.endDate) {
      const startStr = filters.startDate
        ? filters.startDate.toISOString().split("T")[0]
        : "start";
      const endStr = filters.endDate
        ? filters.endDate.toISOString().split("T")[0]
        : "end";
      filterParts.push(`${startStr}-to-${endStr}`);
    }

    if (filterParts.length > 0) {
      filename += `-${filterParts.join("-")}`;
    }

    return `${filename}.csv`;
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

  /**
   * Show export configuration modal
   */
  showExportConfiguration() {
    this.showExportModal = true;

    // Initialize selected columns based on format
    if (this.exportConfig.selectedColumns.length === 0) {
      this.resetColumnSelection();
    }
  }

  /**
   * Hide export configuration modal
   */
  hideExportConfiguration() {
    this.showExportModal = false;
  }

  /**
   * Reset column selection based on format
   */
  resetColumnSelection() {
    const basicColumns = this.availableColumns
      .filter((col) => col.category === "Basic")
      .map((col) => col.key);

    switch (this.exportConfig.format) {
      case "detailed":
        this.exportConfig.selectedColumns = this.availableColumns.map(
          (col) => col.key,
        );
        break;
      case "summary":
        this.exportConfig.selectedColumns = [
          "userId",
          "userName",
          "projectId",
          "projectName",
          "projectCategory",
        ];
        break;
      case "analytics":
        this.exportConfig.selectedColumns = ["metric", "value", "category"];
        break;
      default:
        this.exportConfig.selectedColumns = basicColumns;
    }
  }

  /**
   * Toggle column selection
   */
  toggleColumn(columnKey: string) {
    const index = this.exportConfig.selectedColumns.indexOf(columnKey);
    if (index > -1) {
      this.exportConfig.selectedColumns.splice(index, 1);
    } else {
      this.exportConfig.selectedColumns.push(columnKey);
    }
  }

  /**
   * Check if column is selected
   */
  isColumnSelected(columnKey: string): boolean {
    return this.exportConfig.selectedColumns.includes(columnKey);
  }

  /**
   * Export with current configuration
   */
  exportWithConfig() {
    const options: CSVExportOptions = {
      format: this.exportConfig.format,
      dateFormat: this.exportConfig.dateFormat,
      includeCalculatedFields: this.exportConfig.includeCalculatedFields,
      includeHeaders: this.exportConfig.includeHeaders,
      customColumns: this.exportConfig.selectedColumns,
    };

    this.hideExportConfiguration();
    this.exportToCSVWithOptions(options);
  }

  /**
   * Export to CSV with custom options
   */
  private exportToCSVWithOptions(options: CSVExportOptions) {
    if (!this.currentAccountId) {
      this.error = "Account ID is required to export data.";
      return;
    }

    this.error = null;
    this.isExporting = true;
    this.exportProgress = 0;

    try {
      const filters: TimeTrackingReportFilters = {
        accountId: this.currentAccountId,
      };

      // Apply current report filters
      if (this.selectedUserId) filters.userId = this.selectedUserId;
      if (this.selectedProjectId) filters.projectId = this.selectedProjectId;
      if (this.selectedCategoryId) filters.category = this.selectedCategoryId;
      if (this.customStartDate)
        filters.startDate = new Date(this.customStartDate);
      if (this.customEndDate) filters.endDate = new Date(this.customEndDate);

      this.exportProgress = 25;

      this.analyticsService
        .exportTimeTrackingData(filters, options)
        .pipe(
          takeUntil(this.destroy$),
          map((data) => {
            this.exportProgress = 75;
            return data;
          }),
        )
        .subscribe({
          next: (data) => {
            this.exportProgress = 100;
            this.downloadCSV(data, options.format, filters);
            this.isExporting = false;
            this.exportProgress = 0;
          },
          error: (error) => {
            this.isExporting = false;
            this.exportProgress = 0;
            console.error("Export error:", error);
            this.error = "Failed to export data. Please try again.";
          },
        });
    } catch (error) {
      this.isExporting = false;
      this.exportProgress = 0;
      console.error("Export setup error:", error);
      this.error = "Failed to initialize export. Please try again.";
    }
  }
}
