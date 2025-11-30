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
import {trigger, state, style, animate, transition} from "@angular/animations";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {
  Observable,
  Subject,
  combineLatest,
  Subscription,
  BehaviorSubject,
} from "rxjs";
import {takeUntil, map, debounceTime, skip, take} from "rxjs/operators";
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
  AlertController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import {
  UserDetailModalComponent,
  UserDetailData,
  UserTimeEntry,
} from "../../components/user-detail-modal/user-detail-modal.component";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  type: "overview" | "user" | "project" | "category";
  icon: string;
  enabled: boolean;
}

export type DateRangePreset =
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "this_quarter"
  | "last_quarter"
  | "this_year"
  | "last_year"
  | "custom";

export interface SavedReportConfig {
  id: string;
  name: string;
  createdAt: string;
  reportType: string;
  datePreset: DateRangePreset;
  customStartDate?: string;
  customEndDate?: string;
  selectedUserId?: string;
  selectedProjectId?: string;
  selectedCategoryId?: string;
  autoGenerateEnabled: boolean;
}

const SAVED_CONFIGS_STORAGE_KEY = "reports-saved-configurations";

// Configuration constants
const AUTO_GENERATE_DEBOUNCE_MS = 500;
const URL_REVOKE_DELAY_MS = 100;
const DATE_PICKER_MIN_YEAR = 2020;
const DATE_PICKER_MAX_YEAR = 2030;

/**
 * Interface for date range calculation result
 */
interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Calculate start and end dates for a given date range preset
 * @param preset - The date range preset to calculate
 * @returns DateRange with start and end dates, or null for 'custom' preset
 */
