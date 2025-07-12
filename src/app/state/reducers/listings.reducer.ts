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
// src/app/state/listings/listings.reducer.ts

import {createReducer, on} from "@ngrx/store";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import * as ListingsActions from "../actions/listings.actions";
import {Listing} from "../../models/listing.model";
import {ListingRelatedAccount} from "../../models/listing-related-account.model";

export interface ListingsState extends EntityState<Listing> {
  relatedAccounts: {[listingId: string]: ListingRelatedAccount[]};
  selectedListingId: string | null; // Currently selected listing
  loading: boolean; // Indicates if a request is in progress
  error: string | null; // Stores any errors
  filterType: string; // Type of listing to filter (e.g., 'all', 'active')
  searchQuery: string; // Search query for filtering listings

  // Timestamps for cache invalidation
  listingsLastUpdated: number | null;
  relatedAccountsLastUpdated: {[listingId: string]: number | null};
}

export const listingsAdapter: EntityAdapter<Listing> =
  createEntityAdapter<Listing>({selectId: (listing) => listing.id});

const initialState: ListingsState = listingsAdapter.getInitialState({
  relatedAccounts: {},
  selectedListingId: null,
  loading: false,
  error: null,
  filterType: "all",
  searchQuery: "",
  // Timestamps for cache invalidation
  listingsLastUpdated: null,
  relatedAccountsLastUpdated: {},
});

export const listingsReducer = createReducer(
  initialState,

  // Clear Account State
  on(ListingsActions.clearListingsState, () => ({
    ...initialState,
  })),

  // Load Listings
  on(ListingsActions.loadListings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ListingsActions.loadListingsSuccess, (state, {listings}) =>
    listingsAdapter.setAll(listings, {
      ...state,
      listingsLastUpdated: Date.now(),
      loading: false,
    }),
  ),
  on(ListingsActions.loadListingsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Listing by ID
  on(ListingsActions.loadListingByIdSuccess, (state, {listing}) =>
    listing
      ? listingsAdapter.upsertOne(listing, {
          ...state,
          selectedListingId: listing.id,
          loading: false,
        })
      : {
          ...state,
          selectedListingId: null,
          loading: false,
        },
  ),
  on(ListingsActions.loadListingByIdFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create Listing
  on(ListingsActions.createListingSuccess, (state, {listing}) =>
    listingsAdapter.addOne(listing, {
      ...state,
      selectedListingId: listing.id,
      loading: false,
    }),
  ),
  on(ListingsActions.createListingFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Listing
  on(ListingsActions.updateListingSuccess, (state, {listing}) =>
    listingsAdapter.updateOne(
      {id: listing.id, changes: listing},
      {
        ...state,
        loading: false,
      },
    ),
  ),
  on(ListingsActions.updateListingFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Listing
  on(ListingsActions.deleteListingSuccess, (state, {id}) => {
    const newState = listingsAdapter.removeOne(id, state);
    const selectedListingId =
      newState.selectedListingId === id ? null : newState.selectedListingId;
    return {
      ...newState,
      selectedListingId,
    };
  }),

  // Delete Listing Failure
  on(ListingsActions.deleteListingFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Filtering Listings
  on(ListingsActions.filterListings, (state, {listingType}) => ({
    ...state,
    filterType: listingType,
  })),

  // Searching Listings
  on(ListingsActions.searchListings, (state, {query}) => ({
    ...state,
    searchQuery: query,
  })),

  // Submit Application
  on(ListingsActions.submitApplication, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ListingsActions.submitApplicationSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(ListingsActions.submitApplicationFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ListingsActions.loadListingRelatedAccounts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    ListingsActions.loadListingRelatedAccountsSuccess,
    (state, {listingId, relatedAccounts}) => ({
      ...state,
      relatedAccounts: {
        ...state.relatedAccounts,
        [listingId]: relatedAccounts,
      },
      loading: false,
    }),
  ),
  on(ListingsActions.loadListingRelatedAccountsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  on(
    ListingsActions.updateRelatedAccountSuccess,
    (state, {listingId, relatedAccount}) => {
      const updatedRelatedAccounts =
        state.relatedAccounts[listingId]?.map((account) =>
          account.id === relatedAccount.id ? relatedAccount : account,
        ) || [];

      return {
        ...state,
        relatedAccounts: {
          ...state.relatedAccounts,
          [listingId]: updatedRelatedAccounts,
        },
      };
    },
  ),
  on(ListingsActions.updateRelatedAccountFailure, (state, {error}) => {
    console.error("Failed to update related account:", error);
    return state;
  }),
);
