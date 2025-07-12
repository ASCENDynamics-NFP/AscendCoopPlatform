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
// src/app/state/listings/listings.selectors.ts

import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ListingsState, listingsAdapter} from "../reducers/listings.reducer";
import {Listing} from "../../models/listing.model";

// TTL in milliseconds (e.g., 5 minutes)
const LISTINGS_TTL = 5 * 60 * 1000; // 5 minutes

// Utility: Check if data is stale
function isStale(lastUpdated: number | null, ttl: number): boolean {
  if (!lastUpdated) return true; // If never updated, consider it stale
  const now = Date.now();
  return now - lastUpdated > ttl;
}

// Feature Selector
export const selectListingsState =
  createFeatureSelector<ListingsState>("listings");

// Selectors for related accounts
export const selectRelatedAccountsByListingId = (listingId: string) =>
  createSelector(
    selectListingsState,
    (state: ListingsState) => state.relatedAccounts[listingId] || [],
  );

// Select all listings
const {
  selectAll: selectAllListingsArray,
  selectEntities: selectListingEntities,
} = listingsAdapter.getSelectors();

export const selectAllListings = createSelector(
  selectListingsState,
  selectAllListingsArray,
);

// Select a specific listing by ID
export const selectListingById = (listingId: string) =>
  createSelector(
    selectListingsState,
    (state): Listing | undefined => selectListingEntities(state)[listingId],
  );

// Select the currently selected listing
export const selectSelectedListing = createSelector(
  selectListingsState,
  (state) =>
    state.selectedListingId
      ? (selectListingEntities(state)[state.selectedListingId] as
          | Listing
          | undefined)
      : undefined,
);

// Select loading state
export const selectLoading = createSelector(
  selectListingsState,
  (state: ListingsState) => state.loading,
);

// Select error state
export const selectError = createSelector(
  selectListingsState,
  (state: ListingsState) => state.error,
);

// Select filter type
export const selectFilterType = createSelector(
  selectListingsState,
  (state: ListingsState) => state.filterType,
);

// Select search query
export const selectSearchQuery = createSelector(
  selectListingsState,
  (state: ListingsState) => state.searchQuery,
);

// Select filtered listings
export const selectFilteredListings = createSelector(
  selectAllListings,
  selectFilterType,
  selectSearchQuery,
  (listings, filterType, searchQuery) => {
    let filteredListings = listings;

    if (filterType && filterType !== "all") {
      filteredListings = filteredListings.filter(
        (listing) => listing.type === filterType,
      );
    }

    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      filteredListings = filteredListings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(queryLower) ||
          listing.description.toLowerCase().includes(queryLower),
      );
    }

    return filteredListings;
  },
);

// Cache and Freshness Selectors
export const selectListingsLastUpdated = createSelector(
  selectListingsState,
  (state: ListingsState) => state.listingsLastUpdated,
);

export const selectRelatedAccountsLastUpdated = (listingId: string) =>
  createSelector(
    selectListingsState,
    (state: ListingsState) =>
      state.relatedAccountsLastUpdated[listingId] || null,
  );

// Determine if listings are fresh
export const selectAreListingsFresh = createSelector(
  selectListingsLastUpdated,
  (listingsLastUpdated) => !isStale(listingsLastUpdated, LISTINGS_TTL),
);

// Determine if related accounts for a listing are fresh
export const selectAreRelatedAccountsFresh = (listingId: string) =>
  createSelector(
    selectRelatedAccountsLastUpdated(listingId),
    (relatedAccountsLastUpdated) =>
      !isStale(relatedAccountsLastUpdated, LISTINGS_TTL),
  );
