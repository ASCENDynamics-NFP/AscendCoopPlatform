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
// src/app/state/listings/listings.actions.ts
import {createAction, props} from "@ngrx/store";
import {Listing} from "../../models/listing.model";

export const loadListings = createAction("[Listings Page] Load Listings");
export const loadListingsSuccess = createAction(
  "[Listings API] Load Listings Success",
  props<{listings: Listing[]}>(),
);
export const loadListingsFailure = createAction(
  "[Listings API] Load Listings Failure",
  props<{error: string}>(),
);

export const loadListingById = createAction(
  "[Listing Detail Page] Load Listing By Id",
  props<{id: string}>(),
);
export const loadListingByIdSuccess = createAction(
  "[Listings API] Load Listing By Id Success",
  props<{listing: Listing | null}>(), // Allowing the action to accept null listings
);

export const loadListingByIdFailure = createAction(
  "[Listings API] Load Listing By Id Failure",
  props<{error: string}>(),
);

export const updateListing = createAction(
  "[Listings API] Update",
  props<{listing: Listing}>(),
);

export const updateListingSuccess = createAction(
  "[Listings API] Update Success",
  props<{listing: Listing}>(),
);

export const updateListingFailure = createAction(
  "[Listings API] Update Failure",
  props<{error: string}>(),
);

export const createListing = createAction(
  "[Listings API] Create",
  props<{listing: Listing}>(),
);

export const createListingSuccess = createAction(
  "[Listings API] Create Success",
  props<{listing: Listing}>(),
);

export const createListingFailure = createAction(
  "[Listings API] Create Failure",
  props<{error: string}>(),
);

export const filterListings = createAction(
  "[Listings] Filter Listings",
  props<{listingType: string}>(),
);

export const searchListings = createAction(
  "[Listings] Search Listings",
  props<{query: string}>(),
);

export const deleteListing = createAction(
  "[Listings API] Delete",
  props<{id: string}>(),
);

export const deleteListingSuccess = createAction(
  "[Listings API] Delete Success",
  props<{id: string}>(),
);

export const deleteListingFailure = createAction(
  "[Listings API] Delete Failure",
  props<{error: string}>(),
);
