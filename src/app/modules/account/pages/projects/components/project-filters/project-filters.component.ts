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
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {
  StandardProjectCategory,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "../../../../../../../../shared/models/standard-project-template.model";
import {
  ProjectFilter,
  DEFAULT_PROJECT_FILTER,
} from "../../interfaces/project-filter.interface";

@Component({
  selector: "app-project-filters",
  templateUrl: "./project-filters.component.html",
  styleUrls: ["./project-filters.component.scss"],
})
export class ProjectFiltersComponent {
  @Input() searchTerm = "";
  @Input() selectedCategory: StandardProjectCategory | "all" = "all";
  @Input() sortBy: "name" | "category" | "created" = "name";
  @Input() sortDirection: "asc" | "desc" = "asc";
  @Input() groupByCategory = false;
  @Input() projectCount = 0;
  @Input() showCategoryOverview = false;

  @Output() filterChange = new EventEmitter<ProjectFilter>();
  @Output() toggleCategoryOverview = new EventEmitter<void>();

  projectCategories = STANDARD_PROJECT_CATEGORIES_INFO;
  categoryKeys = Object.keys(
    STANDARD_PROJECT_CATEGORIES_INFO,
  ) as StandardProjectCategory[];

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.emitFilterChange();
  }

  onCategoryFilterChange(category: StandardProjectCategory | "all"): void {
    this.selectedCategory = category;
    this.emitFilterChange();
  }

  onSortChange(sortBy: "name" | "category" | "created"): void {
    this.sortBy = sortBy;
    this.emitFilterChange();
  }

  onSortDirectionToggle(): void {
    this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    this.emitFilterChange();
  }

  onGroupByCategoryToggle(): void {
    this.groupByCategory = !this.groupByCategory;
    this.emitFilterChange();
  }

  onToggleCategoryOverview(): void {
    this.toggleCategoryOverview.emit();
  }

  clearFilters(): void {
    this.searchTerm = "";
    this.selectedCategory = "all";
    this.sortBy = "name";
    this.sortDirection = "asc";
    this.groupByCategory = false;
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      selectedCategory: this.selectedCategory,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      showGrouped: this.groupByCategory,
    });
  }

  getSortIcon(): string {
    return this.sortDirection === "asc" ? "arrow-up" : "arrow-down";
  }

  hasActiveFilters(): boolean {
    return (
      this.searchTerm !== "" ||
      this.selectedCategory !== "all" ||
      this.sortBy !== "name" ||
      this.sortDirection !== "asc" ||
      this.groupByCategory
    );
  }
}
