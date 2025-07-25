/*******************************************************************************
 ****************
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
 ********************************************************************************
 ***************/
// src/app/state/reducers/projects.reducer.ts

import {createReducer, on} from "@ngrx/store";
import * as ProjectsActions from "../actions/projects.actions";
import {Project} from "@shared/models/project.model";

export interface ProjectsState {
  entities: {[accountId: string]: Project[]};
  loading: boolean;
  error?: any;
}

export const initialState: ProjectsState = {
  entities: {},
  loading: false,
  error: null,
};

export const projectsReducer = createReducer(
  initialState,
  on(ProjectsActions.clearProjects, () => ({
    ...initialState,
  })),

  on(ProjectsActions.loadProjects, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsActions.loadProjectsSuccess, (state, {accountId, projects}) => ({
    ...state,
    entities: {
      ...state.entities,
      [accountId]: projects,
    },
    loading: false,
    error: null,
  })),
  on(ProjectsActions.loadProjectsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProjectsActions.createProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsActions.createProjectSuccess, (state, {project}) => ({
    ...state,
    entities: {
      ...state.entities,
      [project.accountId]: [
        ...(state.entities[project.accountId] || []),
        project,
      ],
    },
    loading: false,
    error: null,
  })),
  on(ProjectsActions.createProjectFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProjectsActions.updateProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsActions.updateProjectSuccess, (state, {project}) => ({
    ...state,
    entities: {
      ...state.entities,
      [project.accountId]: (state.entities[project.accountId] || []).map((p) =>
        p.id === project.id ? project : p,
      ),
    },
    loading: false,
    error: null,
  })),
  on(ProjectsActions.updateProjectFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
);
