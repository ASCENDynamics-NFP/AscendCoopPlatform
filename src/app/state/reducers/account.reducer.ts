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
import {Account, RelatedAccount} from "@shared/models/account.model";
import {RelatedListing} from "@shared/models/related-listing.model";

export interface AccountState {
  entities: {[id: string]: Account};
  relatedAccounts: {[accountId: string]: RelatedAccount[]};
  relatedListings: {[accountId: string]: RelatedListing[]};
  selectedAccountId: string | null;
  loading: boolean;
  error: any;

  // Timestamps for cache invalidation
  accountsLastUpdated: number | null;
  relatedAccountsLastUpdated: {[accountId: string]: number | null};
  relatedListingsLastUpdated: {[accountId: string]: number | null};
}

export const initialState: AccountState = {
  entities: {},
  relatedAccounts: {},
  relatedListings: {},
  selectedAccountId: null,
  loading: false,
  error: null,
  // Timestamps for cache invalidation
  accountsLastUpdated: null,
  relatedAccountsLastUpdated: {},
  relatedListingsLastUpdated: {},
};

export const accountReducer = createReducer(
  initialState,

  // Clear Account State
  on(AccountActions.clearAccountsState, () => ({
    ...initialState,
  })),

  // Load Accounts
  on(AccountActions.loadAccounts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountActions.loadAccountsSuccess, (state, {accounts}) => ({
    ...state,
    entities: accounts.reduce(
      (entities: {[id: string]: Account}, account) => ({
        ...entities,
        [account.id]: account,
      }),
      {},
    ),
    loading: false,
    accountsLastUpdated: Date.now(),
  })),
  on(AccountActions.loadAccountsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Account
  on(AccountActions.loadAccount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountActions.loadAccountSuccess, (state, {account}) => ({
    ...state,
    entities: {
      ...state.entities,
      [account.id]: account,
    },
    selectedAccountId: account.id,
    loading: false,
    error: null,
  })),
  on(AccountActions.loadAccountFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Account
  on(AccountActions.createAccountSuccess, (state, {account}) => ({
    ...state,
    entities: {
      ...state.entities,
      [account.id]: account,
    },
  })),

  // Update Account
  on(AccountActions.updateAccountSuccess, (state, {account}) => ({
    ...state,
    entities: {
      ...state.entities,
      [account.id]: account,
    },
  })),

  // Delete Account
  on(AccountActions.deleteAccountSuccess, (state, {accountId}) => {
    const {[accountId]: removedAccount, ...entities} = state.entities;
    const {[accountId]: removedRelatedAccounts, ...relatedAccounts} =
      state.relatedAccounts;
    const {[accountId]: removedRelatedListings, ...relatedListings} =
      state.relatedListings;

    return {
      ...state,
      entities,
      relatedAccounts,
      relatedListings,
    };
  }),

  // Set Selected Account
  on(AccountActions.setSelectedAccount, (state, {accountId}) => ({
    ...state,
    selectedAccountId: accountId,
  })),

  // Load Related Accounts
  on(AccountActions.loadRelatedAccounts, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    AccountActions.loadRelatedAccountsSuccess,
    (state, {accountId, relatedAccounts}) => ({
      ...state,
      relatedAccounts: {
        ...state.relatedAccounts,
        [accountId]: relatedAccounts,
      },
      relatedAccountsLastUpdated: {
        ...state.relatedAccountsLastUpdated,
        [accountId]: Date.now(),
      },
      loading: false,
    }),
  ),
  on(AccountActions.loadRelatedAccountsFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create Related Account
  on(
    AccountActions.createRelatedAccountSuccess,
    (state, {accountId, relatedAccount}) => ({
      ...state,
      relatedAccounts: {
        ...state.relatedAccounts,
        [accountId]: [
          ...(state.relatedAccounts[accountId] || []),
          relatedAccount,
        ],
      },
    }),
  ),

  // Update Related Account
  on(
    AccountActions.updateRelatedAccountSuccess,
    (state, {accountId, relatedAccount}) => ({
      ...state,
      relatedAccounts: {
        ...state.relatedAccounts,
        [accountId]: state.relatedAccounts[accountId].map((ra) =>
          ra.id === relatedAccount.id ? relatedAccount : ra,
        ),
      },
    }),
  ),

  // Delete Related Account
  on(
    AccountActions.deleteRelatedAccountSuccess,
    (state, {accountId, relatedAccountId}) => ({
      ...state,
      relatedAccounts: {
        ...state.relatedAccounts,
        [accountId]: state.relatedAccounts[accountId].filter(
          (ra) => ra.id !== relatedAccountId,
        ),
      },
    }),
  ),

  // Load Related Listings
  on(AccountActions.loadRelatedListings, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    AccountActions.loadRelatedListingsSuccess,
    (state, {accountId, relatedListings}) => ({
      ...state,
      relatedListings: {
        ...state.relatedListings,
        [accountId]: relatedListings,
      },
      relatedListingsLastUpdated: {
        ...state.relatedListingsLastUpdated,
        [accountId]: Date.now(),
      },
      loading: false,
    }),
  ),
  on(AccountActions.loadRelatedListingsFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),
);