function calculateDateRange(preset: DateRangePreset): DateRange | null {
  if (preset === "custom") {
    return null;
  }

  const today = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (preset) {
    case "this_week":
      // Week starts on Sunday
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "last_week":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "this_month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "last_month":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "this_quarter": {
      const currentQuarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
      endDate = new Date(today.getFullYear(), currentQuarter * 3 + 3, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    }

    case "last_quarter": {
      const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
      const yearForQuarter =
        lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
      const adjustedQuarter = lastQuarter < 0 ? 3 : lastQuarter;
      startDate = new Date(yearForQuarter, adjustedQuarter * 3, 1);
      endDate = new Date(yearForQuarter, adjustedQuarter * 3 + 3, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    }

    case "this_year":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "last_year":
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      return null;
  }

  return {startDate, endDate};
}

@Component({
  selector: "app-reports",
  templateUrl: "./reports.page.html",
  styleUrls: ["./reports.page.scss"],
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [
        style({opacity: 0}),
        animate("200ms ease-in", style({opacity: 1})),
      ]),
      transition(":leave", [animate("150ms ease-out", style({opacity: 0}))]),
    ]),
  ],
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

  // Report configuration - focused on WHAT to analyze, not WHEN
  availableReports: ReportConfig[] = [
    {
      name: "Overview",
      description: "Summary of all time tracking with charts and breakdowns",
      type: "overview",
      icon: "analytics-outline",
      enabled: true,
    },
    {
      name: "By User",
      description: "Individual volunteer contribution details",
      type: "user",
      icon: "person-outline",
      enabled: true,
    },
    {
      name: "By Project",
      description: "Project-specific time tracking analysis",
      type: "project",
      icon: "folder-outline",
      enabled: true,
    },
    {
      name: "By Category",
      description: "Analyze time distribution across project categories",
      type: "category",
      icon: "pie-chart-outline",
      enabled: true,
    },
  ];

  // Current report settings
  selectedReportType: ReportConfig["type"] = "overview";
  selectedUserId: string = "";
  selectedProjectId: string = "";
  selectedCategoryId: StandardProjectCategory | "" = "";
  customStartDate: string = "";
  customEndDate: string = "";

  // Date range presets
  selectedDatePreset: DateRangePreset = "this_month";
  dateRangePresets: {key: DateRangePreset; label: string; icon: string}[] = [
    {key: "this_week", label: "This Week", icon: "today-outline"},
    {key: "last_week", label: "Last Week", icon: "calendar-outline"},
    {key: "this_month", label: "This Month", icon: "calendar-outline"},
    {key: "last_month", label: "Last Month", icon: "calendar-outline"},
    {key: "this_quarter", label: "This Quarter", icon: "stats-chart-outline"},
    {key: "last_quarter", label: "Last Quarter", icon: "stats-chart-outline"},
    {key: "this_year", label: "This Year", icon: "calendar-outline"},
    {key: "last_year", label: "Last Year", icon: "calendar-outline"},
    {key: "custom", label: "Custom Range", icon: "options-outline"},
  ];

  // Auto-generate configuration
  autoGenerateEnabled = true;
  private filterChange$ = new BehaviorSubject<void>(undefined);

  // Cached data for synchronous access (used in filename generation)
  private cachedUsers: RelatedAccount[] = [];
  private cachedProjects: Project[] = [];

  // Saved report configurations
  savedConfigs: SavedReportConfig[] = [];
  showSaveConfigModal = false;
  newConfigName = "";
  selectedSavedConfig: SavedReportConfig | null = null;

  // Period Comparison Mode
  comparisonEnabled = false;
  comparisonDatePreset: DateRangePreset = "last_month";
  comparisonStartDate: string = "";
  comparisonEndDate: string = "";
  comparisonAnalytics: TimeTrackingAnalytics | null = null;

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

  // PDF Export configuration
  @ViewChild("reportContent") reportContent!: ElementRef;
  isExportingPDF = false;
  pdfExportProgress = 0;
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
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.initializeChartClickHandlers();
  }

  /**
   * Initialize click handlers for interactive charts
   */
  private initializeChartClickHandlers(): void {
    // Add onClick handlers to chart options
    this.projectChartOptions.onClick = (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chart.data.labels?.[index] as string;
        const value = chart.data.datasets[0]?.data[index] as number;
        this.showChartItemDetails("project", label, value);
      }
    };

    this.statusChartOptions.onClick = (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chart.data.labels?.[index] as string;
        const value = chart.data.datasets[0]?.data[index] as number;
        this.showChartItemDetails("status", label, value);
      }
    };

    this.categoryChartOptions.onClick = (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chart.data.labels?.[index] as string;
        const value = chart.data.datasets[0]?.data[index] as number;
        this.showChartItemDetails("category", label, value);
      }
    };

    // Update cursor style to indicate clickability
    this.projectChartOptions.onHover = (event, elements) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = elements.length > 0 ? "pointer" : "default";
      }
    };

    this.statusChartOptions.onHover = (event, elements) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = elements.length > 0 ? "pointer" : "default";
      }
    };

    this.categoryChartOptions.onHover = (event, elements) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = elements.length > 0 ? "pointer" : "default";
      }
    };
  }

  /**
   * Show details toast when clicking on a chart element
   */
  async showChartItemDetails(
    type: "project" | "status" | "category",
    label: string,
    value: number,
  ): Promise<void> {
    const totalHours = this.currentAnalytics?.totalHours || 1;
    const percentage = ((value / totalHours) * 100).toFixed(1);

    let message = "";
    switch (type) {
      case "project":
        message = `${label}: ${value.toFixed(1)} hours (${percentage}% of total)`;
        break;
      case "status":
        message = `${label}: ${value.toFixed(1)} hours (${percentage}% of total)`;
        break;
      case "category":
        message = `${label}: ${value.toFixed(1)} hours (${percentage}% of total)`;
        break;
    }

    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: "bottom",
      color: "dark",
      cssClass: "chart-detail-toast",
      buttons: [
        {
          icon: "close",
          role: "cancel",
        },
      ],
    });
    await toast.present();
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

      // Load saved configurations
      this.loadSavedConfigs();

      // Set up auto-generate on filter change with debounce
      this.setupAutoGenerate();

      // Apply default date preset and generate initial report
      this.applyDatePreset(this.selectedDatePreset);
    }
  }

  /**
   * Set up auto-generate subscription with debounce
   */
  private setupAutoGenerate() {
    this.filterChange$
      .pipe(
        skip(1), // Skip the initial value
        debounceTime(AUTO_GENERATE_DEBOUNCE_MS),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        if (this.autoGenerateEnabled) {
          this.generateReport();
        }
      });
  }

  /**
   * Trigger filter change for auto-generate
   */
  private triggerFilterChange() {
    this.filterChange$.next();
  }

  ngAfterViewInit() {
    // Charts will be initialized when analytics data is loaded
  }

  ngOnDestroy() {
    // Clean up analytics subscription
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }

    this.filterChange$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // Saved Report Configurations
  // ============================================================

  /**
   * Load saved configurations from localStorage
   */
  private loadSavedConfigs() {
    try {
      const stored = localStorage.getItem(
        SAVED_CONFIGS_STORAGE_KEY + "-" + this.currentAccountId,
      );
      if (stored) {
        this.savedConfigs = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading saved configurations:", error);
      this.savedConfigs = [];
    }
  }

  /**
   * Save current configuration
   */
  saveCurrentConfig() {
    if (!this.newConfigName.trim()) {
      return;
    }

    const config: SavedReportConfig = {
      id: `config-${Date.now()}`,
      name: this.newConfigName.trim(),
      createdAt: new Date().toISOString(),
      reportType: this.selectedReportType,
      datePreset: this.selectedDatePreset,
      customStartDate: this.customStartDate || undefined,
      customEndDate: this.customEndDate || undefined,
      selectedUserId: this.selectedUserId || undefined,
      selectedProjectId: this.selectedProjectId || undefined,
      selectedCategoryId: this.selectedCategoryId || undefined,
      autoGenerateEnabled: this.autoGenerateEnabled,
    };

    this.savedConfigs.push(config);
    this.saveSavedConfigs();

    // Reset modal
    this.newConfigName = "";
    this.showSaveConfigModal = false;
  }

  /**
   * Load a saved configuration
   */
  loadConfig(configId: string) {
    const config = this.savedConfigs.find((c) => c.id === configId);
    if (!config) {
      return;
    }

    this.selectedReportType =
      config.reportType as typeof this.selectedReportType;
    this.selectedDatePreset = config.datePreset;
    this.customStartDate = config.customStartDate || "";
    this.customEndDate = config.customEndDate || "";
    this.selectedUserId = config.selectedUserId || "";
    this.selectedProjectId = config.selectedProjectId || "";
    this.selectedCategoryId =
      (config.selectedCategoryId as StandardProjectCategory) || "";
    this.autoGenerateEnabled = config.autoGenerateEnabled;

    this.selectedSavedConfig = config;

    // Apply date preset
    if (config.datePreset !== "custom") {
      this.applyDatePreset(config.datePreset);
    }

    // Generate report with loaded config
    this.generateReport();
  }

  /**
   * Delete a saved configuration
   */
  deleteConfig(configId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.savedConfigs = this.savedConfigs.filter((c) => c.id !== configId);
    this.saveSavedConfigs();

    if (this.selectedSavedConfig?.id === configId) {
      this.selectedSavedConfig = null;
    }
  }

  /**
   * Save configurations to localStorage
   */
  private saveSavedConfigs() {
    try {
      localStorage.setItem(
        SAVED_CONFIGS_STORAGE_KEY + "-" + this.currentAccountId,
        JSON.stringify(this.savedConfigs),
      );
    } catch (error) {
      console.error("Error saving configurations:", error);
    }
  }

  /**
   * Open save configuration modal
   */
  async openSaveConfigModal() {
    const alert = await this.alertController.create({
      header: "Save Configuration",
      message: "Save your current filter settings for quick access later.",
      inputs: [
        {
          name: "configName",
          type: "text",
          placeholder: "e.g., Monthly Project Report",
          attributes: {
            maxlength: 50,
          },
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Save",
          handler: (data) => {
            if (data.configName && data.configName.trim()) {
              this.newConfigName = data.configName.trim();
              this.saveCurrentConfig();
              return true;
            }
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Close save configuration modal
   */
  closeSaveConfigModal() {
    this.showSaveConfigModal = false;
    this.newConfigName = "";
  }

  // ============================================================
  // Period Comparison Mode
  // ============================================================

  /**
   * Toggle comparison mode
   */
  toggleComparisonMode() {
    this.comparisonEnabled = !this.comparisonEnabled;
    if (this.comparisonEnabled) {
      // Auto-select comparison period based on current selection
      this.autoSelectComparisonPeriod();
      this.fetchComparisonData();
    } else {
      this.comparisonAnalytics = null;
    }
    this.triggerFilterChange();
  }

  /**
   * Auto-select a logical comparison period
   */
  private autoSelectComparisonPeriod() {
    const presetMap: Record<DateRangePreset, DateRangePreset> = {
      this_week: "last_week",
      last_week: "this_week",
      this_month: "last_month",
      last_month: "this_month",
      this_quarter: "last_quarter",
      last_quarter: "this_quarter",
      this_year: "last_year",
      last_year: "this_year",
      custom: "last_month",
    };
    this.comparisonDatePreset = presetMap[this.selectedDatePreset];
    this.applyComparisonDatePreset(this.comparisonDatePreset);
  }

  /**
   * Apply comparison date preset
   */
  applyComparisonDatePreset(preset: DateRangePreset) {
    this.comparisonDatePreset = preset;

    const dateRange = calculateDateRange(preset);
    if (!dateRange) {
      return;
    }

    this.comparisonStartDate = dateRange.startDate.toISOString();
    this.comparisonEndDate = dateRange.endDate.toISOString();
  }

  /**
   * Handle comparison date preset change
   */
  onComparisonDatePresetChange(preset: DateRangePreset) {
    this.applyComparisonDatePreset(preset);
    if (this.comparisonEnabled) {
      this.fetchComparisonData();
    }
  }

  /**
   * Fetch comparison period data
   */
  private fetchComparisonData() {
    if (!this.comparisonStartDate || !this.comparisonEndDate) {
      return;
    }

    const filters: TimeTrackingReportFilters = {
      accountId: this.currentAccountId,
      startDate: new Date(this.comparisonStartDate),
      endDate: new Date(this.comparisonEndDate),
    };

    // Apply same filters as main report
    if (this.selectedUserId) {
      filters.userId = this.selectedUserId;
    }
    if (this.selectedProjectId) {
      filters.projectId = this.selectedProjectId;
    }
    if (this.selectedCategoryId) {
      filters.category = this.selectedCategoryId;
    }

    this.analyticsService
      .getTimeTrackingAnalytics(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (analytics) => {
          this.comparisonAnalytics = analytics;
        },
        error: (error) => {
          console.error("Comparison analytics error:", error);
          this.comparisonAnalytics = null;
        },
      });
  }

  /**
   * Calculate percentage change between two values
   */
  getPercentageChange(current: number, comparison: number): number {
    if (comparison === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - comparison) / comparison) * 100;
  }

  /**
   * Get comparison display for a metric
   */
  getComparisonDisplay(
    current: number,
    comparison: number,
  ): {value: string; class: string; icon: string} {
    const change = this.getPercentageChange(current, comparison);
    const formatted = Math.abs(change).toFixed(1);

    if (change > 0) {
      return {
        value: `+${formatted}%`,
        class: "comparison-up",
        icon: "trending-up",
      };
    } else if (change < 0) {
      return {
        value: `-${formatted}%`,
        class: "comparison-down",
        icon: "trending-down",
      };
    } else {
      return {
        value: "0%",
        class: "comparison-neutral",
        icon: "remove",
      };
    }
  }

  /**
   * Get comparison date range display
   */
  getComparisonDateRangeDisplay(): string {
    if (!this.comparisonStartDate || !this.comparisonEndDate) {
      return "";
    }
    const start = new Date(this.comparisonStartDate);
    const end = new Date(this.comparisonEndDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }

  private loadAvailableProjects() {
    this.availableProjects$ = this.store.select(
      selectActiveProjectsByAccount(this.currentAccountId),
    );

    // Cache projects for synchronous access in filename generation
    this.availableProjects$
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => {
        this.cachedProjects = projects;
      });
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

    // Cache users for synchronous access in filename generation
    this.availableUsers$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      this.cachedUsers = users;
    });
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

    // Add filters based on report type (what to focus on)
    switch (this.selectedReportType) {
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

      case "overview":
      default:
        // Overview shows all data for the selected date range
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

            // Fetch comparison data if enabled
            if (this.comparisonEnabled) {
              this.fetchComparisonData();
            }
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

    // Subscribe to projects to get category information (take(1) to avoid multiple subscriptions)
    this.availableProjects$
      .pipe(take(1), takeUntil(this.destroy$))
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

    // Clear user/project selections when switching to overview or other types
    if (reportType === "overview") {
      this.selectedUserId = "";
      this.selectedProjectId = "";
    } else if (reportType === "user") {
      // Clear project selection when switching to user focus
      this.selectedProjectId = "";
    } else if (reportType === "project") {
      // Clear user selection when switching to project focus
      this.selectedUserId = "";
    }

    this.triggerFilterChange();
  }

  /**
   * Handle user selection for user reports
   */
  onUserSelectionChange(userId: string) {
    this.selectedUserId = userId;
    this.triggerFilterChange();
  }

  /**
   * Handle project selection for project reports
   */
  onProjectSelectionChange(projectId: string) {
    this.selectedProjectId = projectId;
    this.triggerFilterChange();
  }

  /**
   * Handle category selection for category filtering
   */
  onCategorySelectionChange(categoryId: StandardProjectCategory | "") {
    this.selectedCategoryId = categoryId;
    this.triggerFilterChange();
  }

  /**
   * Apply a date range preset
   */
  applyDatePreset(preset: DateRangePreset) {
    this.selectedDatePreset = preset;

    const dateRange = calculateDateRange(preset);
    if (!dateRange) {
      // For custom date range, just keep current report type
      return;
    }

    this.customStartDate = dateRange.startDate.toISOString();
    this.customEndDate = dateRange.endDate.toISOString();

    this.triggerFilterChange();
  }

  /**
   * Handle date preset change from UI
   */
  onDatePresetChange(preset: DateRangePreset) {
    this.applyDatePreset(preset);
  }

  /**
   * Handle custom date range change
   */
  onCustomDateChange() {
    if (this.customStartDate && this.customEndDate) {
      this.selectedDatePreset = "custom";
      this.triggerFilterChange();
    }
  }

  /**
   * Get formatted date range string for display
   */
  getDateRangeDisplay(): string {
    if (!this.customStartDate || !this.customEndDate) {
      return "Select date range";
    }

    const startDate = new Date(this.customStartDate);
    const endDate = new Date(this.customEndDate);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`;
  }

  /**
   * Get unique users count from analytics
   */
  getUniqueUsersCount(analytics: TimeTrackingAnalytics | null): number {
    if (!analytics || !analytics.entriesByUser) return 0;
    return Object.keys(analytics.entriesByUser).length;
  }

  /**
   * Open user detail modal for drill-down view
   */
  async openUserDetailModal(
    userId: string,
    userName: string,
    userData: {
      name: string;
      entries: number;
      hours: number;
      approvedHours: number;
    },
  ): Promise<void> {
    const modal = await this.modalController.create({
      component: UserDetailModalComponent,
      componentProps: {
        userData: {
          userId,
          userName,
          totalHours: userData.hours,
          approvedHours: userData.approvedHours,
          entryCount: userData.entries,
          entries: [], // Entries list not available in aggregated analytics
        },
        dateRange: {
          start: this.customStartDate,
          end: this.customEndDate,
        },
      },
      cssClass: "user-detail-modal",
    });

    await modal.present();
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
   * Calculate dynamic chart height based on number of items
   * @param itemCount Number of items in the chart
   * @param minHeight Minimum height in pixels (default: 250)
   * @param heightPerItem Additional height per item beyond base (default: 30)
   * @param maxHeight Maximum height cap in pixels (default: 600)
   * @param baseItems Number of items that fit in minimum height (default: 5)
   */
  getChartHeight(
    itemCount: number,
    minHeight: number = 250,
    heightPerItem: number = 30,
    maxHeight: number = 600,
    baseItems: number = 5,
  ): number {
    if (itemCount <= baseItems) {
      return minHeight;
    }

    const extraItems = itemCount - baseItems;
    const calculatedHeight = minHeight + extraItems * heightPerItem;

    return Math.min(calculatedHeight, maxHeight);
  }

  /**
   * Get project chart container height based on number of projects
   */
  getProjectChartHeight(): number {
    const projectCount = this.projectChartData.labels?.length || 0;
    return this.getChartHeight(projectCount, 250, 35, 600, 5);
  }

  /**
   * Get category chart container height based on number of categories
   */
  getCategoryChartHeight(): number {
    const categoryCount = this.categoryChartData.labels?.length || 0;
    return this.getChartHeight(categoryCount, 250, 30, 500, 5);
  }

  /**
   * Check if project chart needs horizontal scrolling (many items)
   */
  projectChartNeedsScroll(): boolean {
    const projectCount = this.projectChartData.labels?.length || 0;
    return projectCount > 8;
  }

  /**
   * Get minimum width for scrollable project chart
   */
  getProjectChartMinWidth(): number {
    const projectCount = this.projectChartData.labels?.length || 0;
    if (projectCount <= 8) return 100; // percentage
    return Math.max(100, projectCount * 80); // 80px per project
  }

  /**
   * Check if status chart has data to display
   */
  hasStatusChartData(): boolean {
    if (!this.statusChartData.datasets?.length) return false;
    const data = this.statusChartData.datasets[0]?.data || [];
    return data.some((value) => (value as number) > 0);
  }

  /**
   * Check if project chart has data to display
   */
  hasProjectChartData(): boolean {
    if (!this.projectChartData.labels?.length) return false;
    if (!this.projectChartData.datasets?.length) return false;
    const data = this.projectChartData.datasets[0]?.data || [];
    return data.some((value) => (value as number) > 0);
  }

  /**
   * Check if trend chart has data to display
   */
  hasTrendChartData(): boolean {
    if (!this.trendChartData.labels?.length) return false;
    if (!this.trendChartData.datasets?.length) return false;
    return this.trendChartData.datasets.some((dataset) =>
      dataset.data?.some((value) => (value as number) > 0),
    );
  }

  /**
   * Check if category chart has data to display
   */
  hasCategoryChartData(): boolean {
    if (!this.categoryChartData.labels?.length) return false;
    if (!this.categoryChartData.datasets?.length) return false;
    const data = this.categoryChartData.datasets[0]?.data || [];
    return data.some((value) => (value as number) > 0);
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

        // Clean up the object URL after download starts
        setTimeout(() => URL.revokeObjectURL(url), URL_REVOKE_DELAY_MS);

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
      // Use cached users for synchronous access
      const user = this.cachedUsers.find((u) => u.id === filters.userId);
      if (user) {
        filterParts.push(`user-${user.name?.replace(/[^a-zA-Z0-9]/g, "")}`);
      }
    }

    if (filters.projectId && this.selectedReportType !== "project") {
      // Use cached projects for synchronous access
      const project = this.cachedProjects.find(
        (p) => p.id === filters.projectId,
      );
      if (project) {
        filterParts.push(
          `project-${project.name?.replace(/[^a-zA-Z0-9]/g, "")}`,
        );
      }
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
   * Export current report as PDF with charts
   */
  async exportToPDF() {
    if (!this.currentAnalytics) {
      this.error = "No report data available. Please generate a report first.";
      return;
    }

    this.isExportingPDF = true;
    this.pdfExportProgress = 0;
    this.error = null;

    try {
      // Create new PDF document (A4 size)
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      this.pdfExportProgress = 10;

      // Add organization header/branding
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(59, 89, 152); // ASCENDynamics blue
      pdf.text("ASCENDynamics NFP", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Time Tracking Report", margin, yPosition);
      yPosition += 6;

      // Add generation timestamp
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated: ${timestamp}`, margin, yPosition);
      yPosition += 10;

      // Add report configuration details
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.text("Report Configuration", margin, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(
        `Report Type: ${this.getReportTypeName(this.selectedReportType)}`,
        margin,
        yPosition,
      );
      yPosition += 5;
      pdf.text(`Date Range: ${this.getDateRangeDisplay()}`, margin, yPosition);
      yPosition += 10;

      this.pdfExportProgress = 20;

      // Add summary statistics
      yPosition = this.addSummaryToPDF(pdf, yPosition, margin, pageWidth);
      this.pdfExportProgress = 30;

      // Capture and add charts
      const chartContainers = document.querySelectorAll(".chart-container");
      const chartCards = document.querySelectorAll("ion-card");

      // Find charts section and capture each chart
      let chartIndex = 0;
      for (const card of Array.from(chartCards)) {
        const chartContainer = card.querySelector(".chart-container");
        if (chartContainer && chartContainer instanceof HTMLElement) {
          // Check if we need a new page
          if (yPosition > pageHeight - 100) {
            pdf.addPage();
            yPosition = margin;
          }

          try {
            // Get chart title from card header
            const titleElement = card.querySelector("ion-card-title");
            const chartTitle = titleElement?.textContent?.trim() || "Chart";

            // Add chart title
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text(chartTitle, margin, yPosition);
            yPosition += 6;

            // Capture chart as image
            const canvas = await html2canvas(chartContainer, {
              backgroundColor: "#ffffff",
              scale: 2,
              logging: false,
              useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");
            const imgWidth = pageWidth - margin * 2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add chart image to PDF
            pdf.addImage(
              imgData,
              "PNG",
              margin,
              yPosition,
              imgWidth,
              imgHeight,
            );
            yPosition += imgHeight + 10;

            chartIndex++;
            this.pdfExportProgress =
              30 + Math.min(50, Math.round((chartIndex / 4) * 50));
          } catch (chartError) {
            console.warn(`Failed to capture chart: ${chartError}`);
          }
        }
      }

      this.pdfExportProgress = 85;

      // Add breakdown tables if available
      yPosition = this.addBreakdownsToPDF(pdf, yPosition, margin, pageWidth);
      this.pdfExportProgress = 95;

      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin - 20,
          pageHeight - 10,
        );
        pdf.text(
          "© ASCENDynamics NFP - Time Tracking Report",
          margin,
          pageHeight - 10,
        );
      }

      // Save the PDF
      const filename = this.generatePDFFilename();
      pdf.save(filename);

      this.pdfExportProgress = 100;

      // Reset after short delay
      setTimeout(() => {
        this.isExportingPDF = false;
        this.pdfExportProgress = 0;
      }, 500);
    } catch (error) {
      console.error("PDF export error:", error);
      this.error = "Failed to generate PDF. Please try again.";
      this.isExportingPDF = false;
      this.pdfExportProgress = 0;
    }
  }

  /**
   * Add summary statistics section to PDF
   */
  private addSummaryToPDF(
    pdf: jsPDF,
    yPosition: number,
    margin: number,
    pageWidth: number,
  ): number {
    if (!this.currentAnalytics) return yPosition;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Summary Statistics", margin, yPosition);
    yPosition += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    const stats = [
      {
        label: "Total Entries",
        value: this.currentAnalytics.totalEntries.toString(),
      },
      {
        label: "Total Hours",
        value: this.currentAnalytics.totalHours.toFixed(1) + " hrs",
      },
      {
        label: "Approved Hours",
        value: this.currentAnalytics.totalApprovedHours.toFixed(1) + " hrs",
      },
      {
        label: "Pending Hours",
        value:
          (
            this.currentAnalytics.totalHours -
            this.currentAnalytics.totalApprovedHours
          ).toFixed(1) + " hrs",
      },
      {
        label: "Active Users",
        value: Object.keys(
          this.currentAnalytics.entriesByUser || {},
        ).length.toString(),
      },
      {
        label: "Active Projects",
        value: Object.keys(
          this.currentAnalytics.entriesByProject || {},
        ).length.toString(),
      },
      {
        label: "Avg Hours/Entry",
        value:
          this.currentAnalytics.averageHoursPerEntry?.toFixed(1) + " hrs" ||
          "N/A",
      },
    ];

    // Draw summary in a grid format
    const colWidth = (pageWidth - margin * 2) / 3;
    let col = 0;
    let rowY = yPosition;

    for (const stat of stats) {
      const xPos = margin + col * colWidth;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(stat.label, xPos, rowY);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(stat.value, xPos, rowY + 5);

      col++;
      if (col >= 3) {
        col = 0;
        rowY += 15;
      }
    }

    return rowY + 15;
  }

  /**
   * Add breakdown sections to PDF
   */
  private addBreakdownsToPDF(
    pdf: jsPDF,
    yPosition: number,
    margin: number,
    pageWidth: number,
  ): number {
    if (!this.currentAnalytics) return yPosition;

    const pageHeight = pdf.internal.pageSize.getHeight();

    // Project breakdown using mostActiveProjects
    if (this.currentAnalytics.mostActiveProjects?.length > 0) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Project Breakdown", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");

      // Table header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition - 4, pageWidth - margin * 2, 7, "F");
      pdf.setFont("helvetica", "bold");
      pdf.text("Project", margin + 2, yPosition);
      pdf.text("Hours", margin + 80, yPosition);
      pdf.text("Entries", margin + 110, yPosition);
      pdf.text("% of Total", margin + 140, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      const projects = this.currentAnalytics.mostActiveProjects.slice(0, 10);
      for (const project of projects) {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
        }

        const projectName =
          project.projectName.length > 30
            ? project.projectName.substring(0, 30) + "..."
            : project.projectName;
        const percentage =
          this.currentAnalytics.totalHours > 0
            ? (
                (project.totalHours / this.currentAnalytics.totalHours) *
                100
              ).toFixed(1)
            : "0.0";

        pdf.text(projectName, margin + 2, yPosition);
        pdf.text(project.totalHours.toFixed(1), margin + 80, yPosition);
        pdf.text(project.entriesCount.toString(), margin + 110, yPosition);
        pdf.text(percentage + "%", margin + 140, yPosition);
        yPosition += 5;
      }

      yPosition += 10;
    }

    // User breakdown using mostActiveUsers
    if (this.currentAnalytics.mostActiveUsers?.length > 0) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("User Breakdown", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");

      // Table header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition - 4, pageWidth - margin * 2, 7, "F");
      pdf.setFont("helvetica", "bold");
      pdf.text("User", margin + 2, yPosition);
      pdf.text("Hours", margin + 80, yPosition);
      pdf.text("Approved", margin + 110, yPosition);
      pdf.text("% of Total", margin + 145, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      const users = this.currentAnalytics.mostActiveUsers.slice(0, 10);
      for (const user of users) {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
        }

        const userName =
          user.userName.length > 30
            ? user.userName.substring(0, 30) + "..."
            : user.userName;
        const percentage =
          this.currentAnalytics.totalHours > 0
            ? (
                (user.totalHours / this.currentAnalytics.totalHours) *
                100
              ).toFixed(1)
            : "0.0";

        pdf.text(userName, margin + 2, yPosition);
        pdf.text(user.totalHours.toFixed(1), margin + 80, yPosition);
        pdf.text(user.approvedHours.toFixed(1), margin + 110, yPosition);
        pdf.text(percentage + "%", margin + 145, yPosition);
        yPosition += 5;
      }

      yPosition += 10;
    }

    return yPosition;
  }

  /**
   * Generate filename for PDF export
   */
  private generatePDFFilename(): string {
    const datePart = new Date().toISOString().split("T")[0];
    const reportType = this.selectedReportType || "overview";
    return `time-tracking-report-${reportType}-${datePart}.pdf`;
  }

  /**
   * Get human-readable report type name
   */
  private getReportTypeName(type: string): string {
    const names: Record<string, string> = {
      overview: "Overview",
      user: "By User",
      project: "By Project",
      category: "By Category",
    };
    return names[type] || type;
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
