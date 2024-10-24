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
import {ListingsState} from "../reducers/listings.reducer";

export const selectListingsState =
  createFeatureSelector<ListingsState>("listings");

export const selectAllListings = createSelector(
  selectListingsState,
  (state: ListingsState) => state.listings,
);

export const selectListingById = (listingId: string) =>
  createSelector(selectListingsState, (state: ListingsState) =>
    state.listings.find((listing) => listing.id === listingId),
  );

export const selectLoading = createSelector(
  selectListingsState,
  (state: ListingsState) => state.loading,
);

export const selectError = createSelector(
  selectListingsState,
  (state: ListingsState) => state.error,
);
