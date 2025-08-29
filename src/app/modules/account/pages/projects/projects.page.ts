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

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private metaService: MetaService,
    private successHandler: SuccessHandlerService,
    private errorHandler: ErrorHandlerService,
    private alertController: AlertController,
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
        p.name.trim().toLowerCase(),
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
        if (this.selectedCategoryFilter === "all") {
          return projects;
        }
        return projects.filter(
          (project) => project.standardCategory === this.selectedCategoryFilter,
        );
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
}
