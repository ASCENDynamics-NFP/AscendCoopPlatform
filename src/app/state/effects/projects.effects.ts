import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {from, of} from "rxjs";
import {catchError, map, switchMap, takeUntil, tap} from "rxjs/operators";
import * as ProjectsActions from "../actions/projects.actions";
import {Project} from "../../../../shared/models/project.model";
import {ProjectService} from "../../core/services/project.service";
import {ErrorHandlerService} from "../../core/services/error-handler.service";
import {SuccessHandlerService} from "../../core/services/success-handler.service";

@Injectable()
export class ProjectsEffects {
  constructor(
    private actions$: Actions,
    private projectService: ProjectService,
    private errorHandler: ErrorHandlerService,
    private successHandler: SuccessHandlerService,
  ) {}

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.loadProjects),
      switchMap(({accountId}) =>
        this.projectService.getAccountProjects(accountId).pipe(
          takeUntil(this.actions$.pipe(ofType(ProjectsActions.clearProjects))),
          map((projects) =>
            ProjectsActions.loadProjectsSuccess({accountId, projects}),
          ),
          catchError((error) => {
            // Gracefully handle permission-denied by returning empty list
            if (
              error &&
              (error.code === "permission-denied" ||
                error.code === "PERMISSION_DENIED")
            ) {
              return of(
                ProjectsActions.loadProjectsSuccess({
                  accountId,
                  projects: [],
                }),
              );
            }
            return of(ProjectsActions.loadProjectsFailure({error}));
          }),
        ),
      ),
    ),
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.createProject),
      switchMap(({accountId, project}) =>
        this.projectService
          .createProject({
            accountId,
            name: project.name,
            description: project.description || "",
            category: project.standardCategory || "other",
          })
          .pipe(
            // Backend returns { success, projectId, project }
            map((res) =>
              ProjectsActions.createProjectSuccess({
                project: res.project as Project,
              }),
            ),
            // After success, force reload to ensure list reflects server state
            switchMap((success) => [
              success,
              ProjectsActions.loadProjects({accountId}),
            ]),
            catchError((error) =>
              of(ProjectsActions.createProjectFailure({error})),
            ),
          ),
      ),
    ),
  );

  updateProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.updateProject),
      switchMap(({accountId, projectId, changes}) =>
        this.projectService
          .updateProject({
            accountId,
            projectId,
            updates: changes,
          })
          .pipe(
            // Backend returns only success; reload the list to reflect changes
            map(() => ProjectsActions.loadProjects({accountId})),
            catchError((error) =>
              of(ProjectsActions.updateProjectFailure({error})),
            ),
          ),
      ),
    ),
  );

  deleteProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.deleteProject),
      switchMap(({accountId, projectId}) =>
        this.projectService.deleteProject(accountId, projectId).pipe(
          map(() =>
            ProjectsActions.deleteProjectSuccess({accountId, projectId}),
          ),
          catchError((error) =>
            of(ProjectsActions.deleteProjectFailure({error})),
          ),
        ),
      ),
    ),
  );

  // Notify on delete success
  deleteProjectSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.deleteProjectSuccess),
        tap(() => this.successHandler.handleSuccess("Project deleted")),
      ),
    {dispatch: false},
  );

  // Notify on delete failure (e.g., rule blocked due to time entries)
  deleteProjectFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.deleteProjectFailure),
        tap(({error}) => {
          const code = (error && (error.code || error?.error?.code)) || "";
          const msg = (error && (error.message || error?.error?.message)) || "";
          const combined = `${code} ${msg}`.toLowerCase();
          const isPermDenied =
            code === "permission-denied" ||
            code === "PERMISSION_DENIED" ||
            combined.includes("permission-denied") ||
            combined.includes("missing or insufficient permissions");

          if (isPermDenied) {
            this.errorHandler.handleFirebaseAuthError({
              code: "project-has-entries",
              message:
                "Cannot delete this project because it has time entries associated with it. Remove those entries first or archive the project.",
            });
          } else {
            this.errorHandler.handleFirebaseAuthError({
              code: "project-delete-failed",
              message: "Failed to delete project. Please try again.",
            });
          }
        }),
      ),
    {dispatch: false},
  );
}
