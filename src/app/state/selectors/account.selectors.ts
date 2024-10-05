// src/app/state/selectors/account.selectors.ts

import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AccountState} from "../reducers/account.reducer";
import {Account} from "../../models/account.model";

export const selectAccountState =
  createFeatureSelector<AccountState>("account");

export const selectAccounts = createSelector(
  selectAccountState,
  (state) => state.accounts,
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
