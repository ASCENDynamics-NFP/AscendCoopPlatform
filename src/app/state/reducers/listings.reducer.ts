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
import * as ListingsActions from "../actions/listings.actions";
import {Listing} from "../../models/listing.model";

export interface ListingsState {
  entities: {[id: string]: Listing}; // Dictionary of listings by ID
  selectedListingId: string | null; // Currently selected listing
  loading: boolean; // Indicates if a request is in progress
  error: string | null; // Stores any errors
  filterType: string; // Type of listing to filter (e.g., 'all', 'active')
  searchQuery: string; // Search query for filtering listings
}

const initialState: ListingsState = {
  entities: {},
  selectedListingId: null,
  loading: false,
  error: null,
  filterType: "all",
  searchQuery: "",
};

export const listingsReducer = createReducer(
  initialState,

  // Loading listings
  on(ListingsActions.loadListings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ListingsActions.loadListingsSuccess, (state, {listings}) => ({
    ...state,
    entities: listings.reduce((entities, listing) => {
      return {...entities, [listing.id]: listing}; // Add listings to the dictionary
    }, {}),
    loading: false,
  })),
  on(ListingsActions.loadListingsFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Loading a single listing by ID
  on(ListingsActions.loadListingByIdSuccess, (state, {listing}) => {
    if (listing) {
      return {
        ...state,
        entities: {
          ...state.entities,
          [listing.id]: listing,
        },
        selectedListingId: listing.id,
        loading: false,
      };
    } else {
      return {
        ...state,
        selectedListingId: null,
        loading: false,
      };
    }
  }),
  on(ListingsActions.loadListingByIdFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Creating a listing
  on(ListingsActions.createListingSuccess, (state, {listing}) => ({
    ...state,
    entities: {
      ...state.entities,
      [listing.id]: listing,
    },
    selectedListingId: listing.id,
    loading: false,
  })),
  on(ListingsActions.createListingFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Updating a listing
  on(ListingsActions.updateListingSuccess, (state, {listing}) => ({
    ...state,
    entities: {
      ...state.entities,
      [listing.id]: listing,
    },
    selectedListingId: listing.id,
    loading: false,
  })),
  on(ListingsActions.updateListingFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Deleting a listing
  on(ListingsActions.deleteListingSuccess, (state, {id}) => {
    const {[id]: removed, ...entities} = state.entities; // Remove deleted listing
    const selectedListingId =
      state.selectedListingId === id ? null : state.selectedListingId; // Deselect if deleted
    return {
      ...state,
      entities,
      selectedListingId,
    };
  }),

  // Filtering listings
  on(ListingsActions.filterListings, (state, {listingType}) => ({
    ...state,
    filterType: listingType,
  })),

  // Searching listings
  on(ListingsActions.searchListings, (state, {query}) => ({
    ...state,
    searchQuery: query,
  })),

  // Applying to a listing
  on(ListingsActions.applyToListing, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ListingsActions.applyToListingSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(ListingsActions.applyToListingFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
);
