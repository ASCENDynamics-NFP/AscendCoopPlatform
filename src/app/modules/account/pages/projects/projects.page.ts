import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable, combineLatest} from "rxjs";
import {map} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AlertController} from "@ionic/angular";
import {Project} from "@shared/models/project.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectRelatedAccountsByAccountId} from "../../../../state/selectors/account.selectors";
import {ProjectService} from "../../../../core/services/project.service";
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
  isGroupAdmin$!: Observable<boolean>;
  newProjectName = "";
  /** Lower-cased names of active projects for quick duplicate checks */
  private activeProjectNames: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private projectService: ProjectService,
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
    this.isGroupAdmin$ = combineLatest([currentUser$, relatedAccounts$]).pipe(
      map(([currentUser, relatedAccounts]) => {
        if (!currentUser) return false;
        const rel = relatedAccounts.find((ra) => ra.id === currentUser.uid);
        return (
          rel?.status === "accepted" &&
          (rel.access === "admin" || rel.access === "moderator")
        );
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
    this.projects$ = this.projectService.getProjects(this.accountId);
    this.activeProjects$ = this.projects$.pipe(
      map((projects) => projects.filter((p) => !p.archived)),
    );
    this.activeProjects$.subscribe((projects) => {
      this.activeProjectNames = projects.map((p) =>
        p.name.trim().toLowerCase(),
      );
    });
    this.archivedProjects$ = this.projects$.pipe(
      map((projects) => projects.filter((p) => p.archived)),
    );
  }

  addProject() {
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
    const project: Project = {name, accountId: this.accountId} as Project;
    this.projectService
      .createProject(this.accountId, project)
      .then(() => {
        this.newProjectName = "";
        this.successHandler.handleSuccess("Project created!");
      })
      .catch((error) => this.errorHandler.handleFirebaseAuthError(error));
  }

  updateProject(project: Project, name: string) {
    if (!project.id) return;
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
    this.projectService
      .updateProject(this.accountId, project.id, {name: trimmed})
      .then(() => this.successHandler.handleSuccess("Project updated!"))
      .catch((error) => this.errorHandler.handleFirebaseAuthError(error));
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

    this.projectService
      .setArchived(this.accountId, project.id, archived)
      .then(() =>
        this.successHandler.handleSuccess(
          archived ? "Project archived" : "Project restored",
        ),
      )
      .catch((error) => this.errorHandler.handleFirebaseAuthError(error));
  }

  trackById(_: number, proj: Project) {
    return proj.id;
  }
}
