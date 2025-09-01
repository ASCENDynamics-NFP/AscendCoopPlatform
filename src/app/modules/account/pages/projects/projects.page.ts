import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable, combineLatest} from "rxjs";
import {map, first, filter, take} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AlertController} from "@ionic/angular";
import {Project} from "@shared/models/project.model";
import {Account} from "@shared/models/account.model";
import {
  StandardProjectCategory,
  STANDARD_PROJECT_TEMPLATES,
  STANDARD_PROJECT_CATEGORIES_INFO,
  StandardProjectTemplate,
} from "@shared/models/standard-project-template.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectRelatedAccountsByAccountId,
  selectAccountById,
  selectAreRelatedAccountsFresh,
} from "../../../../state/selectors/account.selectors";
import * as ProjectsActions from "../../../../state/actions/projects.actions";
import {
  selectProjectsByAccount,
  selectActiveProjectsByAccount,
  selectProjectsLoading,
  selectProjectsError,
} from "../../../../state/selectors/projects.selectors";
import {MetaService} from "../../../../core/services/meta.service";
import {TimeEntry} from "@shared/models/time-entry.model";
import {selectAllEntriesForAccount} from "../../../../state/selectors/time-tracking.selectors";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {SuccessHandlerService} from "../../../../core/services/success-handler.service";
import {ErrorHandlerService} from "../../../../core/services/error-handler.service";
import {CategorySuggestionService} from "../../../../core/services/category-suggestion.service";
import {
  ProjectFilter,
  DEFAULT_PROJECT_FILTER,
} from "./interfaces/project-filter.interface";
import {CategorySuggestion} from "../../../../core/constants/category-keywords.constant";
import {BulkActionEvent} from "./interfaces/bulk-actions.interface";
import {BulkActionsService} from "./services/bulk-actions.service";
import {
  ProjectCreationEvent,
  ProjectCreationState,
  DEFAULT_PROJECT_CREATION_STATE,
} from "./interfaces/project-creation.interface";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.page.html",
  styleUrls: ["./projects.page.scss"],
})
export class ProjectsPage implements OnInit {
  accountId = "";
  projects$!: Observable<Project[]>;
  activeProjects$!: Observable<Project[]>;
  archivedProjects$!: Observable<Project[]>;
  // Time entries for this account (all users)
  timeEntries$!: Observable<TimeEntry[]>;
  // Map of projectId -> entry count for delete gating
  entriesByProjectCount$!: Observable<{[projectId: string]: number}>;
  // Access flags
  entriesAccessAllowed = false;
  projectsAccessAllowed = false;
  account$!: Observable<Account | undefined>;
  loading$!: Observable<boolean>;
  error$!: Observable<any>;
  isGroupAdmin$!: Observable<boolean>;
  /** Lower-cased names of active projects for quick duplicate checks */
  private activeProjectNames: string[] = [];

  // Category-based project creation handled by child component state
  projectCategories = STANDARD_PROJECT_CATEGORIES_INFO;

  // Category filtering and grouping
  selectedCategoryFilter: StandardProjectCategory | "all" = "all";
  groupByCategory = false;
  filteredProjects$!: Observable<Project[]>;
  groupedProjects$!: Observable<{[key: string]: Project[]}>;
  allProjects$!: Observable<Project[]>;

  // Search functionality
  searchTerm = "";

  // Sorting options
  selectedSortBy: "name" | "category" | "created" = "name";
  selectedSortDirection: "asc" | "desc" = "asc";

  // Category overview/analytics
  categoryOverview$!: Observable<{
    [key: string]: {count: number; hours?: number};
  }>;
  showCategoryOverview = false;
  includeArchivedInAnalytics = false;

  // Advanced project management
  selectedProjects: Set<string> = new Set();
  showBulkActions = false;
  isSelectMode = false;
  templateCategories = Object.keys(
    STANDARD_PROJECT_CATEGORIES_INFO,
  ) as StandardProjectCategory[];

  // New filter system integration
  currentProjectFilter: ProjectFilter = DEFAULT_PROJECT_FILTER;

  // Smart category suggestions (component-driven)
  suggestedCategories: CategorySuggestion[] = [];
  showCategorySuggestions = false;

