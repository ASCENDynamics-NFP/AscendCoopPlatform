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
// src/app/state/actions/time-tracking.actions.ts

import {createAction, props} from "@ngrx/store";
import {Project} from "@shared/models/project.model";
import {TimeEntry} from "@shared/models/time-entry.model";

export const loadProjects = createAction(
  "[Time Tracking] Load Projects",
  props<{accountId: string}>(),
);

export const loadProjectsSuccess = createAction(
  "[Time Tracking] Load Projects Success",
  props<{projects: Project[]}>(),
);

export const loadProjectsFailure = createAction(
  "[Time Tracking] Load Projects Failure",
  props<{error: any}>(),
);

export const saveTimeEntry = createAction(
  "[Time Tracking] Save Time Entry",
  props<{entry: TimeEntry}>(),
);

export const saveTimeEntrySuccess = createAction(
  "[Time Tracking] Save Time Entry Success",
  props<{entry: TimeEntry}>(),
);

export const saveTimeEntryFailure = createAction(
  "[Time Tracking] Save Time Entry Failure",
  props<{error: any}>(),
);

export const loadTimeEntries = createAction(
  "[Time Tracking] Load Time Entries",
  props<{accountId: string; userId: string; weekStart: Date}>(),
);

export const loadTimeEntriesSuccess = createAction(
  "[Time Tracking] Load Time Entries Success",
  props<{
    accountId: string;
    userId: string;
    weekStart: Date;
    entries: TimeEntry[];
  }>(),
);

export const loadTimeEntriesFailure = createAction(
  "[Time Tracking] Load Time Entries Failure",
  props<{
    accountId: string;
    userId: string;
    weekStart: Date;
    error: any;
  }>(),
);

export const deleteTimeEntry = createAction(
  "[Time Tracking] Delete Time Entry",
  props<{entry: TimeEntry}>(),
);

export const deleteTimeEntrySuccess = createAction(
  "[Time Tracking] Delete Time Entry Success",
  props<{entryId: string}>(),
);

export const deleteTimeEntryFailure = createAction(
  "[Time Tracking] Delete Time Entry Failure",
  props<{error: any}>(),
);

export const clearTimeTrackingSubscriptions = createAction(
  "[Time Tracking] Clear Subscriptions",
);
