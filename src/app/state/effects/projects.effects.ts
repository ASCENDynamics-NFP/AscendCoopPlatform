import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {from, of} from "rxjs";
import {catchError, map, switchMap, takeUntil, tap} from "rxjs/operators";
import * as ProjectsActions from "../actions/projects.actions";
import {Project} from "@shared/models/project.model";
import {FirestoreService} from "../../core/services/firestore.service";
import {ErrorHandlerService} from "../../core/services/error-handler.service";
import {SuccessHandlerService} from "../../core/services/success-handler.service";

@Injectable()
export class ProjectsEffects {
  constructor(
    private actions$: Actions,
    private afs: AngularFirestore,
    private firestore: FirestoreService,
    private errorHandler: ErrorHandlerService,
    private successHandler: SuccessHandlerService,
  ) {}

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.loadProjects),
      switchMap(({accountId}) =>
        this.afs
          .collection<Project>(`accounts/${accountId}/projects`)
          .valueChanges({idField: "id"})
          .pipe(
            takeUntil(
              this.actions$.pipe(ofType(ProjectsActions.clearProjects)),
            ),
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
        from(
          this.firestore.addDocument(`accounts/${accountId}/projects`, project),
        ).pipe(
          map((id) =>
            ProjectsActions.createProjectSuccess({
              project: {...project, id, accountId},
            }),
          ),
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
        from(
          this.firestore.updateDocument(
            `accounts/${accountId}/projects`,
            projectId,
            changes,
          ),
        ).pipe(
          map(() =>
            ProjectsActions.updateProjectSuccess({
              project: {...changes, id: projectId, accountId} as Project,
            }),
          ),
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
        from(
          this.firestore.deleteDocument(
            `accounts/${accountId}/projects`,
            projectId,
          ),
        ).pipe(
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
