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
  /** Basic owner check */
  isOwner(
    account: Account | undefined,
    authUser: AuthUser | null | undefined,
  ): boolean {
    return !!account && !!authUser && authUser.uid === account.id;
  }

  /** Admin/moderator check using denormalized fields on the account document (groups) */
  private isAdminByAccountFields(
    account: Account | undefined,
    authUser: AuthUser | null | undefined,
  ): boolean {
    if (!account || !authUser || account.type !== "group") return false;
    const anyAccount: any = account as any;
    const inAdmins =
      Array.isArray(anyAccount.adminIds) &&
      anyAccount.adminIds.includes(authUser.uid);
    const inModerators =
      Array.isArray(anyAccount.moderatorIds) &&
      anyAccount.moderatorIds.includes(authUser.uid);
    return inAdmins || inModerators;
  }

  /** True if user is owner or admin/moderator of the group */
  isGroupAdmin(
    account: Account | undefined,
    authUser: AuthUser | null | undefined,
  ): boolean {
    if (this.isOwner(account, authUser)) return true;
    return this.isAdminByAccountFields(account, authUser);
  }

  /** Alias: can manage roles if owner or admin */
  canManageRoles(
    account: Account | undefined,
    authUser: AuthUser | null | undefined,
  ): boolean {
    return this.isGroupAdmin(account, authUser);
  }
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
    if (this.isOwner(account, authUser)) return true;
    return this.isAdminByAccountFields(account, authUser);
  }

  /** True when the given userId appears as an accepted related account */
  isAcceptedMember(
    relatedAccounts: Array<{id?: string; status?: string}> | undefined,
    userId: string | undefined | null,
  ): boolean {
    if (!relatedAccounts || !userId) return false;
    const rel = relatedAccounts.find((ra) => ra.id === userId);
    return rel?.status === "accepted";
  }

  /** Generic creator check for entities that expose createdBy */
  isCreator(
    entity: {createdBy?: string} | undefined,
    authUser: AuthUser | null | undefined,
  ): boolean {
    return (
      !!entity?.createdBy &&
      !!authUser?.uid &&
      entity.createdBy === authUser.uid
    );
  }

  /**
   * Listing owner/admin convenience.
   * Returns true if the user is the creator of the listing OR an admin/moderator
   * of the creator account (when provided).
   */
  isListingOwner(
    listing:
      | {createdBy?: string; ownerAccountId?: string; ownerAccountType?: string}
      | undefined,
    authUser: AuthUser | null | undefined,
    ownerAccount?: Account | undefined,
    creatorAccount?: Account | undefined,
  ): boolean {
    if (!listing) return false;
    // Prefer explicit owner when present (no fallback per decision)
    if (listing.ownerAccountId) {
      if (authUser?.uid && listing.ownerAccountId === authUser.uid) return true;
      if (ownerAccount) return this.isOwnerOrAdmin(ownerAccount, authUser);
      return false;
    }
    return false;
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
