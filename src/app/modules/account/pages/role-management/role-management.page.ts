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
// role-management.page.ts

import {Component, OnInit, Input} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {
  GroupRole,
  RoleType,
} from "../../../../../../shared/models/group-role.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectGroupRolesByGroupId,
  selectAccountLoading,
} from "../../../../state/selectors/account.selectors";
import {
  StandardRoleTemplate,
  StandardRoleCategory,
} from "../../../../../../shared/models/standard-role-template.model";
import {Account} from "../../../../../../shared/models/account.model";
import {selectAccountById} from "../../../../state/selectors/account.selectors";

interface CategorizedRoles {
  category: StandardRoleCategory | "Uncategorized";
  roles: GroupRole[];
  icon: string;
  color: string;
}

@Component({
  selector: "app-role-management",
  templateUrl: "./role-management.page.html",
  styleUrls: ["./role-management.page.scss"],
})
export class RoleManagementPage implements OnInit {
  @Input() embedded: boolean = false;
  groupId!: string;
  roles$!: Observable<GroupRole[]>;
  editableRoles$!: Observable<GroupRole[]>;
  categorizedRoles$!: Observable<CategorizedRoles[]>;
  loading$!: Observable<boolean>;
  account$!: Observable<Account | undefined>;

  // For account info to pass to standard role selector
  currentAccount?: Account;

