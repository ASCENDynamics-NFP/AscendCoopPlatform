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
 *******************************************************************************/
// src/app/state/effects/time.effects.ts

import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {from, of} from "rxjs";
import {catchError, map, mergeMap} from "rxjs/operators";
import * as TimeActions from "../actions/time.actions";
import {TimeTrackingService} from "../../core/services/time-tracking.service";
import {TimeEntry} from "@shared/models/time-entry.model";

@Injectable()
export class TimeEffects {
  constructor(
    private actions$: Actions,
    private timeService: TimeTrackingService,
  ) {}

  loadEntries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeActions.loadEntries),
      mergeMap(({userId}) =>
        this.timeService.getEntriesForUser(userId).pipe(
          map((entries) => TimeActions.loadEntriesSuccess({entries})),
          catchError((error) =>
            of(TimeActions.loadEntriesFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  createEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeActions.createEntry),
      mergeMap(({userId, entry}) =>
        from(this.timeService.createEntry(userId, entry)).pipe(
          map((id) => TimeActions.createEntrySuccess({entry: {...entry, id}})),
          catchError((error) =>
            of(TimeActions.createEntryFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  updateEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeActions.updateEntry),
      mergeMap(({userId, entry}) =>
        from(this.timeService.updateEntry(userId, entry)).pipe(
          map(() => TimeActions.updateEntrySuccess({entry})),
          catchError((error) =>
            of(TimeActions.updateEntryFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  deleteEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeActions.deleteEntry),
      mergeMap(({userId, entryId}) =>
        from(this.timeService.deleteEntry(userId, entryId)).pipe(
          map(() => TimeActions.deleteEntrySuccess({entryId})),
          catchError((error) =>
            of(TimeActions.deleteEntryFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  startEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeActions.startEntry),
      mergeMap(({userId, entry}) =>
        from(this.timeService.startEntry(userId, entry)).pipe(
          map((id) =>
            TimeActions.startEntrySuccess({
              entry: {...(entry as TimeEntry), id, userId},
            }),
          ),
          catchError((error) =>
            of(TimeActions.startEntryFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  stopEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeActions.stopEntry),
      mergeMap(({userId, entryId}) =>
        from(this.timeService.stopEntry(userId, entryId)).pipe(
          map(() => TimeActions.stopEntrySuccess({entryId})),
          catchError((error) =>
            of(TimeActions.stopEntryFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );
}
