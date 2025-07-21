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
// src/app/state/actions/time.actions.ts

import {createAction, props} from "@ngrx/store";
import {TimeEntry} from "@shared/models/time-entry.model";

export const loadEntries = createAction(
  "[Time Tracking] Load Entries",
  props<{userId: string}>(),
);

export const loadEntriesSuccess = createAction(
  "[Time Tracking API] Load Entries Success",
  props<{entries: TimeEntry[]}>(),
);

export const loadEntriesFailure = createAction(
  "[Time Tracking API] Load Entries Failure",
  props<{error: string}>(),
);

export const createEntry = createAction(
  "[Time Tracking] Create Entry",
  props<{userId: string; entry: TimeEntry}>(),
);

export const createEntrySuccess = createAction(
  "[Time Tracking API] Create Entry Success",
  props<{entry: TimeEntry}>(),
);

export const createEntryFailure = createAction(
  "[Time Tracking API] Create Entry Failure",
  props<{error: string}>(),
);

export const updateEntry = createAction(
  "[Time Tracking] Update Entry",
  props<{userId: string; entry: TimeEntry}>(),
);

export const updateEntrySuccess = createAction(
  "[Time Tracking API] Update Entry Success",
  props<{entry: TimeEntry}>(),
);

export const updateEntryFailure = createAction(
  "[Time Tracking API] Update Entry Failure",
  props<{error: string}>(),
);

export const deleteEntry = createAction(
  "[Time Tracking] Delete Entry",
  props<{userId: string; entryId: string}>(),
);

export const deleteEntrySuccess = createAction(
  "[Time Tracking API] Delete Entry Success",
  props<{entryId: string}>(),
);

export const deleteEntryFailure = createAction(
  "[Time Tracking API] Delete Entry Failure",
  props<{error: string}>(),
);

export const startEntry = createAction(
  "[Time Tracking] Start Entry",
  props<{userId: string; entry: Partial<TimeEntry>}>(),
);

export const startEntrySuccess = createAction(
  "[Time Tracking API] Start Entry Success",
  props<{entry: TimeEntry}>(),
);

export const startEntryFailure = createAction(
  "[Time Tracking API] Start Entry Failure",
  props<{error: string}>(),
);

export const stopEntry = createAction(
  "[Time Tracking] Stop Entry",
  props<{userId: string; entryId: string}>(),
);

export const stopEntrySuccess = createAction(
  "[Time Tracking API] Stop Entry Success",
  props<{entryId: string}>(),
);

export const stopEntryFailure = createAction(
  "[Time Tracking API] Stop Entry Failure",
  props<{error: string}>(),
);
