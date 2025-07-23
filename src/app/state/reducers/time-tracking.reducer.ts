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
import {Project} from "@shared/models/project.model";

export interface TimeTrackingState {
  projects: Project[];
  loading: boolean;
  error: any;
}

export const initialState: TimeTrackingState = {
  projects: [],
  loading: false,
  error: null,
};

export const timeTrackingReducer = createReducer(
  initialState,
  on(TimeTrackingActions.loadProjects, (state) => ({
    ...state,
    loading: true,
  })),
  on(TimeTrackingActions.loadProjectsSuccess, (state, {projects}) => ({
    ...state,
    projects,
    loading: false,
    error: null,
  })),
  on(TimeTrackingActions.loadProjectsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TimeTrackingActions.saveTimeEntry, (state) => ({
    ...state,
    loading: true,
  })),
  on(TimeTrackingActions.saveTimeEntrySuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(TimeTrackingActions.saveTimeEntryFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
);
