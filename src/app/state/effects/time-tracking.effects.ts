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
import {TimeEntry} from "../../../../shared/models/time-entry.model";
import {TimeTrackingService} from "../../core/services/time-tracking.service";
import * as TimeTrackingActions from "../actions/time-tracking.actions";
import {ErrorHandlerService} from "../../core/services/error-handler.service";

@Injectable()
export class TimeTrackingEffects {
  constructor(
    private actions$: Actions,
    private timeTrackingService: TimeTrackingService,
    private errorHandler: ErrorHandlerService,
  ) {}

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeTrackingActions.loadProjects),
      switchMap(({accountId}) =>
        this.timeTrackingService.getProjects(accountId).pipe(
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
        const toIso = (d: any): string => {
          try {
            if (!d) return new Date().toISOString();
            if (typeof d === "string") return new Date(d).toISOString();
            if (d.toDate && typeof d.toDate === "function")
              return d.toDate().toISOString();
            if (d instanceof Date) return d.toISOString();
            return new Date(d).toISOString();
          } catch (_) {
            return new Date().toISOString();
          }
        };

        if (entry.id) {
          // Use callable update
          const updates: any = {
            date: toIso(entry.date),
            hours: entry.hours,
            // Map notes -> description to match backend
            description: (entry as any).notes || "",
            // category omitted; not present on TimeEntry model
            // isVolunteer optional; default false when undefined
            isVolunteer: (entry as any).isVolunteer ?? false,
            projectId: entry.projectId,
          };
          return this.timeTrackingService
            .updateTimeEntry(entry.id, updates)
            .pipe(
              map(() => TimeTrackingActions.saveTimeEntrySuccess({entry})),
              catchError((error) =>
                of(TimeTrackingActions.saveTimeEntryFailure({error})),
              ),
            );
        }

        // Use callable create
        const payload: any = {
          accountId: entry.accountId,
          projectId: entry.projectId,
          date: toIso(entry.date),
          hours: entry.hours,
          // Map notes -> description
          description: (entry as any).notes || "",
          // category omitted
          isVolunteer: (entry as any).isVolunteer ?? false,
        };
        return this.timeTrackingService.createTimeEntry(payload).pipe(
          map((created: any) =>
            TimeTrackingActions.saveTimeEntrySuccess({
              entry: created as TimeEntry,
            }),
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
        from(this.timeTrackingService.deleteTimeEntry(entry.id)).pipe(
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

        return this.timeTrackingService
          .getUserTimeEntries(accountId, userId, {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          })
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
                weekStart,
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

  // Load all time entries for account (for approvals)
  loadAllTimeEntriesForAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeTrackingActions.loadAllTimeEntriesForAccount),
      mergeMap(({accountId}) => {
        return this.timeTrackingService.getAccountTimeEntries(accountId).pipe(
          takeUntil(
            this.actions$.pipe(
              ofType(TimeTrackingActions.clearTimeTrackingSubscriptions),
            ),
          ),
          map((entries) => {
            return TimeTrackingActions.loadAllTimeEntriesForAccountSuccess({
              accountId,
              entries,
            });
          }),
          catchError((error) => {
            console.error("Error loading all time entries:", error);
            return of(
              TimeTrackingActions.loadAllTimeEntriesForAccountFailure({
                accountId,
                error,
              }),
            );
          }),
        );
      }),
    ),
  );

  // Update time entry (for approvals)
  updateTimeEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeTrackingActions.updateTimeEntry),
      mergeMap(({entry}) =>
        from(this.timeTrackingService.updateTimeEntry_legacy(entry)).pipe(
          map(() => TimeTrackingActions.updateTimeEntrySuccess({entry})),
          catchError((error) => {
            console.error("Error updating time entry:", error);
            return of(TimeTrackingActions.updateTimeEntryFailure({error}));
          }),
        ),
      ),
    ),
  );

  // Submit timesheet for approval
  submitTimesheetForApproval$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeTrackingActions.submitTimesheetForApproval),
      mergeMap(({accountId, userId, weekStart, entries}) => {
        // Update all entries to have pending status
        const updatePromises = entries.map((entry) =>
          this.timeTrackingService.updateTimeEntry_legacy({
            ...entry,
            status: "pending",
          }),
        );

        return from(Promise.all(updatePromises)).pipe(
          map(() =>
            TimeTrackingActions.submitTimesheetForApprovalSuccess({
              accountId,
              userId,
              weekStart,
            }),
          ),
          catchError((error) => {
            console.error("Error submitting timesheet for approval:", error);
            return of(
              TimeTrackingActions.submitTimesheetForApprovalFailure({
                accountId,
                userId,
                weekStart,
                error,
              }),
            );
          }),
        );
      }),
    ),
  );
}
