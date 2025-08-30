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
import {
  StandardProjectCategory,
  StandardProjectTemplate,
  STANDARD_PROJECT_TEMPLATES,
} from "../../../../../../../../shared/models/standard-project-template.model";
import {CategorySuggestion} from "../../../../../../core/constants/category-keywords.constant";
import {
  ProjectCreationEvent,
  ProjectCreationState,
  DEFAULT_PROJECT_CREATION_STATE,
} from "../../interfaces/project-creation.interface";

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
  @Output() templateSelected = new EventEmitter<StandardProjectTemplate>();
  @Output() stateChange = new EventEmitter<ProjectCreationState>();

  ngOnInit() {
    this.updateAvailableTemplates();
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

  onTemplateSelected(template: StandardProjectTemplate): void {
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

  toggleBulkCreate(): void {
    const bulkCreateProjects = !this.state.bulkCreateProjects;
    this.state = {
      ...this.state,
      bulkCreateProjects,
      bulkCreateCount: bulkCreateProjects ? 3 : 1,
      bulkCreateNames: bulkCreateProjects
        ? ["Project 1", "Project 2", "Project 3"]
        : [this.state.newProjectName || ""],
    };
    this.emitStateChange();
  }

  addBulkCreateProject(): void {
    const newCount = this.state.bulkCreateCount + 1;
    this.state = {
      ...this.state,
      bulkCreateCount: newCount,
      bulkCreateNames: [...this.state.bulkCreateNames, `Project ${newCount}`],
    };
    this.emitStateChange();
  }

  removeBulkCreateProject(index: number): void {
    if (this.state.bulkCreateNames.length > 1) {
      const newNames = [...this.state.bulkCreateNames];
      newNames.splice(index, 1);
      this.state = {
        ...this.state,
        bulkCreateNames: newNames,
        bulkCreateCount: newNames.length,
      };
      this.emitStateChange();
    }
  }

  updateBulkProjectName(index: number, name: string): void {
    const newNames = [...this.state.bulkCreateNames];
    newNames[index] = name;
    this.state = {
      ...this.state,
      bulkCreateNames: newNames,
    };
    this.emitStateChange();
  }

  createProject(): void {
    if (!this.state.selectedCategory || !this.state.newProjectName.trim())
      return;

    const event: ProjectCreationEvent = {
      type: "single",
      projectName: this.state.newProjectName.trim(),
      category: this.state.selectedCategory,
      template: this.state.selectedTemplate,
    };

    this.projectCreate.emit(event);
  }

  createBulkProjects(): void {
    if (!this.state.selectedCategory) return;

    const validNames = this.state.bulkCreateNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (validNames.length === 0) return;

    const event: ProjectCreationEvent = {
      type: "bulk",
      projectNames: validNames,
      category: this.state.selectedCategory,
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

  get isBulkCreateDisabled(): boolean {
    return (
      !this.state.selectedCategory ||
      this.state.bulkCreateNames.every((name) => !name.trim())
    );
  }
}