  /** Tracks which role categories are collapsed on the page */
  private collapsedCategories = new Set<
    StandardRoleCategory | "Uncategorized"
  >();
  /** Keeps track of categories that have been initialized to avoid reset */
  private initializedCategories = new Set<
    StandardRoleCategory | "Uncategorized"
  >();
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private afs: AngularFirestore,
  ) {
    this.groupId = this.route.snapshot.paramMap.get("accountId") || "";
  }

  ngOnInit() {
    this.account$ = this.store.select(selectAccountById(this.groupId));
    this.roles$ = this.store.select(selectGroupRolesByGroupId(this.groupId));
    this.editableRoles$ = this.roles$.pipe(
      map((roles) => roles.map((role) => ({...role}))),
    );

    this.categorizedRoles$ = this.roles$.pipe(
      map((roles) => this.groupRolesByCategory(roles)),
      tap((groups) => {
        groups.forEach((g) => {
          if (!this.initializedCategories.has(g.category)) {
            this.collapsedCategories.add(g.category);
            this.initializedCategories.add(g.category);
          }
        });
      }),
    );

    this.loading$ = this.store.select(selectAccountLoading);
    this.store.dispatch(AccountActions.loadGroupRoles({groupId: this.groupId}));
  }

  /** Get current privacy value for a role category (defaults to public) */
  getCategoryPrivacy(
    account: Account | undefined,
    category: StandardRoleCategory | "Uncategorized",
  ): "public" | "private" {
    if (!account || category === "Uncategorized") return "public";
    const val =
      account.privacySettings?.roleCategories?.[
        category as StandardRoleCategory
      ];
    return (val as any) === "private" ? "private" : "public";
  }

  /** Update privacy for a given category */
  setCategoryPrivacy(
    account: Account | undefined,
    category: StandardRoleCategory | "Uncategorized",
    value: string | number | undefined,
  ) {
    if (!account || category === "Uncategorized") return;
    const str =
      value !== undefined && value !== null ? String(value) : undefined;
    const normalized: "public" | "private" =
      str === "private" ? "private" : "public";
    const updated: Account = {
      ...account,
      privacySettings: {
        ...account.privacySettings,
        roleCategories: {
          ...(account.privacySettings?.roleCategories || {}),
          [category as StandardRoleCategory]: normalized,
        },
      },
    } as Account;
    this.store.dispatch(AccountActions.updateAccount({account: updated}));
  }

  updateRole(role: GroupRole) {
    const updatedRole = {...role};
    this.store.dispatch(
      AccountActions.updateGroupRole({
        groupId: this.groupId,
        role: updatedRole,
      }),
    );
  }

  deleteRole(role: GroupRole) {
    this.store.dispatch(
      AccountActions.deleteGroupRole({
        groupId: this.groupId,
        roleId: role.id,
      }),
    );
  }

  getParentName(
    parentId: string | undefined,
    roles: GroupRole[],
  ): string | undefined {
    if (!parentId) return undefined;
    const parent = roles.find((r) => r.id === parentId);
    return parent?.name;
  }

  isDescendant(
    childId: string,
    ancestorId: string,
    roles: GroupRole[],
    visited: Set<string> = new Set(),
  ): boolean {
    if (visited.has(childId)) return false;
    visited.add(childId);
    const child = roles.find((r) => r.id === childId);
    if (!child || !child.parentRoleId) return false;
    if (child.parentRoleId === ancestorId) return true;
    return this.isDescendant(child.parentRoleId, ancestorId, roles, visited);
  }

  getRoleIcon(role: GroupRole): string {
    return role.roleType === "user" ? "people" : "business";
  }

  /**
   * Gets available parent roles for a given role, filtered by same category
   * @param currentRole The role to get parent options for
   * @param allRoles All available roles
   * @returns Filtered array of potential parent roles
   */
  getAvailableParentRoles(
    currentRole: GroupRole,
    allRoles: GroupRole[],
  ): GroupRole[] {
    return allRoles.filter((role) => {
      // Exclude the current role itself
      if (role.id === currentRole.id) return false;

      // Exclude if it would create a circular dependency
      if (this.isDescendant(role.id, currentRole.id, allRoles)) return false;

      // Only allow roles from the same category (if categories are defined)
      if (currentRole.standardCategory && role.standardCategory) {
        return role.standardCategory === currentRole.standardCategory;
      }

      // For roles without categories, allow any other role without category
      if (!currentRole.standardCategory && !role.standardCategory) {
        return true;
      }

      // Mixed category/no-category combinations not allowed
      return false;
    });
  }

  onStandardRoleSelected(template: StandardRoleTemplate) {
    const role: GroupRole = {
      id: this.afs.createId(),
      name: template.name,
      description: template.description,
      roleType: "organization", // Default to organization type
      permissions: template.defaultPermissions || [],
      standardRoleTemplateId: template.id,
      standardCategory: template.category,
      isStandardRole: true,
      isCustomRole: false,
      icon: template.icon,
      sortOrder: 0, // Default sort order
    };

    this.store.dispatch(
      AccountActions.createGroupRole({groupId: this.groupId, role}),
    );
  }

  onCustomRoleRequested(customRole: {
    name: string;
    description?: string;
    category: StandardRoleCategory;
    parentRoleId?: string;
  }) {
    const role: GroupRole = {
      id: this.afs.createId(),
      name: customRole.name,
      description: customRole.description,
      roleType: "organization",
      parentRoleId: customRole.parentRoleId,
      standardCategory: customRole.category,
      isStandardRole: false,
      isCustomRole: true,
      permissions: [],
    };

    this.store.dispatch(
      AccountActions.createGroupRole({groupId: this.groupId, role}),
    );
  }

  /** Toggles the collapsed state of a role category */
  toggleCategory(category: StandardRoleCategory | "Uncategorized") {
    if (this.collapsedCategories.has(category)) {
      this.collapsedCategories.delete(category);
    } else {
      this.collapsedCategories.add(category);
    }
  }

  /** Checks whether the provided category is currently collapsed */
  isCategoryCollapsed(category: StandardRoleCategory | "Uncategorized") {
    return this.collapsedCategories.has(category);
  }

  /** Track function for category ngFor to reduce DOM churn */
  trackCategory(index: number, group: CategorizedRoles) {
    return group.category;
  }

  /** Track function for role ngFor to reduce DOM churn */
  trackRole(index: number, role: GroupRole) {
    return role.id;
  }

  private groupRolesByCategory(roles: GroupRole[]): CategorizedRoles[] {
    const categoryIcons: {[key: string]: string} = {
      User: "person",
      Organization: "business",
      Collaboration: "git-merge",
      Volunteer: "hand-right",
      Family: "home",
      Friends: "people",
      Professional: "briefcase",
      Community: "globe",
      Partnership: "link",
      Corporate: "storefront",
      Leadership: "star",
      Uncategorized: "help",
    };

    const categoryColors: {[key: string]: string} = {
      User: "primary",
      Organization: "secondary",
      Collaboration: "tertiary",
      Volunteer: "success",
      Family: "warning",
      Friends: "medium",
      Professional: "dark",
      Community: "primary",
      Partnership: "secondary",
      Corporate: "success",
      Leadership: "danger",
      Uncategorized: "medium",
    };

    // Group roles by category
    const grouped = roles.reduce(
      (acc, role) => {
        const category = role.standardCategory || "Uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(role);
        return acc;
      },
      {} as {[key: string]: GroupRole[]},
    );

    // Convert to array and sort by category name
    return Object.keys(grouped)
      .sort()
      .map((category) => ({
        category: category as StandardRoleCategory | "Uncategorized",
        roles: grouped[category].sort((a, b) => a.name.localeCompare(b.name)),
        icon: categoryIcons[category] || "help",
        color: categoryColors[category] || "medium",
      }));
  }
}
