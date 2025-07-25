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
// src/app/state/actions/projects.actions.ts

import {createAction, props} from "@ngrx/store";
import {Project} from "@shared/models/project.model";

export const loadProjects = createAction(
  "[Projects] Load Projects",
  props<{accountId: string}>(),
);

export const loadProjectsSuccess = createAction(
  "[Projects] Load Projects Success",
  props<{accountId: string; projects: Project[]}>(),
);

export const loadProjectsFailure = createAction(
  "[Projects] Load Projects Failure",
  props<{error: any}>(),
);

export const createProject = createAction(
  "[Projects] Create Project",
  props<{accountId: string; project: Project}>(),
);

export const createProjectSuccess = createAction(
  "[Projects] Create Project Success",
  props<{project: Project}>(),
);

export const createProjectFailure = createAction(
  "[Projects] Create Project Failure",
  props<{error: any}>(),
);

export const updateProject = createAction(
  "[Projects] Update Project",
  props<{accountId: string; projectId: string; changes: Partial<Project>}>(),
);

export const updateProjectSuccess = createAction(
  "[Projects] Update Project Success",
  props<{project: Project}>(),
);

export const updateProjectFailure = createAction(
  "[Projects] Update Project Failure",
  props<{error: any}>(),
);

export const clearProjects = createAction("[Projects] Clear Projects");
