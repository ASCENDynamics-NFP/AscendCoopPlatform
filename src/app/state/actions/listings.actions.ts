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
import {Listing} from "@shared/models/listing.model";
import {ListingRelatedAccount} from "@shared/models/listing-related-account.model";

// Advanced filter interface for server-side search
export interface AdvancedFilters {
  location?: {latitude: number; longitude: number} | null;
  radiusKm?: number | null;
  skills?: string[];
  type?: string | null;
  remote?: boolean | null;
  hoursPerWeekMin?: number | null;
  hoursPerWeekMax?: number | null;
  limit?: number;
  startAfter?: string | null;
}

export const loadListings = createAction("[Listings Page] Load Listings");

export const clearListingsState = createAction("[Listings] Clear Listings");

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
  props<{listing: Listing | null}>(), // Accept Listing or null
);

export const loadListingByIdFailure = createAction(
  "[Listings API] Load Listing By Id Failure",
  props<{error: string}>(),
);

export const updateListing = createAction(
  "[Listings API] Update Listing",
  props<{listing: Listing}>(),
);

export const updateListingSuccess = createAction(
  "[Listings API] Update Listing Success",
  props<{listing: Listing}>(),
);

export const updateListingFailure = createAction(
  "[Listings API] Update Listing Failure",
  props<{error: string}>(),
);

export const createListing = createAction(
  "[Listings API] Create Listing",
  props<{listing: Listing}>(),
);

export const createListingSuccess = createAction(
  "[Listings API] Create Listing Success",
  props<{listing: Listing}>(),
);

export const createListingFailure = createAction(
  "[Listings API] Create Listing Failure",
  props<{error: string}>(),
);

export const deleteListing = createAction(
  "[Listings API] Delete Listing",
  props<{id: string}>(),
);

export const deleteListingSuccess = createAction(
  "[Listings API] Delete Listing Success",
  props<{id: string}>(),
);

export const deleteListingFailure = createAction(
  "[Listings API] Delete Listing Failure",
  props<{error: string}>(),
);

export const filterListings = createAction(
  "[Listings Page] Filter Listings",
  props<{listingType: string}>(),
);

export const searchListings = createAction(
  "[Listings Page] Search Listings",
  props<{query: string}>(),
);

// Application Submission Actions
export const submitApplication = createAction(
  "[Listings] Submit Application",
  props<{relatedAccount: ListingRelatedAccount}>(),
);

export const submitApplicationSuccess = createAction(
  "[Listings] Submit Application Success",
);

export const submitApplicationFailure = createAction(
  "[Listings] Submit Application Failure",
  props<{error: string}>(),
);

export const loadListingRelatedAccounts = createAction(
  "[Listing] Load Related Accounts",
  props<{listingId: string}>(),
);

export const loadListingRelatedAccountsSuccess = createAction(
  "[Listing] Load Related Accounts Success",
  props<{listingId: string; relatedAccounts: ListingRelatedAccount[]}>(),
);

export const loadListingRelatedAccountsFailure = createAction(
  "[Listing] Load Related Accounts Failure",
  props<{listingId: string; error: any}>(),
);

export const updateRelatedAccount = createAction(
  "[Listings] Update Related Account",
  props<{
    listingId: string;
    relatedAccount: ListingRelatedAccount;
  }>(),
);

export const updateRelatedAccountSuccess = createAction(
  "[Listings] Update Related Account Success",
  props<{listingId: string; relatedAccount: ListingRelatedAccount}>(),
);

export const updateRelatedAccountFailure = createAction(
  "[Listings] Update Related Account Failure",
  props<{error: string}>(),
);

// Save/Unsave Listing Actions
export const saveListing = createAction(
  "[Listings] Save Listing",
  props<{listingId: string; accountId: string}>(),
);

export const saveListingSuccess = createAction(
  "[Listings] Save Listing Success",
  props<{listingId: string; accountId: string}>(),
);

export const saveListingFailure = createAction(
  "[Listings] Save Listing Failure",
  props<{error: string}>(),
);

export const unsaveListing = createAction(
  "[Listings] Unsave Listing",
  props<{listingId: string; accountId: string}>(),
);

export const unsaveListingSuccess = createAction(
  "[Listings] Unsave Listing Success",
  props<{listingId: string; accountId: string}>(),
);

export const unsaveListingFailure = createAction(
  "[Listings] Unsave Listing Failure",
  props<{error: string}>(),
);

// Advanced Search Actions
export const advancedSearchListings = createAction(
  "[Listings Page] Advanced Search Listings",
  props<{filters: AdvancedFilters}>(),
);

export const advancedSearchListingsSuccess = createAction(
  "[Listings API] Advanced Search Listings Success",
  props<{listings: Listing[]; hasMore: boolean; nextCursor?: string}>(),
);

export const advancedSearchListingsFailure = createAction(
  "[Listings API] Advanced Search Listings Failure",
  props<{error: string}>(),
);

export const updateAdvancedFilters = createAction(
  "[Listings Page] Update Advanced Filters",
  props<{filters: AdvancedFilters}>(),
);

export const clearAdvancedFilters = createAction(
  "[Listings Page] Clear Advanced Filters",
);

export const loadMoreListings = createAction(
  "[Listings Page] Load More Listings",
);
