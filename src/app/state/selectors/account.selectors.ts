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
// src/app/state/selectors/account.selectors.ts

import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AccountState, accountAdapter} from "../reducers/account.reducer";
import {Account} from "@shared/models/account.model";

// TTL Configuration
const ACCOUNTS_TTL = 5 * 60 * 1000; // 5 minutes
const RELATED_LISTINGS_TTL = 10 * 60 * 1000; // 10 minutes

// Utility: Check if data is stale
function isStale(lastUpdated: number | null, ttl: number): boolean {
  if (!lastUpdated) return true; // If never updated, consider it stale
  const now = Date.now();
  return now - lastUpdated > ttl;
}

// Feature Selector
export const selectAccountState =
  createFeatureSelector<AccountState>("accounts");

// Entity Selectors
const {
  selectAll: selectAllAccountsArray,
  selectEntities: selectAccountEntityMap,
} = accountAdapter.getSelectors();

export const selectAccountEntities = createSelector(
  selectAccountState,
  selectAccountEntityMap,
);

export const selectAllAccounts = createSelector(
  selectAccountState,
  selectAllAccountsArray,
);

export const selectAccountById = (accountId?: string | null) =>
  createSelector(selectAccountEntities, (entities): Account | undefined => {
    if (!accountId) return undefined;
    const map = (entities || {}) as Record<string, Account | undefined>;
    return map[accountId];
  });

// Selected Account Selectors
export const selectSelectedAccountId = createSelector(
  selectAccountState,
  (state) => state?.selectedAccountId ?? null,
);

export const selectSelectedAccount = createSelector(
  selectAccountEntities,
  selectSelectedAccountId,
  (entities, selectedAccountId) =>
    selectedAccountId ? (entities || ({} as any))[selectedAccountId] : null,
);

// Related Data Selectors
export const selectRelatedAccountsByAccountId = (accountId: string) =>
  createSelector(
    selectAccountState,
    (state) => state?.relatedAccounts?.[accountId] || [],
  );

export const selectRelatedListingsByAccountId = (accountId: string) =>
  createSelector(
    selectAccountState,
    (state) => state?.relatedListings?.[accountId] || [],
  );

// Loading and Error Selectors
export const selectAccountLoading = createSelector(
  selectAccountState,
  (state) => !!state?.loading,
);

export const selectAccountError = createSelector(
  selectAccountState,
  (state) => state?.error ?? null,
);

// Filtered Accounts Selector with Privacy Support
export const selectFilteredAccounts = (
  searchTerm: string,
  accountType: string,
) =>
  createSelector(selectAllAccounts, (accounts: Account[]) => {
    const normalizeString = (str: string) =>
      str
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/gi, "");

    const normalizedSearchTerm = normalizeString(searchTerm);

    return accounts
      .filter((acc) => {
        // Must have a name
        if (!acc.name) {
          return false;
        }

        // Type filtering - handle 'all' type and null/empty types
        if (accountType !== "all") {
          const accType = acc.type || "";
          if (accType !== accountType) {
            return false;
          }
        }

        // Filter out explicitly inactive accounts (but allow undefined status)
        if (acc.status === "inactive") {
          return false;
        }

        // Privacy filtering - be more lenient with undefined privacy settings
        const visibility = (acc.privacySettings as any)?.profile?.visibility;
        // Only filter out accounts explicitly marked as private
        if (visibility === "private") {
          return false;
        }
        // Allow undefined, null, or "public" visibility

        const normalizedAccountName = normalizeString(acc.name);
        return normalizedAccountName.includes(normalizedSearchTerm);
      })
      .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0));
  });

// Privacy-aware filtered accounts selector that considers user membership
export const selectFilteredAccountsWithPrivacy = (
  searchTerm: string,
  accountType: string,
  userId: string | null,
) =>
  createSelector(
    selectAllAccounts,
    selectAccountState,
    (accounts: Account[], state) => {
      const normalizeString = (str: string) =>
        str
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/gi, "");

      const normalizedSearchTerm = normalizeString(searchTerm);
      const userRelatedAccounts = userId
        ? state?.relatedAccounts?.[userId] || []
        : [];

      return accounts
        .filter((acc) => {
          // Must have a name
          if (!acc.name) {
            return false;
          }

          // Type filtering - handle 'all' type and null/empty types
          if (accountType !== "all") {
            const accType = acc.type || "";
            if (accType !== accountType) {
              return false;
            }
          }

          // Filter out explicitly inactive accounts (but allow undefined status)
          if (acc.status === "inactive") {
            return false;
          }

          // Privacy filtering logic based solely on privacySettings.profile.visibility
          const visibility = (acc.privacySettings as any)?.profile?.visibility;
          // Only filter out accounts explicitly marked as private
          if (visibility === "private") {
            // Private groups are only visible to members
            if (!userId) return false;
            const isMember = userRelatedAccounts.some(
              (ra) => ra.id === acc.id && ra.status === "accepted",
            );
            if (!isMember) return false;
          }
          // Allow undefined, null, or "public" visibility

          const normalizedAccountName = normalizeString(acc.name);
          return normalizedAccountName.includes(normalizedSearchTerm);
        })
        .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0));
    },
  );

// Cache and Freshness Selectors
export const selectAccountsLastUpdated = createSelector(
  selectAccountState,
  (state) => state?.accountsLastUpdated ?? null,
);

export const selectRelatedAccountsLastUpdated = (accountId: string) =>
  createSelector(
    selectAccountState,
    (state) => state?.relatedAccountsLastUpdated?.[accountId] || null,
  );

export const selectRelatedListingsLastUpdated = (accountId: string) =>
  createSelector(
    selectAccountState,
    (state) => state?.relatedListingsLastUpdated?.[accountId] || null,
  );

export const selectGroupRolesByGroupId = (groupId: string) =>
  createSelector(
    selectAccountState,
    (state) => state?.groupRoles?.[groupId] || [],
  );

export const selectGroupRolesLastUpdated = (groupId: string) =>
  createSelector(
    selectAccountState,
    (state) => state?.groupRolesLastUpdated?.[groupId] || null,
  );

export const selectAreAccountsFresh = createSelector(
  selectAccountsLastUpdated,
  (accountsLastUpdated) => !isStale(accountsLastUpdated, ACCOUNTS_TTL),
);

export const selectAreRelatedAccountsFresh = (accountId: string) =>
  createSelector(
    selectRelatedAccountsLastUpdated(accountId),
    (relatedAccountsLastUpdated) =>
      !isStale(relatedAccountsLastUpdated, ACCOUNTS_TTL),
  );

export const selectAreRelatedListingsFresh = (accountId: string) =>
  createSelector(
    selectRelatedListingsLastUpdated(accountId),
    (relatedListingsLastUpdated) =>
      !isStale(relatedListingsLastUpdated, RELATED_LISTINGS_TTL),
  );

export const selectAreGroupRolesFresh = (groupId: string) =>
  createSelector(
    selectGroupRolesLastUpdated(groupId),
    (groupRolesLastUpdated) => !isStale(groupRolesLastUpdated, ACCOUNTS_TTL),
  );

// User Skills Selector (for skill matching with listings)
export const selectUserSkills = createSelector(
  selectSelectedAccount,
  (account): string[] => {
    if (!account || account.type !== "user") return [];
    return account.professionalInformation?.skillsAndExpertise || [];
  },
);
