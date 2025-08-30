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
import {Store} from "@ngrx/store";
import {Observable, first} from "rxjs";
import {
  StandardProjectCategory,
  StandardProjectTemplate,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "../../../../../../../shared/models/standard-project-template.model";
import {Project} from "../../../../../../../shared/models/project.model";
import {ProjectCreationEvent} from "../interfaces/project-creation.interface";
import * as ProjectsActions from "../../../../../state/actions/projects.actions";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {SuccessHandlerService} from "../../../../../core/services/success-handler.service";
import {ErrorHandlerService} from "../../../../../core/services/error-handler.service";

@Injectable({
  providedIn: "root",
})
export class ProjectCreationService {
  constructor(
    private store: Store,
    private successHandler: SuccessHandlerService,
    private errorHandler: ErrorHandlerService,
  ) {}

  async handleProjectCreation(
    event: ProjectCreationEvent,
    accountId: string,
    existingProjects$: Observable<Project[]>,
  ): Promise<void> {
    if (event.type === "single") {
      await this.createSingleProject(
        event.projectName!,
        event.category,
        event.template,
        accountId,
        existingProjects$,
      );
    } else {
      await this.createBulkProjects(
        event.projectNames!,
        event.category,
        event.template,
        accountId,
        existingProjects$,
      );
    }
  }

  private async createSingleProject(
    projectName: string,
    category: StandardProjectCategory,
    template: StandardProjectTemplate | undefined,
    accountId: string,
    existingProjects$: Observable<Project[]>,
  ): Promise<void> {
    // Generate unique name if needed
    const uniqueName = await this.generateUniqueName(
      projectName,
      existingProjects$,
    );

    this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user: any) => {
        if (!user) {
          this.errorHandler.handleFirebaseAuthError({
            code: "auth-required",
            message: "You must be logged in to create projects.",
          });
          return;
        }

        const categoryInfo = STANDARD_PROJECT_CATEGORIES_INFO[category];
        const projectData = this.buildProjectData(
          uniqueName,
          category,
          template,
          categoryInfo,
          user.uid,
        );

        this.store.dispatch(
          ProjectsActions.createProject({
            accountId,
            project: projectData,
          }),
        );

        this.successHandler.handleSuccess(
          `Project "${uniqueName}" created successfully!`,
        );
      });
  }

  private async createBulkProjects(
    projectNames: string[],
    category: StandardProjectCategory,
    template: StandardProjectTemplate | undefined,
    accountId: string,
    existingProjects$: Observable<Project[]>,
  ): Promise<void> {
    if (projectNames.length === 0) {
      this.errorHandler.handleFirebaseAuthError({
        code: "names-required",
        message: "Please provide at least one project name.",
      });
      return;
    }

    // Generate unique names for all projects
    const uniqueNames = await this.generateUniqueNames(
      projectNames,
      existingProjects$,
    );

    this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user: any) => {
        if (!user) {
          this.errorHandler.handleFirebaseAuthError({
            code: "auth-required",
            message: "You must be logged in to create projects.",
          });
          return;
        }

        const categoryInfo = STANDARD_PROJECT_CATEGORIES_INFO[category];

        uniqueNames.forEach((projectName) => {
          const projectData = this.buildProjectData(
            projectName,
            category,
            template,
            categoryInfo,
            user.uid,
          );

          this.store.dispatch(
            ProjectsActions.createProject({
              accountId,
              project: projectData,
            }),
          );
        });

        this.successHandler.handleSuccess(
          `${uniqueNames.length} projects created successfully!`,
        );
      });
  }

  private buildProjectData(
    name: string,
    category: StandardProjectCategory,
    template: StandardProjectTemplate | undefined,
    categoryInfo: any,
    userId: string,
  ): Partial<Project> {
    const baseData: Partial<Project> = {
      name,
      standardCategory: category,
      description: template?.description || "",
      icon: template?.icon || categoryInfo.icon || "folder",
      color: template?.color || categoryInfo.color || "#666666",
      complexity: template?.complexity || "Simple",
      timeframe: template?.estimatedTimeframe || "Short-term",
      goals: template?.defaultTasks || [],
      requiredRoles: template?.requiredRoles || [],
      priority: "Medium",
      status: "Planning",
      createdBy: userId,
      lastModifiedBy: userId,
    };

    if (template) {
      baseData.standardProjectTemplateId = template.id;
    }

    return baseData;
  }

  private async generateUniqueName(
    baseName: string,
    existingProjects$: Observable<Project[]>,
  ): Promise<string> {
    return new Promise((resolve) => {
      existingProjects$.pipe(first()).subscribe((projects) => {
        const existingNames = projects.map((p) => p.name.toLowerCase());
        let projectName = baseName;
        let counter = 1;

        while (existingNames.includes(projectName.toLowerCase())) {
          counter++;
          projectName = `${baseName} ${counter}`;
        }

        resolve(projectName);
      });
    });
  }

  private async generateUniqueNames(
    baseNames: string[],
    existingProjects$: Observable<Project[]>,
  ): Promise<string[]> {
    return new Promise((resolve) => {
      existingProjects$.pipe(first()).subscribe((projects) => {
        const existingNames = projects.map((p) => p.name.toLowerCase());
        const uniqueNames: string[] = [];
        const usedNames = new Set(existingNames);

        baseNames.forEach((baseName) => {
          let projectName = baseName;
          let counter = 1;

          while (usedNames.has(projectName.toLowerCase())) {
            counter++;
            projectName = `${baseName} ${counter}`;
          }

          uniqueNames.push(projectName);
          usedNames.add(projectName.toLowerCase());
        });

        resolve(uniqueNames);
      });
    });
  }

  /**
   * Validates project creation data
   */
  validateProjectCreation(
    projectName: string,
    category: StandardProjectCategory | undefined,
  ): {isValid: boolean; error?: string} {
    if (!projectName.trim()) {
      return {isValid: false, error: "Project name is required"};
    }

    if (!category) {
      return {isValid: false, error: "Project category is required"};
    }

    if (projectName.length > 100) {
      return {
        isValid: false,
        error: "Project name must be less than 100 characters",
      };
    }

    return {isValid: true};
  }

  /**
   * Validates bulk project creation data
   */
  validateBulkProjectCreation(
    projectNames: string[],
    category: StandardProjectCategory | undefined,
  ): {isValid: boolean; error?: string} {
    if (!category) {
      return {isValid: false, error: "Project category is required"};
    }

    const validNames = projectNames.filter((name) => name.trim().length > 0);

    if (validNames.length === 0) {
      return {isValid: false, error: "At least one project name is required"};
    }

    const tooLongNames = validNames.filter((name) => name.length > 100);
    if (tooLongNames.length > 0) {
      return {
        isValid: false,
        error: "All project names must be less than 100 characters",
      };
    }

    return {isValid: true};
  }
}
