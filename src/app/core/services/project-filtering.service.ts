/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/

import {Injectable} from "@angular/core";
import {Observable, combineLatest} from "rxjs";
import {map} from "rxjs/operators";
import {Project} from "../../../../shared/models/project.model";
import {StandardProjectCategory} from "../../../../shared/models/standard-project-template.model";
import {ProjectFilter} from "../../modules/account/pages/projects/interfaces/project-filter.interface";

@Injectable({
  providedIn: "root",
})
export class ProjectFilteringService {
  /**
   * Apply filters to a list of projects
   */
  filterProjects(
    projects$: Observable<Project[]>,
    filter: ProjectFilter,
  ): Observable<Project[]> {
    return projects$.pipe(
      map((projects) => {
        let filteredProjects = [...projects];

        // Apply search filter
        if (filter.searchTerm) {
          const searchTerm = filter.searchTerm.toLowerCase();
          filteredProjects = filteredProjects.filter(
            (project) =>
              project.name.toLowerCase().includes(searchTerm) ||
              project.description?.toLowerCase().includes(searchTerm) ||
              project.standardCategory?.toLowerCase().includes(searchTerm),
          );
        }

        // Apply category filter
        if (filter.selectedCategory !== "all") {
          filteredProjects = filteredProjects.filter(
            (project) => project.standardCategory === filter.selectedCategory,
          );
        }

        // Apply sorting
        filteredProjects = this.sortProjects(
          filteredProjects,
          filter.sortBy,
          filter.sortDirection,
        );

        return filteredProjects;
      }),
    );
  }

  /**
   * Group projects by category
   */
  groupProjectsByCategory(
    projects$: Observable<Project[]>,
  ): Observable<{[key: string]: Project[]}> {
    return projects$.pipe(
      map((projects) => {
        const grouped: {[key: string]: Project[]} = {};

        projects.forEach((project) => {
          const category = project.standardCategory || "General";
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(project);
        });

        // Sort each group
        Object.keys(grouped).forEach((category) => {
          grouped[category] = this.sortProjects(
            grouped[category],
            "name",
            "asc",
          );
        });

        return grouped;
      }),
    );
  }

  /**
   * Get category overview statistics
   */
  getCategoryOverview(
    projects$: Observable<Project[]>,
  ): Observable<{[key: string]: {count: number}}> {
    return projects$.pipe(
      map((projects) => {
        const overview: {[key: string]: {count: number}} = {};

        projects.forEach((project) => {
          const category = project.standardCategory || "General";
          if (!overview[category]) {
            overview[category] = {count: 0};
          }
          overview[category].count++;
        });

        return overview;
      }),
    );
  }

  /**
   * Create filtered and grouped projects observable based on filter settings
   */
  createFilteredProjectsObservable(
    projects$: Observable<Project[]>,
    filter$: Observable<ProjectFilter>,
  ): Observable<{
    filtered: Project[];
    grouped: {[key: string]: Project[]};
    overview: {[key: string]: {count: number}};
  }> {
    return combineLatest([projects$, filter$]).pipe(
      map(([projects, filter]) => {
        // Apply filters
        const filteredProjects = this.applyFiltersSync(projects, filter);

        // Create grouped version
        const grouped = this.groupProjectsByCategorySync(filteredProjects);

        // Create overview
        const overview = this.getCategoryOverviewSync(filteredProjects);

        return {
          filtered: filteredProjects,
          grouped: grouped,
          overview: overview,
        };
      }),
    );
  }

  /**
   * Sort projects by specified criteria
   */
  private sortProjects(
    projects: Project[],
    sortBy: "name" | "category" | "created",
    direction: "asc" | "desc",
  ): Project[] {
    const sorted = [...projects].sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case "name":
          compareValue = a.name.localeCompare(b.name);
          break;
        case "category":
          const catA = a.standardCategory || "General";
          const catB = b.standardCategory || "General";
          compareValue = catA.localeCompare(catB);
          break;
        case "created":
          const dateA = this.getDateValue(a.createdAt);
          const dateB = this.getDateValue(b.createdAt);
          compareValue = dateA - dateB;
          break;
      }

      return direction === "asc" ? compareValue : -compareValue;
    });

    return sorted;
  }

  /**
   * Synchronous version of filterProjects for use in combined observables
   */
  private applyFiltersSync(
    projects: Project[],
    filter: ProjectFilter,
  ): Project[] {
    let filteredProjects = [...projects];

    // Apply search filter
    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filteredProjects = filteredProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm) ||
          project.description?.toLowerCase().includes(searchTerm) ||
          project.standardCategory?.toLowerCase().includes(searchTerm),
      );
    }

    // Apply category filter
    if (filter.selectedCategory !== "all") {
      filteredProjects = filteredProjects.filter(
        (project) => project.standardCategory === filter.selectedCategory,
      );
    }

    // Apply sorting
    filteredProjects = this.sortProjects(
      filteredProjects,
      filter.sortBy,
      filter.sortDirection,
    );

    return filteredProjects;
  }

  /**
   * Synchronous version of groupProjectsByCategory
   */
  private groupProjectsByCategorySync(projects: Project[]): {
    [key: string]: Project[];
  } {
    const grouped: {[key: string]: Project[]} = {};

    projects.forEach((project) => {
      const category = project.standardCategory || "General";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(project);
    });

    // Sort each group
    Object.keys(grouped).forEach((category) => {
      grouped[category] = this.sortProjects(grouped[category], "name", "asc");
    });

    return grouped;
  }

  /**
   * Synchronous version of getCategoryOverview
   */
  private getCategoryOverviewSync(projects: Project[]): {
    [key: string]: {count: number};
  } {
    const overview: {[key: string]: {count: number}} = {};

    projects.forEach((project) => {
      const category = project.standardCategory || "General";
      if (!overview[category]) {
        overview[category] = {count: 0};
      }
      overview[category].count++;
    });

    return overview;
  }

  /**
   * Extract date value from Firestore timestamp or Date object
   */
  private getDateValue(dateField: any): number {
    if (!dateField) return 0;
    if (dateField.toDate && typeof dateField.toDate === "function") {
      return dateField.toDate().getTime();
    }
    if (dateField instanceof Date) {
      return dateField.getTime();
    }
    if (typeof dateField === "string") {
      return new Date(dateField).getTime();
    }
    return 0;
  }
}
