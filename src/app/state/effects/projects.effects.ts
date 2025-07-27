import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {from, of} from "rxjs";
import {catchError, map, switchMap, takeUntil} from "rxjs/operators";
import * as ProjectsActions from "../actions/projects.actions";
import {Project} from "@shared/models/project.model";
import {FirestoreService} from "../../core/services/firestore.service";

@Injectable()
export class ProjectsEffects {
  constructor(
    private actions$: Actions,
    private afs: AngularFirestore,
    private firestore: FirestoreService,
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
            catchError((error) =>
              of(ProjectsActions.loadProjectsFailure({error})),
            ),
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
}
