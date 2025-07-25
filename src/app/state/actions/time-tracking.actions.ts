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

// Load all time entries for an account (for approvals)
export const loadAllTimeEntriesForAccount = createAction(
  "[Time Tracking] Load All Time Entries For Account",
  props<{accountId: string}>(),
);

export const loadAllTimeEntriesForAccountSuccess = createAction(
  "[Time Tracking] Load All Time Entries For Account Success",
  props<{accountId: string; entries: TimeEntry[]}>(),
);

export const loadAllTimeEntriesForAccountFailure = createAction(
  "[Time Tracking] Load All Time Entries For Account Failure",
  props<{accountId: string; error: any}>(),
);

// Update time entry (for approvals)
export const updateTimeEntry = createAction(
  "[Time Tracking] Update Time Entry",
  props<{entry: TimeEntry}>(),
);

export const updateTimeEntrySuccess = createAction(
  "[Time Tracking] Update Time Entry Success",
  props<{entry: TimeEntry}>(),
);

export const updateTimeEntryFailure = createAction(
  "[Time Tracking] Update Time Entry Failure",
  props<{error: any}>(),
);

// Submit timesheet for approval
export const submitTimesheetForApproval = createAction(
  "[Time Tracking] Submit Timesheet For Approval",
  props<{
    accountId: string;
    userId: string;
    weekStart: Date;
    entries: TimeEntry[];
  }>(),
);

export const submitTimesheetForApprovalSuccess = createAction(
  "[Time Tracking] Submit Timesheet For Approval Success",
  props<{accountId: string; userId: string; weekStart: Date}>(),
);

export const submitTimesheetForApprovalFailure = createAction(
  "[Time Tracking] Submit Timesheet For Approval Failure",
  props<{accountId: string; userId: string; weekStart: Date; error: any}>(),
);
