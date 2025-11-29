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
import {AdvancedFilters} from "../actions/listings.actions";
import {Listing} from "@shared/models/listing.model";
import {ListingRelatedAccount} from "@shared/models/listing-related-account.model";

export interface ListingsState extends EntityState<Listing> {
  relatedAccounts: {[listingId: string]: ListingRelatedAccount[]};
  selectedListingId: string | null; // Currently selected listing
  selectedApplicantIds: string[]; // Selected applicants for bulk actions
  loading: boolean; // Indicates if a request is in progress
  error: string | null; // Stores any errors
  filterType: string; // Type of listing to filter (e.g., 'all', 'active')
  searchQuery: string; // Search query for filtering listings

  // Advanced filtering state
  advancedFilters: AdvancedFilters;
  isAdvancedSearchActive: boolean;
  hasMoreResults: boolean;
  nextCursor: string | null;

  // Timestamps for cache invalidation
  listingsLastUpdated: number | null;
  relatedAccountsLastUpdated: {[listingId: string]: number | null};
}

export const listingsAdapter: EntityAdapter<Listing> =
  createEntityAdapter<Listing>({selectId: (listing) => listing.id});

const initialAdvancedFilters: AdvancedFilters = {
  location: null,
  radiusKm: null,
  skills: [],
  type: null,
  remote: null,
  hoursPerWeekMin: null,
  hoursPerWeekMax: null,
  limit: 20,
  startAfter: null,
};

const initialState: ListingsState = listingsAdapter.getInitialState({
  relatedAccounts: {},
  selectedListingId: null,
  selectedApplicantIds: [],
  loading: false,
  error: null,
  filterType: "all",
  searchQuery: "",
  // Advanced filtering state
  advancedFilters: initialAdvancedFilters,
  isAdvancedSearchActive: false,
  hasMoreResults: false,
  nextCursor: null,
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

  // Advanced Search Actions
  on(ListingsActions.advancedSearchListings, (state, {filters}) => ({
    ...state,
    loading: true,
    error: null,
    advancedFilters: {...state.advancedFilters, ...filters},
    isAdvancedSearchActive: true,
  })),

  on(
    ListingsActions.advancedSearchListingsSuccess,
    (state, {listings, hasMore, nextCursor}) =>
      listingsAdapter.setAll(listings, {
        ...state,
        loading: false,
        hasMoreResults: hasMore,
        nextCursor: nextCursor || null,
        listingsLastUpdated: Date.now(),
      }),
  ),

  on(ListingsActions.advancedSearchListingsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ListingsActions.updateAdvancedFilters, (state, {filters}) => ({
    ...state,
    advancedFilters: {...state.advancedFilters, ...filters},
  })),

  on(ListingsActions.clearAdvancedFilters, (state) => ({
    ...state,
    advancedFilters: initialAdvancedFilters,
    isAdvancedSearchActive: false,
    hasMoreResults: false,
    nextCursor: null,
    // Invalidate cache to force fresh load
    listingsLastUpdated: null,
  })),

  on(ListingsActions.loadMoreListings, (state) => ({
    ...state,
    loading: true,
    advancedFilters: {
      ...state.advancedFilters,
      startAfter: state.nextCursor,
    },
  })),

  // Applicant Selection Actions for Bulk Operations
  on(ListingsActions.toggleApplicantSelection, (state, {applicantId}) => {
    const isSelected = state.selectedApplicantIds.includes(applicantId);
    return {
      ...state,
      selectedApplicantIds: isSelected
        ? state.selectedApplicantIds.filter((id) => id !== applicantId)
        : [...state.selectedApplicantIds, applicantId],
    };
  }),

  on(ListingsActions.selectAllApplicants, (state, {applicantIds}) => ({
    ...state,
    selectedApplicantIds: applicantIds,
  })),

  on(ListingsActions.clearApplicantSelection, (state) => ({
    ...state,
    selectedApplicantIds: [],
  })),

  on(ListingsActions.bulkUpdateStatusSuccess, (state) => ({
    ...state,
    selectedApplicantIds: [],
    loading: false,
  })),

  on(ListingsActions.bulkUpdateStatusFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
);
