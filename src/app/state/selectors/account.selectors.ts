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
import {AccountState} from "../reducers/account.reducer";
import {Account} from "../../models/account.model";

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
export const selectAccountEntities = createSelector(
  selectAccountState,
  (state) => state.entities,
);

export const selectAllAccounts = createSelector(
  selectAccountEntities,
  (entities) => Object.values(entities),
);

export const selectAccountById = (accountId: string) =>
  createSelector(selectAccountEntities, (entities) => entities[accountId]);

// Selected Account Selectors
export const selectSelectedAccountId = createSelector(
  selectAccountState,
  (state) => state.selectedAccountId,
);

export const selectSelectedAccount = createSelector(
  selectAccountEntities,
  selectSelectedAccountId,
  (entities, selectedAccountId) =>
    selectedAccountId ? entities[selectedAccountId] : null,
);

// Related Data Selectors
export const selectRelatedAccountsByAccountId = (accountId: string) =>
  createSelector(
    selectAccountState,
    (state) => state.relatedAccounts[accountId] || [],
  );

export const selectRelatedListingsByAccountId = (accountId: string) =>
  createSelector(
    selectAccountState,
    (state) => state.relatedListings[accountId] || [],
  );

// Loading and Error Selectors
export const selectAccountLoading = createSelector(
  selectAccountState,
  (state) => state.loading,
);

export const selectAccountError = createSelector(
  selectAccountState,
  (state) => state.error,
);

// Filtered Accounts Selector
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
        if (acc.type !== accountType || !acc.name) {
          return false;
        }
        const normalizedAccountName = normalizeString(acc.name);
        return normalizedAccountName.includes(normalizedSearchTerm);
      })
      .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0));
  });

// Cache and Freshness Selectors
export const selectAccountsLastUpdated = createSelector(
  selectAccountState,
  (state) => state.accountsLastUpdated,
);

export const selectRelatedAccountsLastUpdated = (accountId: string) =>
  createSelector(
    selectAccountState,
    (state) => state.relatedAccountsLastUpdated[accountId] || null,
  );

export const selectRelatedListingsLastUpdated = (accountId: string) =>
  createSelector(
    selectAccountState,
    (state) => state.relatedListingsLastUpdated[accountId] || null,
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
