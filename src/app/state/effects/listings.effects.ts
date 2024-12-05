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
import {
  catchError,
  debounceTime,
  from,
  map,
  mergeMap,
  of,
  withLatestFrom,
  filter,
  take,
} from "rxjs";
import {FirestoreService} from "../../core/services/firestore.service";
import * as ListingsActions from "../actions/listings.actions";
import {Listing} from "../../models/listing.model";
import {serverTimestamp} from "@angular/fire/firestore";
import {ListingRelatedAccount} from "../../models/listing-related-account.model";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {AppState} from "../app.state";
import {
  selectAllListings,
  selectListingById,
  selectRelatedAccountsByListingId,
} from "../selectors/listings.selectors";

@Injectable()
export class ListingsEffects {
  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private router: Router,
    private toastController: ToastController,
    private store: Store<AppState>,
  ) {}

  createListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.createListing),
      mergeMap(({listing}) => {
        const newListing = {
          ...listing,
          createdAt: serverTimestamp(),
          lastModifiedAt: serverTimestamp(),
        };
        return from(
          this.firestoreService.addDocument("listings", newListing),
        ).pipe(
          map((docId) => {
            this.router.navigate([`/listings/${docId}`]);
            this.showToast("Listing created successfully", "success");
            return ListingsActions.createListingSuccess({
              listing: {...newListing, id: docId},
            });
          }),
          catchError((error) => {
            this.showToast(`Error: ${error.message}`, "danger");
            return of(
              ListingsActions.createListingFailure({error: error.message}),
            );
          }),
        );
      }),
    ),
  );

  loadListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListings),
      withLatestFrom(this.store.select(selectAllListings)),
      filter(([_, loaded]) => !loaded),
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
        this.store.select(selectListingById(id)).pipe(
          take(1),
          mergeMap((listing) => {
            if (listing) {
              // Listing is already loaded
              return of(ListingsActions.loadListingByIdSuccess({listing}));
            } else {
              // Fetch from Firestore
              return this.firestoreService
                .getDocument<Listing>("listings", id)
                .pipe(
                  map((fetchedListing) => {
                    if (!fetchedListing) {
                      throw new Error("Listing not found");
                    }
                    return ListingsActions.loadListingByIdSuccess({
                      listing: fetchedListing,
                    });
                  }),
                  catchError((error) =>
                    of(
                      ListingsActions.loadListingByIdFailure({
                        error: error.message,
                      }),
                    ),
                  ),
                );
            }
          }),
        ),
      ),
    ),
  );

  updateListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.updateListing),
      debounceTime(300),
      mergeMap(({listing}) => {
        const updatedListing = {
          ...listing,
          lastModifiedAt: serverTimestamp(),
        };
        return from(
          this.firestoreService.updateDocument(
            "listings",
            listing.id,
            updatedListing,
          ),
        ).pipe(
          map(() => {
            this.router.navigate([`/listings/${listing.id}`]);
            this.showToast("Listing updated successfully", "success");
            return ListingsActions.updateListingSuccess({
              listing: updatedListing,
            });
          }),
          catchError((error) => {
            this.showToast(
              `Error updating listing: ${error.message}`,
              "danger",
            );
            return of(
              ListingsActions.updateListingFailure({error: error.message}),
            );
          }),
        );
      }),
    ),
  );

  deleteListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.deleteListing),
      mergeMap(({id}) =>
        from(this.firestoreService.deleteDocument("listings", id)).pipe(
          map(() => {
            // Navigate to the listings page or desired route
            this.showToast("Listing deleted successfully", "success");
            return ListingsActions.deleteListingSuccess({id});
          }),
          catchError((error) => {
            this.showToast(
              `Error deleting listing: ${error.message}`,
              "danger",
            );
            return of(
              ListingsActions.deleteListingFailure({error: error.message}),
            );
          }),
        ),
      ),
    ),
  );

  submitApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.submitApplication),
      mergeMap(({relatedAccount}) =>
        from(this.submitApplicationToFirestore(relatedAccount)).pipe(
          map(() => {
            this.router.navigate(["/listings", relatedAccount.listingId]);
            this.showToast("Application submitted successfully", "success");
            return ListingsActions.submitApplicationSuccess();
          }),
          catchError((error) => {
            this.showToast(
              `Error submitting application: ${error.message}`,
              "danger",
            );
            return of(
              ListingsActions.submitApplicationFailure({error: error.message}),
            );
          }),
        ),
      ),
    ),
  );

  loadListingRelatedAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListingRelatedAccounts),
      mergeMap(({listingId}) => {
        return this.firestoreService
          .getDocuments<ListingRelatedAccount>(
            `listings/${listingId}/relatedAccounts`,
          )
          .pipe(
            map((relatedAccounts) => {
              this.toastController
                .create({
                  message: "Applications loaded successfully",
                  duration: 2000,
                  color: "success",
                })
                .then((toast) => toast.present());

              return ListingsActions.loadListingRelatedAccountsSuccess({
                listingId,
                relatedAccounts,
              });
            }),
            catchError((error) => {
              this.toastController
                .create({
                  message: `Error loading applications: ${error.message}`,
                  duration: 2000,
                  color: "danger",
                })
                .then((toast) => toast.present());
              return of(
                ListingsActions.loadListingRelatedAccountsFailure({
                  listingId,
                  error,
                }),
              );
            }),
          );
      }),
    ),
  );

  private async submitApplicationToFirestore(
    relatedAccount: ListingRelatedAccount,
  ): Promise<void> {
    try {
      const applicationId = relatedAccount.id;

      // Upload files if present
      const resumeFile = relatedAccount.resumeFile
        ? await this.firestoreService.uploadFile(
            `accounts/${applicationId}/listing/${relatedAccount.listingId}/resume.pdf`,
            relatedAccount.resumeFile,
          )
        : null;

      const coverLetterFile = relatedAccount.coverLetterFile
        ? await this.firestoreService.uploadFile(
            `accounts/${applicationId}/listing/${relatedAccount.listingId}/coverLetter.pdf`,
            relatedAccount.coverLetterFile,
          )
        : null;

      // Save application data using setDocument
      await this.firestoreService.setDocument(
        `listings/${relatedAccount.listingId}/relatedAccounts/${applicationId}`,
        {
          id: applicationId,
          firstName: relatedAccount.firstName,
          lastName: relatedAccount.lastName,
          email: relatedAccount.email,
          phone: relatedAccount.phone,
          notes: relatedAccount.notes,
          resumeFile,
          coverLetterFile,
          listingId: relatedAccount.listingId,
          applicationDate: serverTimestamp(),
          createdAt: serverTimestamp(),
          lastModifiedAt: serverTimestamp(),
        },
        {merge: true},
      );
    } catch (error) {
      console.error("Error submitting application to Firestore:", error);
      throw new Error("Failed to submit application. Please try again later.");
    }
  }

  private showToast(message: string, color: string) {
    this.toastController
      .create({
        message,
        duration: 2000,
        color,
      })
      .then((toast) => toast.present());
  }
}
