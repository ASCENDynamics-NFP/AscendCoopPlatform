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
// src/app/modules/account/components/standard-role-selector/standard-role-selector.component.ts

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  StandardRoleTemplate,
  StandardRoleCategory,
  STANDARD_ROLE_TEMPLATES,
  STANDARD_ROLE_HIERARCHIES,
} from "../../../../../../shared/models/standard-role-template.model";
import {GroupRole} from "../../../../../../shared/models/group-role.model";

@Component({
  selector: "app-standard-role-selector",
  templateUrl: "./standard-role-selector.component.html",
  styleUrls: ["./standard-role-selector.component.scss"],
})
export class StandardRoleSelectorComponent implements OnInit, OnChanges {
  @Input() groupType?: string;
  @Input() existingRoles: GroupRole[] = [];
  @Output() roleSelected = new EventEmitter<StandardRoleTemplate>();
  @Output() customRoleRequested = new EventEmitter<{
    name: string;
    description?: string;
    category: StandardRoleCategory;
    parentRoleId?: string;
  }>();

  availableTemplates: StandardRoleTemplate[] = [];
  categorizedTemplates: {
    [key in StandardRoleCategory]?: StandardRoleTemplate[];
  } = {};
  selectedCategory?: StandardRoleCategory;

  /** IDs of roles that already exist so templates can be disabled */
  private existingRoleIds = new Set<string>();

  showCustomRoleForm = false;
  customRoleName = "";
  customRoleDescription = "";
  selectedParentRole?: GroupRole;

  ngOnInit() {
    this.loadAvailableTemplates();
    this.categorizeTemplates();
    this.syncExistingRoleIds();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["groupType"] && !changes["groupType"].firstChange) {
      this.loadAvailableTemplates();
      this.categorizeTemplates();
    }
    if (changes["existingRoles"]) {
      this.syncExistingRoleIds();
    }
  }

  private loadAvailableTemplates() {
    this.availableTemplates = STANDARD_ROLE_TEMPLATES.filter(
      (template: StandardRoleTemplate) => {
        // Filter by applicable group types
        if (template.applicableGroupTypes && this.groupType) {
          return template.applicableGroupTypes.includes(this.groupType);
        }
        return true;
      },
    );
  }

  private categorizeTemplates() {
    this.categorizedTemplates = {};
    this.availableTemplates.forEach((template) => {
      if (!this.categorizedTemplates[template.category]) {
        this.categorizedTemplates[template.category] = [];
      }
      this.categorizedTemplates[template.category]!.push(template);
    });
  }

  selectCategory(category: string) {
    const categoryEnum = category as StandardRoleCategory;
    this.selectedCategory =
      this.selectedCategory === categoryEnum ? undefined : categoryEnum;
  }

  selectTemplate(template: StandardRoleTemplate) {
    this.roleSelected.emit(template);
    // Mark template as used to disable further selection without reloading
    this.existingRoleIds.add(template.id);
  }

  toggleCustomRoleForm() {
    this.showCustomRoleForm = !this.showCustomRoleForm;
    if (!this.showCustomRoleForm) {
      this.resetCustomForm();
    }
  }

  private syncExistingRoleIds() {
    this.existingRoleIds = new Set(
      this.existingRoles
        .map((r) => r.standardRoleTemplateId)
        .filter((id): id is string => !!id),
    );
  }

  isTemplateUsed(template: StandardRoleTemplate): boolean {
    return this.existingRoleIds.has(template.id);
  }

  trackTemplate(index: number, template: StandardRoleTemplate) {
    return template.id;
  }

  createCustomRole() {
    if (this.customRoleName.trim() && this.selectedCategory) {
      this.customRoleRequested.emit({
        name: this.customRoleName.trim(),
        description: this.customRoleDescription.trim() || undefined,
        category: this.selectedCategory,
        parentRoleId: this.selectedParentRole?.id,
      });
      this.resetCustomForm();
    }
  }

  private resetCustomForm() {
    this.customRoleName = "";
    this.customRoleDescription = "";
    this.selectedParentRole = undefined;
    this.selectedCategory = undefined;
  }

  getCategoryIcon(category: string): string {
    const categoryEnum = category as StandardRoleCategory;
    const categoryIcons: {[key in StandardRoleCategory]: string} = {
      Organization: "business",
      Collaboration: "git-merge",
      Family: "home",
      Friends: "people",
      Volunteer: "hand-right",
      Professional: "briefcase",
      Community: "globe",
      Administrative: "shield-checkmark",
      Partnership: "link",
      Corporate: "storefront",
    };
    return categoryIcons[categoryEnum] || "ellipse";
  }

  getCategoryColor(category: string): string {
    const categoryEnum = category as StandardRoleCategory;
    const categoryColors: {[key in StandardRoleCategory]: string} = {
      Organization: "secondary",
      Collaboration: "tertiary",
      Family: "warning",
      Friends: "medium",
      Volunteer: "success",
      Professional: "dark",
      Community: "primary",
      Administrative: "medium",
      Partnership: "secondary",
      Corporate: "success",
    };
    return categoryColors[categoryEnum] || "medium";
  }

  getAvailableParentRoles(): GroupRole[] {
    if (!this.selectedCategory) {
      return []; // No parent roles if no category selected
    }

    return this.existingRoles.filter(
      (role) => role.standardCategory === this.selectedCategory,
    );
  }

  getTemplatesForCategory(
    category: StandardRoleCategory,
  ): StandardRoleTemplate[] {
    return this.categorizedTemplates[category] || [];
  }

  getCategoryDescription(category: StandardRoleCategory): string {
    const hierarchy = STANDARD_ROLE_HIERARCHIES.find(
      (h: any) => h.category === category,
    );
    return hierarchy?.description || "";
  }
}
