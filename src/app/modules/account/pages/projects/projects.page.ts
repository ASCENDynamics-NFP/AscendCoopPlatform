import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable, combineLatest} from "rxjs";
import {map, first} from "rxjs/operators";
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
import {
  selectRelatedAccountsByAccountId,
  selectAccountById,
} from "../../../../state/selectors/account.selectors";
import * as ProjectsActions from "../../../../state/actions/projects.actions";
import {
  selectProjectsByAccount,
  selectActiveProjectsByAccount,
  selectProjectsLoading,
  selectProjectsError,
} from "../../../../state/selectors/projects.selectors";
import {MetaService} from "../../../../core/services/meta.service";
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
  account$!: Observable<Account | undefined>;
  loading$!: Observable<boolean>;
  error$!: Observable<any>;
  isGroupAdmin$!: Observable<boolean>;
  newProjectName = "";
  /** Lower-cased names of active projects for quick duplicate checks */
  private activeProjectNames: string[] = [];

  // Category-based project creation (always visible)
  selectedCategory?: StandardProjectCategory;
  availableTemplates: StandardProjectTemplate[] = [];
  selectedTemplate?: StandardProjectTemplate;
  projectCategories = STANDARD_PROJECT_CATEGORIES_INFO;

  // Category filtering and grouping
  selectedCategoryFilter: StandardProjectCategory | "all" = "all";
  groupByCategory = false;
  filteredProjects$!: Observable<Project[]>;
  groupedProjects$!: Observable<{[key: string]: Project[]}>;

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

  // Advanced project management
  selectedProjects: Set<string> = new Set();
  showBulkActions = false;
  isSelectMode = false;
  showTemplateModal = false;
  templateCategories = Object.keys(
    STANDARD_PROJECT_CATEGORIES_INFO,
  ) as StandardProjectCategory[];
  templatesForSelectedCategory: StandardProjectTemplate[] = [];

  // New filter system integration
  currentProjectFilter: ProjectFilter = DEFAULT_PROJECT_FILTER;

  // Project creation modes
  createFromTemplate = false;

  // Smart category suggestions
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
    this.loadProjects();

    const currentUser$ = this.store.select(selectAuthUser);
    const relatedAccounts$ = this.store.select(
      selectRelatedAccountsByAccountId(this.accountId),
    );
    this.account$ = this.store.select(selectAccountById(this.accountId));
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

    // Set up filtered and grouped projects
    this.setupFilteredProjects();

    this.store.dispatch(
      ProjectsActions.loadProjects({accountId: this.accountId}),
    );
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

    // Set up category overview analytics
    this.categoryOverview$ = this.activeProjects$.pipe(
      map((projects) => {
        const overview: {[key: string]: {count: number; hours?: number}} = {};

        // Initialize with all available categories
        Object.keys(this.projectCategories).forEach((category) => {
          overview[category] = {count: 0, hours: 0};
        });
        overview["general"] = {count: 0, hours: 0};

        // Count projects by category
        projects.forEach((project) => {
          const category = project.standardCategory || "general";
          if (!overview[category]) {
            overview[category] = {count: 0, hours: 0};
          }
          overview[category].count++;
          // TODO: Add hours calculation when time tracking data is available
        });

        // Return overview with all categories (including 0 counts for better UX)
        return overview;
      }),
    );
  }

  addProject() {
    // Ensure category is selected before creating project
    if (!this.selectedCategory) {
      this.errorHandler.handleFirebaseAuthError({
        code: "category-required",
        message:
          "Please select a project category before creating the project.",
      });
      return;
    }

    const name = this.newProjectName.trim();
    if (!name) return;
    const lower = name.toLowerCase();
    if (this.activeProjectNames.includes(lower)) {
      this.errorHandler.handleFirebaseAuthError({
        code: "duplicate-project-name",
        message: "A project with that name already exists.",
      });
      return;
    }

    // Get current user to set createdBy and lastModifiedBy
    this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user: any) => {
        if (!user) {
          this.errorHandler.handleFirebaseAuthError({
            code: "auth-required",
            message: "Authentication required to create projects.",
          });
          return;
        }

        const project: Project = {
          name,
          accountId: this.accountId,
          createdBy: user.uid,
          lastModifiedBy: user.uid,
          standardCategory: this.selectedCategory,
          description: this.selectedTemplate?.description || "",
          icon: this.selectedTemplate?.icon || "folder",
          color: this.selectedTemplate?.color || "#666666",
          complexity: this.selectedTemplate?.complexity || "Simple",
          timeframe: this.selectedTemplate?.estimatedTimeframe || "Short-term",
          goals: this.selectedTemplate?.defaultTasks || [],
          requiredRoles: this.selectedTemplate?.requiredRoles || [],
        } as Project;

        // Only add standardProjectTemplateId if template is selected
        if (this.selectedTemplate?.id) {
          (project as any).standardProjectTemplateId = this.selectedTemplate.id;
        }

        this.store.dispatch(
          ProjectsActions.createProject({accountId: this.accountId, project}),
        );
        this.resetProjectCreation();
        this.successHandler.handleSuccess("Project created!");
      });
  }

  onCategorySelected(category: StandardProjectCategory | string) {
    if (!category) {
      this.selectedCategory = undefined;
      this.availableTemplates = [];
      return;
    }

    this.selectedCategory = category as StandardProjectCategory;
    this.availableTemplates = STANDARD_PROJECT_TEMPLATES.filter(
      (template) => template.category === this.selectedCategory,
    );

    // If there's only one template, auto-select it
    if (this.availableTemplates.length === 1) {
      this.selectedTemplate = this.availableTemplates[0];
      this.newProjectName = this.selectedTemplate.name;
    }
  }

  onTemplateSelected(template: StandardProjectTemplate) {
    this.selectedTemplate = template;
    this.newProjectName = template.name;
  }

  resetProjectCreation() {
    this.newProjectName = "";
    this.selectedCategory = undefined;
    this.selectedTemplate = undefined;
    this.availableTemplates = [];
    this.suggestedCategories = [];
    this.showCategorySuggestions = false;
  }

  // Smart Category Suggestion Methods
  onProjectNameChange(projectName: string | null | undefined) {
    const name = projectName || "";
    this.newProjectName = name;
    if (name.trim().length > 2) {
      this.generateCategorySuggestions(name);
    } else {
      this.suggestedCategories = [];
      this.showCategorySuggestions = false;
    }
  }

  generateCategorySuggestions(projectName: string) {
    this.suggestedCategories =
      this.categorySuggestionService.generateSuggestions(projectName);
    this.showCategorySuggestions = this.suggestedCategories.length > 0;
  }

  applySuggestedCategory(category: StandardProjectCategory) {
    this.onCategorySelected(category);
    this.dismissCategorySuggestions();
  }

  dismissCategorySuggestions() {
    this.showCategorySuggestions = false;
    this.suggestedCategories = [];
  }

  cancelCategorySelection() {
    this.resetProjectCreation();
  }

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

      if (this.activeProjectNames.length <= 1) {
        this.errorHandler.handleFirebaseAuthError({
          code: "last-active-project",
          message: "You must have at least one active project.",
        });
        return;
      }
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
    // Trigger the existing filter update
    this.setupFilteredProjects();
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

  // Template-based project creation
  openTemplateModal() {
    this.showTemplateModal = true;
    this.resetTemplateSelection();
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
    this.resetTemplateSelection();
  }

  selectTemplateCategory(category: StandardProjectCategory) {
    this.selectedCategory = category;
    this.templatesForSelectedCategory = STANDARD_PROJECT_TEMPLATES.filter(
      (template) => template.category === category,
    );
  }

  createProjectFromTemplate(template: StandardProjectTemplate) {
    this.selectedTemplate = template;
    this.selectedCategory = template.category;

    // Generate a default name or allow customization
    const baseName = template.name;
    let projectName = baseName;
    let counter = 1;

    // Check for existing projects with similar names
    this.activeProjects$.pipe(first()).subscribe((projects) => {
      const existingNames = projects.map((p) => p.name.toLowerCase());

      while (existingNames.includes(projectName.toLowerCase())) {
        counter++;
        projectName = `${baseName} ${counter}`;
      }

      this.newProjectName = projectName;
      this.addProject();
      this.closeTemplateModal();
    });
  }

  private resetTemplateSelection() {
    this.selectedCategory = undefined;
    this.selectedTemplate = undefined;
    this.templatesForSelectedCategory = [];
    this.createFromTemplate = false;
  }

  async createSingleProject() {
    if (!this.selectedCategory) {
      this.errorHandler.handleFirebaseAuthError({
        code: "category-required",
        message: "Please select a category for project creation.",
      });
      return;
    }
  }

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

  toggleGroupByCategory() {
    this.groupByCategory = !this.groupByCategory;
  }

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

  openProjectCreation(): void {
    this.showProjectCreation = true;
  }

  exportAnalytics(): void {
    // TODO: Implement analytics export functionality
    console.log("Export analytics functionality to be implemented");
  }

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

  showTemplateSelectionModal() {
    this.showTemplateModal = true;
  }

  createCustomProject() {
    this.closeTemplateModal();
    // Scroll to the project creation form
    const createCard = document.querySelector(".add-project-card");
    if (createCard) {
      createCard.scrollIntoView({behavior: "smooth"});
    }
  }
}
