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
// src/app/state/reducers/time.reducer.ts

import {createReducer, on} from "@ngrx/store";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import * as TimeActions from "../actions/time.actions";
import {TimeEntry} from "@shared/models/time-entry.model";

export interface TimeState extends EntityState<TimeEntry> {
  loading: boolean;
  error: string | null;
}

export const timeAdapter = createEntityAdapter<TimeEntry>({
  selectId: (entry) => entry.id,
});

export const initialState: TimeState = timeAdapter.getInitialState({
  loading: false,
  error: null,
});

export const timeReducer = createReducer(
  initialState,
  on(TimeActions.loadEntries, (state) => ({...state, loading: true})),
  on(TimeActions.loadEntriesSuccess, (state, {entries}) =>
    timeAdapter.setAll(entries, {...state, loading: false}),
  ),
  on(TimeActions.loadEntriesFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TimeActions.createEntrySuccess, (state, {entry}) =>
    timeAdapter.addOne(entry, {...state, loading: false}),
  ),
  on(TimeActions.updateEntrySuccess, (state, {entry}) =>
    timeAdapter.updateOne({id: entry.id, changes: entry}, {...state}),
  ),
  on(TimeActions.deleteEntrySuccess, (state, {entryId}) =>
    timeAdapter.removeOne(entryId, state),
  ),
  on(TimeActions.startEntrySuccess, (state, {entry}) =>
    timeAdapter.addOne(entry, state),
  ),
  on(TimeActions.stopEntrySuccess, (state, {entryId}) => state),
);
