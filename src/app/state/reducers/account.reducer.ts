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
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import * as AccountActions from "../actions/account.actions";
import {Account, RelatedAccount} from "../../models/account.model";
import {RelatedListing} from "../../models/related-listing.model";

export const accountAdapter: EntityAdapter<Account> =
  createEntityAdapter<Account>({selectId: (account) => account.id});

export interface AccountState extends EntityState<Account> {
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

export const initialState: AccountState = accountAdapter.getInitialState({
  relatedAccounts: {},
  relatedListings: {},
  selectedAccountId: null,
  loading: false,
  error: null,
  // Timestamps for cache invalidation
  accountsLastUpdated: null,
  relatedAccountsLastUpdated: {},
  relatedListingsLastUpdated: {},
});

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
  on(AccountActions.loadAccountsSuccess, (state, {accounts}) =>
    accountAdapter.setAll(accounts, {
      ...state,
      loading: false,
      accountsLastUpdated: Date.now(),
    }),
  ),
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
  on(AccountActions.loadAccountSuccess, (state, {account}) =>
    accountAdapter.upsertOne(account, {
      ...state,
      selectedAccountId: account.id,
      loading: false,
      error: null,
    }),
  ),
  on(AccountActions.loadAccountFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Account
  on(AccountActions.createAccountSuccess, (state, {account}) =>
    accountAdapter.addOne(account, state),
  ),

  // Update Account
  on(AccountActions.updateAccountSuccess, (state, {account}) =>
    accountAdapter.updateOne({id: account.id, changes: account}, state),
  ),

  // Delete Account
  on(AccountActions.deleteAccountSuccess, (state, {accountId}) => {
    const newState = accountAdapter.removeOne(accountId, state);
    const {[accountId]: _ra, ...relatedAccounts} = newState.relatedAccounts;
    const {[accountId]: _rl, ...relatedListings} = newState.relatedListings;

    return {
      ...newState,
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
