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
import {AlertController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {Observable, first} from "rxjs";
import {
  StandardProjectCategory,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "../../../../../../../shared/models/standard-project-template.model";
import {Project} from "../../../../../../../shared/models/project.model";
import {BulkActionEvent} from "../interfaces/bulk-actions.interface";
import * as ProjectsActions from "../../../../../state/actions/projects.actions";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {SuccessHandlerService} from "../../../../../core/services/success-handler.service";

export interface BulkActionCallbacks {
  onClearSelection: () => void;
  onSelectAll?: () => void;
  onToggleSelectMode?: () => void;
}

@Injectable({
  providedIn: "root",
})
export class BulkActionsService {
  constructor(
    private alertController: AlertController,
    private store: Store,
    private successHandler: SuccessHandlerService,
  ) {}

  async handleBulkAction(
    event: BulkActionEvent,
    accountId: string,
    callbacks: BulkActionCallbacks,
  ): Promise<void> {
    console.log("handleBulkAction called with:", event, accountId);
    switch (event.type) {
      case "archive":
        console.log(
          "Executing archive with projectIds:",
          event.selectedProjectIds,
        );
        await this.handleBulkArchive(
          event.selectedProjectIds,
          accountId,
          callbacks,
        );
        break;
      case "delete":
        console.log(
          "Executing delete with projectIds:",
          event.selectedProjectIds,
        );
        await this.handleBulkDelete(
          event.selectedProjectIds,
          accountId,
          callbacks,
        );
        break;
      case "changeCategory":
        await this.handleBulkChangeCategory(
          event.selectedProjectIds,
          accountId,
          callbacks,
        );
        break;
      case "selectAll":
        if (callbacks.onSelectAll) {
          callbacks.onSelectAll();
        }
        break;
      case "clearSelection":
        callbacks.onClearSelection();
        break;
    }
  }

  private async handleBulkArchive(
    projectIds: string[],
    accountId: string,
    callbacks: BulkActionCallbacks,
  ): Promise<void> {
    console.log("handleBulkArchive called, creating alert...");
    const alert = await this.alertController.create({
      header: "Archive Projects",
      message: `Are you sure you want to archive ${projectIds.length} selected project(s)?`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Archive cancelled by user");
          },
        },
        {
          text: "Archive",
          handler: () => {
            console.log("Archive confirmed by user");
            this.executeArchiveProjects(projectIds, accountId, callbacks);
          },
        },
      ],
    });
    console.log("Presenting archive alert...");
    await alert.present();
  }

  private async handleBulkDelete(
    projectIds: string[],
    accountId: string,
    callbacks: BulkActionCallbacks,
  ): Promise<void> {
    console.log("handleBulkDelete called, creating alert...");
    const alert = await this.alertController.create({
      header: "Delete Projects",
      message: `Are you sure you want to permanently delete ${projectIds.length} selected project(s)? This action cannot be undone.`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Delete cancelled by user");
          },
        },
        {
          text: "Delete",
          cssClass: "danger",
          handler: () => {
            console.log("Delete confirmed by user");
            this.executeDeleteProjects(projectIds, accountId, callbacks);
          },
        },
      ],
    });
    console.log("Presenting delete alert...");
    await alert.present();
  }

  private async handleBulkChangeCategory(
    projectIds: string[],
    accountId: string,
    callbacks: BulkActionCallbacks,
  ): Promise<void> {
    const categoryOptions = Object.keys(STANDARD_PROJECT_CATEGORIES_INFO).map(
      (key) => ({
        name: key,
        type: "radio" as const,
        label: key,
        value: key,
      }),
    );

    const alert = await this.alertController.create({
      header: "Change Category",
      message: `Select a new category for ${projectIds.length} selected project(s):`,
      inputs: categoryOptions,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Change Category",
          handler: (selectedCategory) => {
            if (selectedCategory) {
              this.executeChangeCategoryProjects(
                projectIds,
                selectedCategory,
                accountId,
                callbacks,
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

  private executeArchiveProjects(
    projectIds: string[],
    accountId: string,
    callbacks: BulkActionCallbacks,
  ): void {
    console.log("executeArchiveProjects called with:", projectIds, accountId);
    this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user: any) => {
        console.log("User from store:", user);
        if (!user) {
          console.error("No user found for archive operation");
          return;
        }

        projectIds.forEach((projectId) => {
          console.log("Dispatching archive action for project:", projectId);
          this.store.dispatch(
            ProjectsActions.updateProject({
              accountId,
              projectId,
              changes: {
                status: "Cancelled",
                archived: true,
                lastModifiedBy: user.uid,
              },
            }),
          );
        });

        this.successHandler.handleSuccess(
          `${projectIds.length} project(s) archived successfully!`,
        );
        this.completeAction(callbacks);
      });
  }

  private executeDeleteProjects(
    projectIds: string[],
    accountId: string,
    callbacks: BulkActionCallbacks,
  ): void {
    console.log("executeDeleteProjects called with:", projectIds, accountId);
    projectIds.forEach((projectId) => {
      console.log("Dispatching delete action for project:", projectId);
      this.store.dispatch(
        ProjectsActions.updateProject({
          accountId,
          projectId,
          changes: {
            status: "Cancelled",
            archived: true,
          },
        }),
      );
    });

    this.successHandler.handleSuccess(
      `${projectIds.length} project(s) deleted successfully!`,
    );
    this.completeAction(callbacks);
  }

  private executeChangeCategoryProjects(
    projectIds: string[],
    newCategory: StandardProjectCategory,
    accountId: string,
    callbacks: BulkActionCallbacks,
  ): void {
    this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user: any) => {
        if (!user) return;

        projectIds.forEach((projectId) => {
          this.store.dispatch(
            ProjectsActions.updateProject({
              accountId,
              projectId,
              changes: {
                standardCategory: newCategory,
                lastModifiedBy: user.uid,
              },
            }),
          );
        });

        this.successHandler.handleSuccess(
          `${projectIds.length} project(s) category changed to ${newCategory} successfully!`,
        );
        this.completeAction(callbacks);
      });
  }

  private completeAction(callbacks: BulkActionCallbacks): void {
    callbacks.onClearSelection();
    if (callbacks.onToggleSelectMode) {
      callbacks.onToggleSelectMode();
    }
  }

  /**
   * Manages project selection state
   */
  toggleProjectSelection(
    projectId: string,
    selectedProjects: Set<string>,
  ): Set<string> {
    const newSelection = new Set(selectedProjects);
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId);
    } else {
      newSelection.add(projectId);
    }
    return newSelection;
  }

  /**
   * Selects all projects from a list
   */
  selectAllProjects(projects: Project[]): Set<string> {
    return new Set(projects.map((project) => project.id));
  }

  /**
   * Clears all project selections
   */
  clearAllSelections(): Set<string> {
    return new Set();
  }

  /**
   * Determines if bulk actions should be shown
   */
  shouldShowBulkActions(selectedProjects: Set<string>): boolean {
    return selectedProjects.size > 0;
  }
}
