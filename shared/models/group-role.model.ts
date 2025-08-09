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
// shared/models/group-role.model.ts

import {StandardRoleCategory} from "./standard-role-template.model";

export type RoleType = "user" | "organization";

export interface GroupRole {
  id: string;
  name: string;
  description?: string;
  parentRoleId?: string;
  permissions?: string[];
  roleType?: RoleType;

  // New fields for standardization
  /** Reference to standard role template this role is based on */
  standardRoleTemplateId?: string;
  /** Standard category this role belongs to for analytics */
  standardCategory?: StandardRoleCategory;
  /** Whether this is a system-provided standard role (cannot be deleted) */
  isStandardRole?: boolean;
  /** Custom role created under a standard category */
  isCustomRole?: boolean;
  /** Icon associated with this role */
  icon?: string;
  /** Color theme for this role */
  color?: string;
  /** Sort order within the same parent level */
  sortOrder?: number;
}
