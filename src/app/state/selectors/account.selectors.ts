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
import {Account, RelatedAccount} from "../../models/account.model";

export const selectAccountState =
  createFeatureSelector<AccountState>("account");

export const selectAccounts = createSelector(
  selectAccountState,
  (state) => state.accounts,
);

// Selector to get all related accounts from the state
// export const selectAllRelatedAccounts = (state: AppState) =>
//   state.accounts.relatedAccounts;

// Selector to get related accounts by accountId (initiatorId or targetId matches accountId)
export const selectRelatedAccountsByAccountId = (accountId: string) =>
  createSelector(
    selectRelatedAccounts,
    (relatedAccounts: Partial<RelatedAccount>[]) =>
      relatedAccounts.filter(
        (ra) => ra.initiatorId === accountId || ra.targetId === accountId,
      ),
  );

export const selectAccountById = (accountId: string) =>
  createSelector(selectAccounts, (accounts: Account[]): Account | undefined =>
    accounts.find((account) => account.id === accountId),
  );

export const selectSelectedAccount = createSelector(
  selectAccountState,
  (state) => state.selectedAccount,
);

export const selectRelatedAccounts = createSelector(
  selectAccountState,
  (state) => state.relatedAccounts,
);

export const selectAccountLoading = createSelector(
  selectAccountState,
  (state) => state.loading,
);

export const selectAccountError = createSelector(
  selectAccountState,
  (state) => state.error,
);

// Select Filtered Accounts
export const selectFilteredAccounts = (
  searchTerm: string,
  accountType: string,
) =>
  createSelector(selectAccounts, (accounts: Account[]) => {
    const normalizeString = (str: string) =>
      str
        .toLowerCase()
        .replace(/\s+/g, "") // Remove all whitespace
        .replace(/[^a-z0-9]/gi, ""); // Remove non-alphanumeric characters

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
