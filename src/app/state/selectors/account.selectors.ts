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
