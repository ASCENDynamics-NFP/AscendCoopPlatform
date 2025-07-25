import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable, combineLatest} from "rxjs";
import {map} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {Project} from "@shared/models/project.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectRelatedAccountsByAccountId} from "../../../../state/selectors/account.selectors";
import {ProjectService} from "../../../../core/services/project.service";
import {MetaService} from "../../../../core/services/meta.service";

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

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private projectService: ProjectService,
    private metaService: MetaService,
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
    this.archivedProjects$ = this.projects$.pipe(
      map((projects) => projects.filter((p) => p.archived)),
    );
  }

  addProject() {
    const name = this.newProjectName.trim();
    if (!name) return;
    const project: Project = {name, accountId: this.accountId} as Project;
    this.projectService
      .createProject(this.accountId, project)
      .then(() => (this.newProjectName = ""));
  }

  updateProject(project: Project, name: string) {
    if (!project.id) return;
    this.projectService.updateProject(this.accountId, project.id, {name});
  }

  toggleArchive(project: Project, archived: boolean) {
    if (!project.id) return;
    this.projectService.setArchived(this.accountId, project.id, archived);
  }

  trackById(_: number, proj: Project) {
    return proj.id;
  }
}
