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
// src/app/state/listings/listings.effects.ts

import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, from, map, mergeMap, of, switchMap} from "rxjs";
import {FirestoreService} from "../../core/services/firestore.service";
import * as ListingsActions from "./../actions/listings.actions";
import {Listing} from "../../models/listing.model";
import {serverTimestamp} from "@angular/fire/firestore";

@Injectable()
export class ListingsEffects {
  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
  ) {}

  createListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.createListing),
      mergeMap(({listing}) => {
        const newListing = {
          ...listing,
          createdAt: serverTimestamp(), // Firestore server timestamp
          lastModifiedAt: serverTimestamp(),
        };
        return from(
          this.firestoreService.addDocument("listings", newListing),
        ).pipe(
          map((docId) =>
            ListingsActions.createListingSuccess({
              listing: {...newListing, id: docId},
            }),
          ),
          catchError((error) =>
            of(ListingsActions.createListingFailure({error: error.message})),
          ),
        );
      }),
    ),
  );

  loadListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListings),
      mergeMap(() =>
        this.firestoreService
          .getCollectionWithCondition<Listing>(
            "listings",
            "status",
            "==",
            "active",
          )
          .pipe(
            map((listings) => ListingsActions.loadListingsSuccess({listings})),
            catchError((error) =>
              of(ListingsActions.loadListingsFailure({error: error.message})),
            ),
          ),
      ),
    ),
  );

  loadListingById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListingById),
      mergeMap(({id}) =>
        this.firestoreService.getDocument<Listing>("listings", id).pipe(
          map((listing) => ListingsActions.loadListingByIdSuccess({listing})),
          catchError((error) =>
            of(ListingsActions.loadListingByIdFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  updateListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.updateListing),
      mergeMap(({listing}) => {
        const updatedListing = {
          ...listing,
          lastModifiedAt: serverTimestamp(), // Always updated
        };
        return from(
          this.firestoreService.updateDocument(
            "listings",
            listing.id,
            updatedListing,
          ),
        ).pipe(
          map(() =>
            ListingsActions.updateListingSuccess({
              listing: updatedListing,
            }),
          ),
          catchError((error) =>
            of(ListingsActions.updateListingFailure({error: error.message})),
          ),
        );
      }),
    ),
  );

  deleteListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.deleteListing),
      mergeMap(({id}) =>
        from(this.firestoreService.deleteDocument("listings", id)).pipe(
          map(() => ListingsActions.deleteListingSuccess({id})),
          catchError((error) =>
            of(ListingsActions.deleteListingFailure({error: error.message})),
          ),
        ),
      ),
    ),
  );

  applyToListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.applyToListing),
      switchMap(({listingId, applicant}) =>
        this.firestoreService
          .setDocument(
            `listings/${listingId}/relatedAccounts/${applicant.id}`,
            applicant,
          )
          .then(() => ListingsActions.applyToListingSuccess())
          .catch((error) => ListingsActions.applyToListingFailure({error})),
      ),
    ),
  );
}
