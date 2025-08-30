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

import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {
  StandardProjectCategory,
  StandardProjectTemplate,
  STANDARD_PROJECT_TEMPLATES,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "../../../../../../../../shared/models/standard-project-template.model";
import {CategorySuggestion} from "../../../../../../core/constants/category-keywords.constant";
import {
  ProjectCreationEvent,
  ProjectCreationState,
  DEFAULT_PROJECT_CREATION_STATE,
} from "../../interfaces/project-creation.interface";
import {TemplatePreviewModalComponent} from "../template-preview-modal/template-preview-modal.component";

@Component({
  selector: "app-project-creation",
  templateUrl: "./project-creation.component.html",
  styleUrls: ["./project-creation.component.scss"],
})
export class ProjectCreationComponent implements OnInit {
  @Input() state: ProjectCreationState = DEFAULT_PROJECT_CREATION_STATE;

  @Output() projectCreate = new EventEmitter<ProjectCreationEvent>();
  @Output() categoryChange = new EventEmitter<StandardProjectCategory>();
  @Output() projectNameChange = new EventEmitter<string>();
  @Output() templateSelected = new EventEmitter<
    StandardProjectTemplate | undefined
  >();
  @Output() stateChange = new EventEmitter<ProjectCreationState>();

  constructor(private modalController: ModalController) {}

  // Creation mode property
  creationMode: "single" | null = null;

  ngOnInit() {
    this.updateAvailableTemplates();
  }

  // Creation mode methods
  setCreationMode(mode: "single"): void {
    this.creationMode = mode;
  }

  // Check if can create project
  canCreateProject(): boolean {
    return !this.isCreateDisabled;
  }

  // Cancel action
  onCancel(): void {
    this.resetProjectCreation();
  }

  // Preview action
  async onPreview(): Promise<void> {
    if (!this.state.selectedTemplate) {
      return;
    }

    const modal = await this.modalController.create({
      component: TemplatePreviewModalComponent,
      componentProps: {
        template: this.state.selectedTemplate,
      },
      cssClass: "template-preview-modal",
    });

    await modal.present();
  }

  // Get create button text
  getCreateButtonText(): string {
    return "Create Project";
  }

  onCategorySelected(category: StandardProjectCategory): void {
    this.state = {
      ...this.state,
      selectedCategory: category,
      selectedTemplate: undefined,
    };
    this.updateAvailableTemplates();
    this.categoryChange.emit(category);
    this.emitStateChange();
  }

  onProjectNameChange(name: string): void {
    this.state = {
      ...this.state,
      newProjectName: name,
    };
    this.projectNameChange.emit(name);
    this.emitStateChange();
  }

  onTemplateSelected(template: StandardProjectTemplate | undefined): void {
    this.state = {
      ...this.state,
      selectedTemplate: template,
    };
    this.templateSelected.emit(template);
    this.emitStateChange();
  }

  onCategorySuggestionSelected(category: StandardProjectCategory): void {
    this.onCategorySelected(category);
  }

  dismissCategorySuggestions(): void {
    this.state = {
      ...this.state,
      showCategorySuggestions: false,
    };
    this.emitStateChange();
  }

  createProject(): void {
    if (!this.state.selectedCategory || !this.state.newProjectName.trim())
      return;

    this.createSingleProject();
  }

  createSingleProject(): void {
    const event: ProjectCreationEvent = {
      type: "single",
      projectName: this.state.newProjectName.trim(),
      category: this.state.selectedCategory!,
      template: this.state.selectedTemplate,
    };

    this.projectCreate.emit(event);
  }

  resetProjectCreation(): void {
    this.state = {
      ...DEFAULT_PROJECT_CREATION_STATE,
    };
    this.emitStateChange();
  }

  private updateAvailableTemplates(): void {
    if (this.state.selectedCategory) {
      this.state = {
        ...this.state,
        availableTemplates: STANDARD_PROJECT_TEMPLATES.filter(
          (template) => template.category === this.state.selectedCategory,
        ),
      };
    } else {
      this.state = {
        ...this.state,
        availableTemplates: [],
      };
    }
  }

  private emitStateChange(): void {
    this.stateChange.emit(this.state);
  }

  get isCreateDisabled(): boolean {
    return !this.state.newProjectName.trim() || !this.state.selectedCategory;
  }

  getCategoryDescription(): string {
    if (!this.state.selectedCategory) return "";

    const categoryInfo =
      STANDARD_PROJECT_CATEGORIES_INFO[this.state.selectedCategory];
    return categoryInfo?.description || "";
  }

  getCategoryInfo(): {icon: string; color: string} {
    if (!this.state.selectedCategory) return {icon: "folder", color: "#666"};

    const categoryInfo =
      STANDARD_PROJECT_CATEGORIES_INFO[this.state.selectedCategory];
    return {
      icon: categoryInfo?.icon || "folder",
      color: categoryInfo?.color || "#666",
    };
  }
}
