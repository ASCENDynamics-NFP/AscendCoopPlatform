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
// src/app/state/reducers/time-tracking.reducer.ts

import {createReducer, on} from "@ngrx/store";
import * as TimeTrackingActions from "../actions/time-tracking.actions";
import {TimeEntry} from "@shared/models/time-entry.model";

export interface TimeEntriesState {
  entities: {[accountUser: string]: TimeEntry[]};
  loading: boolean;
  error?: any;
}

export const initialState: TimeEntriesState = {
  entities: {},
  loading: false,
  error: null,
};

export const timeTrackingReducer = createReducer(
  initialState,
  on(TimeTrackingActions.saveTimeEntry, (state) => ({
    ...state,
    loading: true,
  })),
  on(TimeTrackingActions.saveTimeEntrySuccess, (state, {entry}) => {
    // Ensure state.entities exists
    const entities = state.entities || {};
    const key = `${entry.accountId}_${entry.userId}`;
    const existingEntries = entities[key] || [];

    // Check if this is an update (entry has ID and exists) or a new entry
    const existingIndex = existingEntries.findIndex(
      (e) => e.id === entry.id && entry.id !== "",
    );

    let updatedEntries;
    if (existingIndex >= 0) {
      // Update existing entry
      updatedEntries = [
        ...existingEntries.slice(0, existingIndex),
        entry,
        ...existingEntries.slice(existingIndex + 1),
      ];
    } else {
      // Add new entry
      updatedEntries = [...existingEntries, entry];
    }

    return {
      ...state,
      entities: {
        ...entities,
        [key]: updatedEntries,
      },
      loading: false,
      error: null,
    };
  }),
  on(TimeTrackingActions.saveTimeEntryFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TimeTrackingActions.loadTimeEntries, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    TimeTrackingActions.loadTimeEntriesSuccess,
    (state, {accountId, userId, entries}) => ({
      ...state,
      entities: {
        ...(state.entities || {}),
        [`${accountId}_${userId}`]: entries,
      },
      loading: false,
      error: null,
    }),
  ),
  on(TimeTrackingActions.loadTimeEntriesFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TimeTrackingActions.deleteTimeEntry, (state) => ({
    ...state,
    loading: true,
  })),
  on(TimeTrackingActions.deleteTimeEntrySuccess, (state, {entryId}) => {
    const entities = state.entities || {};
    return {
      ...state,
      entities: Object.keys(entities).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (entities[key] || []).filter((e) => e.id !== entryId),
        }),
        {},
      ),
      loading: false,
      error: null,
    };
  }),
  on(TimeTrackingActions.deleteTimeEntryFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load all time entries for account (for approvals)
  on(TimeTrackingActions.loadAllTimeEntriesForAccount, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    TimeTrackingActions.loadAllTimeEntriesForAccountSuccess,
    (state, {accountId, entries}) => ({
      ...state,
      entities: {
        ...(state.entities || {}),
        [`${accountId}_all`]: entries,
      },
      loading: false,
      error: null,
    }),
  ),
  on(
    TimeTrackingActions.loadAllTimeEntriesForAccountFailure,
    (state, {error}) => ({
      ...state,
      loading: false,
      error,
    }),
  ),

  // Update time entry (for approvals)
  on(TimeTrackingActions.updateTimeEntry, (state) => ({
    ...state,
    loading: true,
  })),
  on(TimeTrackingActions.updateTimeEntrySuccess, (state, {entry}) => {
    const entities = state.entities || {};
    const updatedEntities = {...entities};

    // Update the entry in all relevant entity keys
    Object.keys(updatedEntities).forEach((key) => {
      const entryArray = updatedEntities[key] || [];
      const entryIndex = entryArray.findIndex((e) => e.id === entry.id);
      if (entryIndex !== -1) {
        updatedEntities[key] = [
          ...entryArray.slice(0, entryIndex),
          entry,
          ...entryArray.slice(entryIndex + 1),
        ];
      }
    });

    return {
      ...state,
      entities: updatedEntities,
      loading: false,
      error: null,
    };
  }),
  on(TimeTrackingActions.updateTimeEntryFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Submit timesheet for approval
  on(TimeTrackingActions.submitTimesheetForApproval, (state) => ({
    ...state,
    loading: true,
  })),
  on(TimeTrackingActions.submitTimesheetForApprovalSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(
    TimeTrackingActions.submitTimesheetForApprovalFailure,
    (state, {error}) => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(TimeTrackingActions.clearTimeTrackingSubscriptions, () => ({
    ...initialState,
  })),
);