  // Project Creation Component State
  projectCreationState: ProjectCreationState = DEFAULT_PROJECT_CREATION_STATE;

  // Project Creation Toggle
  showProjectCreation = false;

  // Filters Toggle
  showFilters = true; // Default to showing filters

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private metaService: MetaService,
    private successHandler: SuccessHandlerService,
    private errorHandler: ErrorHandlerService,
    private alertController: AlertController,
    private categorySuggestionService: CategorySuggestionService,
    private bulkActionsService: BulkActionsService,
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get("accountId") || "";
    // Set account$ before using in combineLatest
    this.account$ = this.store.select(selectAccountById(this.accountId));
    // Ensure account and relatedAccounts are fetched
    this.store.dispatch(
      AccountActions.loadAccount({accountId: this.accountId}),
    );
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.accountId}),
    );
    // Always try to load projects early; effect handles permission-denied gracefully
    this.store.dispatch(
      ProjectsActions.loadProjects({accountId: this.accountId}),
    );

    // Load time entries only for group accounts where user is owner or member
    const currentUser$ = this.store.select(selectAuthUser);
    const relatedAccounts$ = this.store.select(
      selectRelatedAccountsByAccountId(this.accountId),
    );
    const relFresh$ = this.store.select(
      selectAreRelatedAccountsFresh(this.accountId),
    );
    combineLatest([this.account$, currentUser$, relatedAccounts$, relFresh$])
      .pipe(
        // wait until related accounts freshness computed true (loaded) and we have account+user
        filter(
          ([account, user, _rel, fresh]) => !!account && !!user && !!fresh,
        ),
        take(1),
      )
      .subscribe(([account, user, related]) => {
        const isOwnerId = !!(
          account &&
          user &&
          account.id === (user as any).uid
        );
        const isMemberRel = !!related?.some(
          (ra) =>
            user && ra.id === (user as any).uid && ra.status === "accepted",
        );
        this.projectsAccessAllowed = isOwnerId || isMemberRel;

        // Time entries only for group accounts and allowed members/owners
        this.entriesAccessAllowed =
          account?.type === "group" && this.projectsAccessAllowed;
        if (this.entriesAccessAllowed) {
          this.store.dispatch(
            TimeTrackingActions.loadAllTimeEntriesForAccount({
              accountId: this.accountId,
            }),
          );
        }
      });

    // Now compute admin status and load the rest
    this.loadProjects();
    this.isGroupAdmin$ = combineLatest([
      currentUser$,
      relatedAccounts$,
      this.account$,
    ]).pipe(
      map(([currentUser, relatedAccounts, account]) => {
        if (!currentUser) return false;
        const rel = relatedAccounts.find((ra) => ra.id === currentUser.uid);
        const isAdmin =
          rel?.status === "accepted" &&
          (rel.access === "admin" || rel.access === "moderator");
        const isOwner =
          account?.type === "group" && account.createdBy === currentUser.uid;
        return isAdmin || isOwner;
      }),
    );

    this.metaService.updateMetaTags(
      "Projects | ASCENDynamics NFP",
      "Manage projects for your account on ASCENDynamics NFP.",
      "projects, time tracking",
      {
        title: "Projects | ASCENDynamics NFP",
        description: "Manage projects for your account on ASCENDynamics NFP.",
        url: `https://app.ASCENDynamics.org/account/${this.accountId}/projects`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "Projects | ASCENDynamics NFP",
        description: "Manage projects for your account on ASCENDynamics NFP.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
  }

  private loadProjects() {
    this.projects$ = this.store.select(selectProjectsByAccount(this.accountId));
    this.activeProjects$ = this.store.select(
      selectActiveProjectsByAccount(this.accountId),
    );
    this.activeProjects$.subscribe((projects) => {
      this.activeProjectNames = projects.map((p) =>
        (p.name || "").trim().toLowerCase(),
      );
    });
    this.archivedProjects$ = this.projects$.pipe(
      map((projects) => projects.filter((p) => p.archived)),
    );
    this.loading$ = this.store.select(selectProjectsLoading);
    this.error$ = this.store.select(selectProjectsError);
    // Select all time entries for this account (across users)
    this.timeEntries$ = this.store.select(
      selectAllEntriesForAccount(this.accountId),
    );
    this.entriesByProjectCount$ = this.timeEntries$.pipe(
      map((entries) => {
        const counts: {[projectId: string]: number} = {};
        entries.forEach((e) => {
          counts[e.projectId] = (counts[e.projectId] || 0) + 1;
        });
        return counts;
      }),
    );

    // Set up filtered and grouped projects
    this.setupFilteredProjects();
    // Prepare allProjects stream and category overview
    this.allProjects$ = this.store.select(
      selectProjectsByAccount(this.accountId),
    );
    this.setupCategoryOverview();

    // Dispatching moved to permission gate above
  }

  private setupFilteredProjects() {
    this.filteredProjects$ = this.activeProjects$.pipe(
      map((projects) => {
        let filtered = projects;

        // Apply category filter
        if (this.selectedCategoryFilter !== "all") {
          filtered = filtered.filter(
            (project) =>
              project.standardCategory === this.selectedCategoryFilter,
          );
        }

        // Apply search filter
        if (this.searchTerm.trim()) {
          const searchLower = this.searchTerm.toLowerCase().trim();
          filtered = filtered.filter(
            (project) =>
              (project.name || "").toLowerCase().includes(searchLower) ||
              (project.description || "").toLowerCase().includes(searchLower) ||
              (project.standardCategory || "general")
                .toLowerCase()
                .includes(searchLower),
          );
        }

        // Apply sorting
        filtered = this.sortProjects(filtered);

        return filtered;
      }),
    );

    this.groupedProjects$ = this.filteredProjects$.pipe(
      map((projects) => {
        const grouped: {[key: string]: Project[]} = {};

        projects.forEach((project) => {
          const category = project.standardCategory || "general";
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(project);
        });

        return grouped;
      }),
    );

    // Category overview stream uses toggle; recomputed in setupCategoryOverview
  }

  // Legacy project creation helper removed (handled by component)

  // Legacy category/template selection and suggestion methods removed

  // ====================================
  // PROJECT CREATION TOGGLE METHODS
  // ====================================

  /**
   * Toggle project creation form display
   * When activated, hides filters and analytics
   */
  toggleProjectCreation(): void {
    this.showProjectCreation = !this.showProjectCreation;

    if (this.showProjectCreation) {
      // Hide other sections
      this.showFilters = false;
      this.showCategoryOverview = false;

      // Reset the project creation state for single project mode only
      this.projectCreationState = {
        ...DEFAULT_PROJECT_CREATION_STATE,
      };
    }
  }

  /**
   * Close project creation form
   */
  closeProjectCreation(): void {
    this.showProjectCreation = false;
    this.resetProjectCreationState();
  }

  /**
   * Toggle filters display
   * When activated, hides project creation and analytics
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;

    if (this.showFilters) {
      // Hide other sections
      this.showProjectCreation = false;
      this.showCategoryOverview = false;
    }
  }

  // ====================================
  // NEW PROJECT CREATION COMPONENT INTEGRATION
  // ====================================

  /**
   * Handle project creation events from the new component
   */
  onProjectCreate(event: ProjectCreationEvent): void {
    // Only handle single project creation
    if (event.type === "single") {
      this.createSingleProjectFromComponent(event);
    }
  }

  private createSingleProjectFromComponent(event: ProjectCreationEvent): void {
    if (!event.projectName || !event.category) return;

    const project = {
      name: event.projectName,
      standardCategory: event.category,
      accountId: this.accountId,
    } as Partial<Project>;

    // Add template data if selected
    if (event.template) {
      project.description = event.template.description;
      project.tags = event.template.defaultTasks || [];
      project.standardProjectTemplateId = event.template.id;
      project.complexity = event.template.complexity;
      project.timeframe = event.template.estimatedTimeframe;
      project.requiredRoles = event.template.requiredRoles;
      project.icon = event.template.icon;
      project.color = event.template.color;
    }

    this.store.dispatch(
      ProjectsActions.createProject({
        accountId: this.accountId,
        project: project as Project,
      }),
    );
    this.successHandler.handleSuccess("Project created successfully!");
    this.closeProjectCreation();
  }

  /**
   * Handle category changes from the component
   */
  onCategorySelectedFromComponent(category: StandardProjectCategory): void {
    this.projectCreationState = {
      ...this.projectCreationState,
      selectedCategory: category,
      selectedTemplate: undefined,
    };
    this.updateAvailableTemplates();
  }

  /**
   * Handle project name changes from the component
   */
  onProjectNameChangeFromComponent(name: string): void {
    this.projectCreationState = {
      ...this.projectCreationState,
      newProjectName: name,
    };

    // Generate category suggestions for names > 2 characters
    if (name.trim().length > 2) {
      this.generateCategorySuggestionsForComponent(name);
    } else {
      this.projectCreationState = {
        ...this.projectCreationState,
        suggestedCategories: [],
        showCategorySuggestions: false,
      };
    }
  }

  /**
   * Handle template selection from the component
   */
  onTemplateSelectedFromComponent(
    template: StandardProjectTemplate | undefined,
  ): void {
    this.projectCreationState = {
      ...this.projectCreationState,
      selectedTemplate: template,
    };
  }

  /**
   * Handle state changes from the component
   */
  onProjectCreationStateChange(state: ProjectCreationState): void {
    this.projectCreationState = state;
  }

  private generateCategorySuggestionsForComponent(projectName: string): void {
    const suggestions =
      this.categorySuggestionService.generateSuggestions(projectName);
    this.projectCreationState = {
      ...this.projectCreationState,
      suggestedCategories: suggestions,
      showCategorySuggestions: suggestions.length > 0,
    };
  }

  private updateAvailableTemplates(): void {
    if (this.projectCreationState.selectedCategory) {
      const templates = STANDARD_PROJECT_TEMPLATES.filter(
        (template) =>
          template.category === this.projectCreationState.selectedCategory,
      );
      this.projectCreationState = {
        ...this.projectCreationState,
        availableTemplates: templates,
      };
    } else {
      this.projectCreationState = {
        ...this.projectCreationState,
        availableTemplates: [],
      };
    }
  }

  private resetProjectCreationState(): void {
    this.projectCreationState = {
      ...DEFAULT_PROJECT_CREATION_STATE,
    };
  }

  // ====================================
  // END PROJECT CREATION COMPONENT INTEGRATION
  // ====================================

  updateProject(project: Project, name: string | null | undefined) {
    if (!project.id || !name) return;
    const trimmed = name.trim();
    const lower = trimmed.toLowerCase();
    const current = project.name.trim().toLowerCase();
    if (lower !== current && this.activeProjectNames.includes(lower)) {
      this.errorHandler.handleFirebaseAuthError({
        code: "duplicate-project-name",
        message: "A project with that name already exists.",
      });
      return;
    }
    this.store.dispatch(
      ProjectsActions.updateProject({
        accountId: this.accountId,
        projectId: project.id,
        changes: {name: trimmed},
      }),
    );
    this.successHandler.handleSuccess("Project updated!");
  }

  async toggleArchive(project: Project, archived: boolean) {
    if (!project.id) return;

    if (archived) {
      const alert = await this.alertController.create({
        header: "Archive Project?",
        message: "Are you sure you want to archive this project?",
        buttons: [
          {text: "Cancel", role: "cancel"},
          {text: "Archive", role: "confirm"},
        ],
      });
      await alert.present();
      const result = await alert.onDidDismiss();
      if (result.role !== "confirm") return;
    }

    this.store.dispatch(
      ProjectsActions.updateProject({
        accountId: this.accountId,
        projectId: project.id,
        changes: {archived},
      }),
    );
    this.successHandler.handleSuccess(
      archived ? "Project archived" : "Project restored",
    );
  }

  async deleteProject(project: Project) {
    if (!project.id) return;
    // Defensive: prevent deletion if project has any time entries
    try {
      const counts = await this.entriesByProjectCount$
        .pipe(take(1))
        .toPromise();
      const hasEntries = !!counts && counts[project.id] > 0;
      if (hasEntries || !this.entriesAccessAllowed) {
        this.errorHandler.handleFirebaseAuthError({
          code: "project-has-entries",
          message:
            "This project has time entries associated with it and cannot be deleted.",
        });
        return;
      }
    } catch (_) {
      // If we cannot determine counts, fail safe and block deletion
      this.errorHandler.handleFirebaseAuthError({
        code: "project-delete-unknown",
        message:
          "Unable to verify time entries for this project. Please try again.",
      });
      return;
    }
    // Confirm deletion
    const alert = await this.alertController.create({
      header: "Delete Project?",
      message:
        "This will permanently delete the project. This action cannot be undone.",
      buttons: [
        {text: "Cancel", role: "cancel"},
        {text: "Delete", role: "destructive"},
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result.role !== "destructive") return;

    this.store.dispatch(
      ProjectsActions.deleteProject({
        accountId: this.accountId,
        projectId: project.id,
      }),
    );
    // Success and failure notifications are handled in ProjectsEffects
  }

  trackById(_: number, proj: Project) {
    return proj.id;
  }

  // Category filtering methods
  onCategoryFilterChange() {
    this.setupFilteredProjects();
  }

  selectCategoryFilter(categoryKey: string) {
    this.selectedCategoryFilter = categoryKey as
      | StandardProjectCategory
      | "all";
    this.onCategoryFilterChange();
  }

  onSearchChange() {
    this.setupFilteredProjects();
  }

  onSortChange() {
    this.setupFilteredProjects();
  }

  // New filter system handler
  onProjectFilterChange(filter: ProjectFilter) {
    this.currentProjectFilter = filter;
    // Update legacy properties for backward compatibility
    this.selectedCategoryFilter = filter.selectedCategory;
    this.groupByCategory = filter.showGrouped;
    this.searchTerm = filter.searchTerm;
    this.selectedSortBy = filter.sortBy;
    this.selectedSortDirection = filter.sortDirection;
    this.includeArchivedInAnalytics = !!filter.includeArchivedInAnalytics;
    // Trigger the existing filter update
    this.setupFilteredProjects();
    this.setupCategoryOverview();
  }

  // New bulk actions handler
  async onBulkAction(event: BulkActionEvent) {
    await this.bulkActionsService.handleBulkAction(event, this.accountId, {
      onClearSelection: () => this.clearAllSelections(),
      onSelectAll: () => this.selectAllProjects(),
      onToggleSelectMode: () => this.toggleSelectMode(),
    });
  }

  private sortProjects(projects: Project[]): Project[] {
    return projects.sort((a, b) => {
      let comparison = 0;

      switch (this.selectedSortBy) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "");
          break;
        case "category":
          const aCat = a.standardCategory || "general";
          const bCat = b.standardCategory || "general";
          comparison = aCat.localeCompare(bCat);
          break;
        case "created":
          // Safe date comparison handling both Date objects and Firestore Timestamps
          const aDate = this.getDateValue(a.createdAt);
          const bDate = this.getDateValue(b.createdAt);
          comparison = aDate - bDate;
          break;
        default:
          comparison = (a.name || "").localeCompare(b.name || "");
      }

      return this.selectedSortDirection === "desc" ? -comparison : comparison;
    });
  }

  private setupCategoryOverview() {
    const projectsSource$ = this.includeArchivedInAnalytics
      ? this.allProjects$
      : this.activeProjects$;

    this.categoryOverview$ = combineLatest([
      projectsSource$,
      this.timeEntries$,
    ]).pipe(
      map(([projects, entries]) => {
        const overview: {[key: string]: {count: number; hours: number}} = {};

        // Initialize with all available categories
        Object.keys(this.projectCategories).forEach((category) => {
          overview[category] = {count: 0, hours: 0};
        });
        overview["general"] = {count: 0, hours: 0};

        // Map projectId -> category for chosen project set
        const projectCategoryMap = new Map<string, string>();
        projects.forEach((project) => {
          const category = project.standardCategory || "general";
          if (project.id) projectCategoryMap.set(project.id, category);
          if (!overview[category]) overview[category] = {count: 0, hours: 0};
          overview[category].count++;
        });

        // Sum hours by category using all entries for included projects
        entries.forEach((entry) => {
          const category = projectCategoryMap.get(entry.projectId);
          if (!category) return;
          overview[category].hours += entry.hours || 0;
        });

        return overview;
      }),
    );
  }

  toggleIncludeArchivedInAnalytics(checked: boolean) {
    this.includeArchivedInAnalytics = checked;
    // Keep current filter state in sync
    this.currentProjectFilter = {
      ...this.currentProjectFilter,
      includeArchivedInAnalytics: checked,
    };
    this.setupCategoryOverview();
  }

  private getDateValue(dateField: any): number {
    if (!dateField) return 0;

    // Handle Firestore Timestamp
    if (dateField.toDate && typeof dateField.toDate === "function") {
      return dateField.toDate().getTime();
    }

    // Handle regular Date object
    if (dateField instanceof Date) {
      return dateField.getTime();
    }

    // Handle date string
    if (typeof dateField === "string") {
      return new Date(dateField).getTime();
    }

    return 0;
  }

  // Advanced Project Management Methods

  toggleSelectMode() {
    this.isSelectMode = !this.isSelectMode;
    if (!this.isSelectMode) {
      this.selectedProjects.clear();
    }
    this.updateBulkActionsVisibility();
  }

  toggleProjectSelection(projectId: string) {
    if (this.selectedProjects.has(projectId)) {
      this.selectedProjects.delete(projectId);
    } else {
      this.selectedProjects.add(projectId);
    }
    this.updateBulkActionsVisibility();
  }

  selectAllProjects() {
    this.filteredProjects$.pipe(first()).subscribe((projects) => {
      projects.forEach((project) => {
        if (project.id) {
          this.selectedProjects.add(project.id);
        }
      });
      this.updateBulkActionsVisibility();
    });
  }

  clearAllSelections() {
    this.selectedProjects.clear();
    this.updateBulkActionsVisibility();
  }

  private updateBulkActionsVisibility() {
    this.showBulkActions = this.selectedProjects.size > 0;
  }

  // Template-based project creation (legacy) removed

  /**
   * Toggle category overview (analytics) display
   * When activated, hides project creation and filters
   */
  toggleCategoryOverview() {
    this.showCategoryOverview = !this.showCategoryOverview;

    if (this.showCategoryOverview) {
      // Hide other sections
      this.showProjectCreation = false;
      this.showFilters = false;
    }
  }

  // Group by toggle handled via filters component

  // Analytics helper methods
  getTotalProjects(overview: {
    [key: string]: {count: number; hours?: number};
  }): number {
    return Object.values(overview).reduce(
      (total, category) => total + category.count,
      0,
    );
  }

  getActiveCategories(overview: {
    [key: string]: {count: number; hours?: number};
  }): number {
    return Object.values(overview).filter((category) => category.count > 0)
      .length;
  }

  getTopCategories(overview: {
    [key: string]: {count: number; hours?: number};
  }): string[] {
    return Object.entries(overview)
      .filter(([_, data]) => data.count > 0)
      .sort(([_, a], [__, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([key, _]) => key);
  }

  getProjectPercentage(
    overview: {[key: string]: {count: number; hours?: number}},
    categoryKey: string,
  ): number {
    const total = this.getTotalProjects(overview);
    const categoryCount = overview[categoryKey]?.count || 0;
    return total > 0 ? Math.round((categoryCount / total) * 100) : 0;
  }

  // Legacy helpers removed: openProjectCreation, exportAnalytics

  getCategoryInfo(category: string) {
    const categoryInfo =
      this.projectCategories[category as StandardProjectCategory];
    if (categoryInfo) {
      return {
        name: category,
        description: categoryInfo.description,
        icon: categoryInfo.icon,
        color: categoryInfo.color,
      };
    }
    return {
      name: "General",
      description: "General projects",
      icon: "folder",
      color: "#666666",
    };
  }

  getCategoryKeys(groupedProjects: {[key: string]: Project[]}): string[] {
    return Object.keys(groupedProjects).sort();
  }

  getAvailableCategoryKeys(): string[] {
    return Object.keys(this.projectCategories);
  }

  // Legacy template modal helpers removed
}
