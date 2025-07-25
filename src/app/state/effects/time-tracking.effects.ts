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
 ********************************************************************************/
// src/app/state/effects/time-tracking.effects.ts

import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {
  mergeMap,
  map,
  catchError,
  tap,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import {of, from} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {TimeTrackingService} from "../../core/services/time-tracking.service";
import * as TimeTrackingActions from "../actions/time-tracking.actions";
import {ErrorHandlerService} from "../../core/services/error-handler.service";

@Injectable()
export class TimeTrackingEffects {
  constructor(
    private actions$: Actions,
    private afs: AngularFirestore,
    private service: TimeTrackingService,
    private errorHandler: ErrorHandlerService,
  ) {}

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeTrackingActions.loadProjects),
      switchMap(({accountId}) =>
        this.service.getProjects(accountId).pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(TimeTrackingActions.clearTimeTrackingSubscriptions),
            ),
          ),
          map((projects) =>
            TimeTrackingActions.loadProjectsSuccess({projects}),
          ),
          catchError((error) =>
            of(TimeTrackingActions.loadProjectsFailure({error})),
          ),
        ),
      ),
    ),
  );

  saveEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeTrackingActions.saveTimeEntry),
      mergeMap(({entry}) => {
        const save$ = entry.id
          ? from(this.service.updateTimeEntry(entry)).pipe(map(() => entry.id))
          : from(this.service.addTimeEntry(entry));
        return save$.pipe(
          map((id) =>
            TimeTrackingActions.saveTimeEntrySuccess({entry: {...entry, id}}),
          ),
          catchError((error) =>
            of(TimeTrackingActions.saveTimeEntryFailure({error})),
          ),
        );
      }),
    ),
  );

  deleteEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeTrackingActions.deleteTimeEntry),
      mergeMap(({entry}) =>
        from(this.service.deleteTimeEntry(entry)).pipe(
          map(() =>
            TimeTrackingActions.deleteTimeEntrySuccess({entryId: entry.id}),
          ),
          catchError((error) =>
            of(TimeTrackingActions.deleteTimeEntryFailure({error})),
          ),
        ),
      ),
    ),
  );

  showErrors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TimeTrackingActions.loadProjectsFailure,
          TimeTrackingActions.saveTimeEntryFailure,
          TimeTrackingActions.deleteTimeEntryFailure,
          TimeTrackingActions.loadTimeEntriesFailure,
        ),
        tap(({error}) => this.errorHandler.handleFirebaseAuthError(error)),
      ),
    {dispatch: false},
  );

  loadEntries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeTrackingActions.loadTimeEntries),
      switchMap(({accountId, userId, weekStart}) => {
        const start = new Date(weekStart);
        const end = new Date(start);
        end.setDate(start.getDate() + 7);
        return this.afs
          .collection(`accounts/${accountId}/timeEntries`, (ref) =>
            ref
              .where("userId", "==", userId)
              .where("date", ">=", start)
              .where("date", "<", end),
          )
          .valueChanges({idField: "id"})
          .pipe(
            takeUntil(
              this.actions$.pipe(
                ofType(TimeTrackingActions.clearTimeTrackingSubscriptions),
              ),
            ),
            map((entries) =>
              TimeTrackingActions.loadTimeEntriesSuccess({
                accountId,
                userId,
                entries,
              }),
            ),
            catchError((error) =>
              of(
                TimeTrackingActions.loadTimeEntriesFailure({
                  accountId,
                  userId,
                  weekStart,
                  error,
                }),
              ),
            ),
          );
      }),
    ),
  );
}
