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
// src/app/state/selectors/projects.selectors.ts

import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ProjectsState} from "../reducers/projects.reducer";
import {Project} from "../../../../shared/models/project.model";

export const selectProjectsState =
  createFeatureSelector<ProjectsState>("projects");

export const selectProjectsByAccount = (accountId: string) =>
  createSelector(
    selectProjectsState,
    (state: ProjectsState): Project[] => state?.entities?.[accountId] || [],
  );

export const selectActiveProjectsByAccount = (accountId: string) =>
  createSelector(selectProjectsByAccount(accountId), (projects: Project[]) =>
    projects.filter((p) => !p.archived),
  );

export const selectArchivedProjectsByAccount = (accountId: string) =>
  createSelector(selectProjectsByAccount(accountId), (projects: Project[]) =>
    projects.filter((p) => p.archived),
  );

export const selectAllProjectsByAccount = (accountId: string) =>
  createSelector(
    selectProjectsByAccount(accountId),
    (projects: Project[]): Project[] => projects,
  );

export const selectProjectsLoading = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state?.loading || false,
);

export const selectProjectsError = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state?.error,
);
