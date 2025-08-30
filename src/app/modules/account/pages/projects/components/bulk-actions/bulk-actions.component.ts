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

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {
  StandardProjectCategory,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "../../../../../../../../shared/models/standard-project-template.model";
import {BulkActionEvent} from "../../interfaces/bulk-actions.interface";

@Component({
  selector: "app-bulk-actions",
  templateUrl: "./bulk-actions.component.html",
  styleUrls: ["./bulk-actions.component.scss"],
})
export class BulkActionsComponent {
  @Input() selectedProjects: Set<string> = new Set();
  @Input() showBulkActions = false;

  @Output() bulkAction = new EventEmitter<BulkActionEvent>();

  projectCategories = STANDARD_PROJECT_CATEGORIES_INFO;
  showCategorySelector = false;
  selectedNewCategory: string | null = null;

  get selectedCount(): number {
    return this.selectedProjects.size;
  }

  get categoryKeys(): string[] {
    return Object.keys(this.projectCategories);
  }

  onArchiveProjects(): void {
    console.log("Archive button clicked", this.selectedProjects);
    this.emitBulkAction("archive");
  }

  onDeleteProjects(): void {
    console.log("Delete button clicked", this.selectedProjects);
    this.emitBulkAction("delete");
  }

  onChangeCategoryProjects(): void {
    console.log("Change category button clicked");
    this.showCategorySelector = !this.showCategorySelector;
  }

  onApplyBulkCategory(): void {
    console.log("Apply category clicked", this.selectedNewCategory);
    if (this.selectedNewCategory) {
      this.emitBulkAction(
        "changeCategory",
        this.selectedNewCategory as StandardProjectCategory,
      );
      this.showCategorySelector = false;
      this.selectedNewCategory = null;
    }
  }

  onSelectAll(): void {
    console.log("Select all button clicked");
    this.emitBulkAction("selectAll");
  }

  onClearSelection(): void {
    console.log("Clear selection button clicked");
    this.emitBulkAction("clearSelection");
    this.showCategorySelector = false;
    this.selectedNewCategory = null;
  }

  private emitBulkAction(
    type: BulkActionEvent["type"],
    newCategory?: StandardProjectCategory,
  ): void {
    console.log("Emitting bulk action:", type, newCategory);
    this.bulkAction.emit({
      type,
      selectedProjectIds: Array.from(this.selectedProjects),
      newCategory,
    });
  }
}
