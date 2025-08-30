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

  get selectedCount(): number {
    return this.selectedProjects.size;
  }

  onArchiveProjects(): void {
    this.emitBulkAction("archive");
  }

  onDeleteProjects(): void {
    this.emitBulkAction("delete");
  }

  onChangeCategoryProjects(): void {
    this.emitBulkAction("changeCategory");
  }

  onClearSelection(): void {
    this.emitBulkAction("clearSelection");
  }

  private emitBulkAction(
    type: BulkActionEvent["type"],
    newCategory?: StandardProjectCategory,
  ): void {
    const selectedProjectIds = Array.from(this.selectedProjects);
    this.bulkAction.emit({
      type,
      selectedProjectIds,
      newCategory,
    });
  }
}
