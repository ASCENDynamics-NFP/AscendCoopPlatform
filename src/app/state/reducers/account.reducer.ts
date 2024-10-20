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
// src/app/state/reducers/account.reducer.ts

import {createReducer, on} from "@ngrx/store";
import * as AccountActions from "../actions/account.actions";
import {Account, RelatedAccount} from "../../models/account.model";

export interface AccountState {
  accounts: Account[];
  relatedAccounts: RelatedAccount[];
  selectedAccount: Account | null;
  loading: boolean;
  error: any;
}

export const initialState: AccountState = {
  accounts: [],
  relatedAccounts: [],
  selectedAccount: null,
  loading: false,
  error: null,
};

export const accountReducer = createReducer(
  initialState,

  // Clear Account State
  on(AccountActions.clearAccounts, () => ({
    ...initialState,
  })),

  // Load Account
  on(AccountActions.loadAccount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountActions.loadAccountSuccess, (state, {account}) => {
    return {
      ...state,
      accounts: [
        ...state.accounts.filter((acc) => acc.id !== account.id),
        account,
      ],
      selectedAccount: account,
      loading: false,
      error: null,
    };
  }),
  on(AccountActions.loadAccountFailure, (state, {error}) => {
    return {
      ...state,
      loading: false,
      error,
    };
  }),

  // Create Account
  on(AccountActions.createAccountSuccess, (state, {account}) => ({
    ...state,
    accounts: [...state.accounts, account],
  })),

  // Update Account
  on(AccountActions.updateAccountSuccess, (state, {account}) => ({
    ...state,
    accounts: state.accounts.map((a) => (a.id === account.id ? account : a)),
    selectedAccount:
      account.id === state.selectedAccount?.id
        ? account
        : state.selectedAccount,
  })),

  // Delete Account
  on(AccountActions.deleteAccountSuccess, (state, {accountId}) => ({
    ...state,
    accounts: state.accounts.filter((a) => a.id !== accountId),
  })),

  // Load Accounts
  on(AccountActions.loadAccounts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountActions.loadAccountsSuccess, (state, {accounts}) => ({
    ...state,
    accounts,
    filteredAccounts: accounts, // Initially, no filter applied
    loading: false,
  })),
  on(AccountActions.loadAccountsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Search Accounts
  on(AccountActions.searchAccounts, (state) => ({
    ...state,
    loading: true,
  })),
  on(AccountActions.searchAccountsSuccess, (state, {accounts}) => ({
    ...state,
    accounts: accounts,
    loading: false,
  })),
  on(AccountActions.searchAccountsFailure, (state, {error}) => ({
    ...state,
    error: error,
    loading: false,
  })),

  // Set Selected Account
  on(AccountActions.setSelectedAccount, (state, {accountId}) => ({
    ...state,
    selectedAccount: state.accounts.find((acc) => acc.id === accountId) || null,
  })),

  // Load Related Accounts
  on(AccountActions.loadRelatedAccounts, (state) => ({
    ...state,
    loading: true,
  })),
  on(AccountActions.loadRelatedAccountsSuccess, (state, {relatedAccounts}) => ({
    ...state,
    relatedAccounts: relatedAccounts,
    loading: false,
  })),
  on(AccountActions.loadRelatedAccountsFailure, (state, {error}) => ({
    ...state,
    error: error,
    loading: false,
  })),

  // Handle createRelatedAccountSuccess to add the new related account to the state
  on(AccountActions.createRelatedAccountSuccess, (state, {relatedAccount}) => {
    const updatedAccounts = state.accounts.map((account) => {
      if (account.id === relatedAccount.initiatorId) {
        return {
          ...account,
          relatedAccounts: [...(account.relatedAccounts || []), relatedAccount],
        };
      }
      return account;
    });

    return {
      ...state,
      accounts: updatedAccounts,
    };
  }),

  // Delete Related Account Success
  on(
    AccountActions.deleteRelatedAccountSuccess,
    (state, {accountId, relatedAccountId}) => ({
      ...state,
      accounts: state.accounts.map((account) => {
        if (account.id === accountId) {
          return {
            ...account,
            relatedAccounts: (account.relatedAccounts || []).filter(
              (ra) => ra.id !== relatedAccountId,
            ),
          };
        }
        return account;
      }),
    }),
  ),

  // Update Related Account Success
  on(AccountActions.updateRelatedAccountSuccess, (state, {relatedAccount}) => {
    const updatedAccounts = state.accounts.map((account) => {
      if (account.id === relatedAccount.initiatorId) {
        const relatedAccounts = account.relatedAccounts || [];

        const exists = relatedAccounts.some(
          (ra) => ra.id === relatedAccount.id,
        );

        const updatedRelatedAccounts = exists
          ? relatedAccounts.map((ra) =>
              ra.id === relatedAccount.id ? {...relatedAccount} : ra,
            )
          : [...relatedAccounts, relatedAccount];

        return {
          ...account,
          relatedAccounts: updatedRelatedAccounts,
        };
      }
      return account;
    });

    return {
      ...state,
      accounts: updatedAccounts,
    };
  }),
);
