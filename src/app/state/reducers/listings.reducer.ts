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
import * as ListingsActions from "./../actions/listings.actions";
import {Listing} from "../../models/listing.model";

export interface ListingsState {
  entities: {[id: string]: Listing};
  selectedListingId: string | null;
  loading: boolean;
  error: string | null;
  filterType: string;
  searchQuery: string;
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
  on(ListingsActions.loadListings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ListingsActions.loadListingsSuccess, (state, {listings}) => ({
    ...state,
    entities: listings.reduce((entities, listing) => {
      return {...entities, [listing.id]: listing};
    }, {}),
    loading: false,
  })),
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
  on(ListingsActions.createListingSuccess, (state, {listing}) => ({
    ...state,
    entities: {
      ...state.entities,
      [listing.id]: listing,
    },
    selectedListingId: listing.id,
    loading: false,
  })),
  on(ListingsActions.updateListingSuccess, (state, {listing}) => ({
    ...state,
    entities: {
      ...state.entities,
      [listing.id]: listing,
    },
    selectedListingId: listing.id,
    loading: false,
  })),
  on(
    ListingsActions.loadListingsFailure,
    ListingsActions.loadListingByIdFailure,
    ListingsActions.createListingFailure,
    ListingsActions.updateListingFailure,
    (state, {error}) => ({
      ...state,
      error,
      loading: false,
    }),
  ),
  on(ListingsActions.deleteListingSuccess, (state, {id}) => {
    const {[id]: removed, ...entities} = state.entities;
    const selectedListingId =
      state.selectedListingId === id ? null : state.selectedListingId;
    return {
      ...state,
      entities,
      selectedListingId,
    };
  }),
  on(ListingsActions.filterListings, (state, {listingType}) => ({
    ...state,
    filterType: listingType,
  })),
  on(ListingsActions.searchListings, (state, {query}) => ({
    ...state,
    searchQuery: query,
  })),
);
