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
// src/app/modules/account/components/directory-filter/directory-filter.component.ts

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  AfterViewInit,
} from "@angular/core";

export interface DirectoryFilterValues {
  includePrivateGroups: boolean;
  onlyMyGroups: boolean;
  onlyMyConnections: boolean;
  sort: "name-asc" | "name-desc";
}

@Component({
  selector: "app-directory-filter",
  templateUrl: "./directory-filter.component.html",
  styleUrls: ["./directory-filter.component.scss"],
})
export class DirectoryFilterComponent implements OnInit, AfterViewInit {
  @Input() isExpanded = false;
  @Input() showToggleButton = true;

  // Initial filter values from parent (to persist state when panel closes/reopens)
  @Input() initialIncludePrivateGroups = true;
  @Input() initialOnlyMyGroups = false;
  @Input() initialOnlyMyConnections = false;
  @Input() initialSort: "name-asc" | "name-desc" = "name-asc";

  @Output() filterChange = new EventEmitter<DirectoryFilterValues>();
  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() activeFilterCountChange = new EventEmitter<number>();

  // Filter values
  includePrivateGroups = true;
  onlyMyGroups = false;
  onlyMyConnections = false;
  sort: "name-asc" | "name-desc" = "name-asc";

  ngOnInit() {
    // Initialize from inputs to restore state when component is recreated
    this.includePrivateGroups = this.initialIncludePrivateGroups;
    this.onlyMyGroups = this.initialOnlyMyGroups;
    this.onlyMyConnections = this.initialOnlyMyConnections;
    this.sort = this.initialSort;
  }

  ngAfterViewInit() {
    // Emit initial active filter count after view init to ensure parent is ready
    Promise.resolve().then(() => {
      this.updateActiveFilterCount();
    });
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.expandedChange.emit(this.isExpanded);
  }

  onIncludePrivateGroupsChange(event: any) {
    this.includePrivateGroups = event.detail.checked;
    this.emitFilterChange();
  }

  onOnlyMyGroupsChange(event: any) {
    this.onlyMyGroups = event.detail.checked;
    this.emitFilterChange();
  }

  onOnlyMyConnectionsChange(event: any) {
    this.onlyMyConnections = event.detail.checked;
    this.emitFilterChange();
  }

  onSortChange(event: any) {
    this.sort = event.detail.value;
    this.emitFilterChange();
  }

  clearFilters() {
    this.includePrivateGroups = true;
    this.onlyMyGroups = false;
    this.onlyMyConnections = false;
    this.sort = "name-asc";
    this.emitFilterChange();
  }

  private emitFilterChange() {
    this.updateActiveFilterCount();
    this.filterChange.emit({
      includePrivateGroups: this.includePrivateGroups,
      onlyMyGroups: this.onlyMyGroups,
      onlyMyConnections: this.onlyMyConnections,
      sort: this.sort,
    });
  }

  private updateActiveFilterCount() {
    let count = 0;
    // Count non-default filter values
    if (!this.includePrivateGroups) count++;
    if (this.onlyMyGroups) count++;
    if (this.onlyMyConnections) count++;
    if (this.sort !== "name-asc") count++;
    this.activeFilterCountChange.emit(count);
  }
}
