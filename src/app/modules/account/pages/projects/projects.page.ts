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
  bulkCreateProjects = false;
  bulkCreateCount = 1;
  bulkCreateNames: string[] = [""];

  // Smart category suggestions
  suggestedCategories: CategorySuggestion[] = [];
  showCategorySuggestions = false;

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

  // Bulk project creation
  toggleBulkCreate() {
    this.bulkCreateProjects = !this.bulkCreateProjects;
    if (this.bulkCreateProjects) {
      this.bulkCreateCount = 3;
      this.bulkCreateNames = ["Project 1", "Project 2", "Project 3"];
    } else {
      this.bulkCreateCount = 1;
      this.bulkCreateNames = [""];
    }
  }

  addBulkCreateProject() {
    this.bulkCreateCount++;
    this.bulkCreateNames.push(`Project ${this.bulkCreateCount}`);
  }

  removeBulkCreateProject(index: number) {
    if (this.bulkCreateNames.length > 1) {
      this.bulkCreateNames.splice(index, 1);
      this.bulkCreateCount--;
    }
  }

  async createBulkProjects() {
    if (!this.selectedCategory) {
      this.errorHandler.handleFirebaseAuthError({
        code: "category-required",
        message: "Please select a category for bulk project creation.",
      });
      return;
    }

    const validNames = this.bulkCreateNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (validNames.length === 0) {
      this.errorHandler.handleFirebaseAuthError({
        code: "names-required",
        message: "Please provide at least one project name.",
      });
      return;
    }

    // Check for duplicates within the bulk list
    const uniqueNames = new Set(validNames.map((name) => name.toLowerCase()));
    if (uniqueNames.size !== validNames.length) {
      this.errorHandler.handleFirebaseAuthError({
        code: "duplicate-names",
        message: "Duplicate project names found in the list.",
      });
      return;
    }

    // Check against existing projects
    this.activeProjects$.pipe(first()).subscribe((existingProjects) => {
      const existingNames = existingProjects.map((p) => p.name.toLowerCase());
      const conflicts = validNames.filter((name) =>
        existingNames.includes(name.toLowerCase()),
      );

      if (conflicts.length > 0) {
        this.errorHandler.handleFirebaseAuthError({
          code: "duplicate-project-names",
          message: `Projects with these names already exist: ${conflicts.join(", ")}`,
        });
        return;
      }

      // Create all projects
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

          const categoryInfo =
            STANDARD_PROJECT_CATEGORIES_INFO[this.selectedCategory!];
          const template = this.selectedTemplate;

          validNames.forEach((name) => {
            const project: Project = {
              name,
              accountId: this.accountId,
              createdBy: user.uid,
              lastModifiedBy: user.uid,
              standardCategory: this.selectedCategory,
              description:
                template?.description || `${this.selectedCategory} project`,
              icon: template?.icon || categoryInfo.icon,
              color: template?.color || categoryInfo.color,
              complexity: template?.complexity || "Simple",
              timeframe: template?.estimatedTimeframe || "Short-term",
              goals: template?.defaultTasks || [],
              requiredRoles: template?.requiredRoles || [],
            } as Project;

            if (template?.id) {
              (project as any).standardProjectTemplateId = template.id;
            }

            this.store.dispatch(
              ProjectsActions.createProject({
                accountId: this.accountId,
                project,
              }),
            );
          });

          this.successHandler.handleSuccess(
            `${validNames.length} projects created successfully!`,
          );
          this.resetProjectCreation();
          this.toggleBulkCreate();
        });
    });
  }

  toggleCategoryOverview() {
    this.showCategoryOverview = !this.showCategoryOverview;
  }

  toggleGroupByCategory() {
    this.groupByCategory = !this.groupByCategory;
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

  // Modal and UI Methods
  showBulkCreationModal() {
    this.bulkCreateProjects = true;
    this.bulkCreateNames = [""];
    this.bulkCreateCount = 1;
  }

  closeBulkCreationModal() {
    this.bulkCreateProjects = false;
    this.bulkCreateNames = [""];
    this.bulkCreateCount = 1;
  }

  updateBulkCreateInputs() {
    const count = this.bulkCreateCount || 1;
    const newNames = Array(count)
      .fill("")
      .map((_, index) => this.bulkCreateNames[index] || "");
    this.bulkCreateNames = newNames;
  }

  async executeBulkCreateProjects() {
    const validNames = this.bulkCreateNames.filter((name) => name.trim());
    if (validNames.length === 0) return;

    if (!this.selectedCategory) {
      // Show error alert
      const alert = await this.alertController.create({
        header: "Error",
        message: "Please select a category first",
        buttons: ["OK"],
      });
      await alert.present();
      return;
    }

    for (const name of validNames) {
      if (name.trim()) {
        const project: Partial<Project> = {
          name: name.trim(),
          description: "",
          accountId: this.accountId,
          standardCategory: this.selectedCategory,
          archived: false,
        };

        if (this.selectedTemplate) {
          project.description = this.selectedTemplate.description;
        }

        this.store.dispatch(
          ProjectsActions.createProject({
            accountId: this.accountId,
            project: project as Project,
          }),
        );
      }
    }

    this.successHandler.handleSuccess(
      `Created ${validNames.length} projects successfully`,
    );
    this.closeBulkCreationModal();
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
