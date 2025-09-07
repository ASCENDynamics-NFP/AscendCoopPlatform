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
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 ***********************************************************************************************/
// src/app/core/services/access.service.ts

import {Injectable} from "@angular/core";
import {Account} from "../../../../shared/models/account.model";
import {AuthUser} from "@shared/models/auth-user.model";
import {StandardRoleCategory} from "../../../../shared/models/standard-role-template.model";

@Injectable({providedIn: "root"})
export class AccessService {
  /**
   * Minimal owner/admin check used for visibility decisions.
   * - Owner: authUser.uid === account.id
   * - Admin/Moderator: present in denormalized adminIds/moderatorIds arrays (for groups)
   */
  isOwnerOrAdmin(
    account: Account | undefined,
    authUser: AuthUser | null | undefined,
  ): boolean {
    if (!authUser) return false;
    if (!account) return false;

    // Owner of either user or group account
    if (authUser.uid === account.id) return true;

    // Group: check denormalized admin/moderator lists if present
    const anyAccount: any = account as any;
    const inAdmins = Array.isArray(anyAccount.adminIds)
      ? anyAccount.adminIds.includes(authUser.uid)
      : false;
    const inModerators = Array.isArray(anyAccount.moderatorIds)
      ? anyAccount.moderatorIds.includes(authUser.uid)
      : false;
    return inAdmins || inModerators;
  }

  /**
   * Determines if a role category should be visible to the viewer based on account privacy settings.
   * Defaults to public when no explicit setting exists.
   */
  isRoleCategoryVisible(
    account: Account | undefined,
    authUser: AuthUser | null | undefined,
    category: StandardRoleCategory | undefined,
  ): boolean {
    if (!category) return true; // Uncategorised roles remain visible

    const setting = account?.privacySettings?.roleCategories?.[category];
    if (!setting || setting === "public") return true;

    // Private: only owner/admin can view
    return this.isOwnerOrAdmin(account, authUser);
  }
}
