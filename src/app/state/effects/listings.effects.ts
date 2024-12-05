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
import {catchError, debounceTime, from, map, mergeMap, of} from "rxjs";
import {FirestoreService} from "../../core/services/firestore.service";
import * as ListingsActions from "./../actions/listings.actions";
import {Listing} from "../../models/listing.model";
import {serverTimestamp} from "@angular/fire/firestore";
import {ListingRelatedAccount} from "../../models/listing-related-account.model";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";

@Injectable()
export class ListingsEffects {
  private listingsCache = new Map<string, Listing>();
  private relatedAccountsCache = new Map<string, ListingRelatedAccount[]>();
  private cacheExpiration = 5 * 60 * 1000; // 5 minutes

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private router: Router,
    private toastController: ToastController,
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
            this.toastController
              .create({
                message: "Listing created successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return ListingsActions.createListingSuccess({
              listing: {...newListing, id: docId},
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Error: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
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
      mergeMap(() => {
        // Check cache first
        const cachedListings = Array.from(this.listingsCache.values());
        if (cachedListings.length > 0) {
          return of(
            ListingsActions.loadListingsSuccess({listings: cachedListings}),
          );
        }

        // If not in cache, fetch from Firestore
        return this.firestoreService
          .getCollectionWithCondition<Listing>(
            "listings",
            "status",
            "==",
            "active",
          )
          .pipe(
            map((listings) => {
              // Update cache
              listings.forEach((listing) => {
                this.listingsCache.set(listing.id, listing);
                // Set timeout to clear cache
                setTimeout(() => {
                  this.listingsCache.delete(listing.id);
                }, this.cacheExpiration);
              });
              return ListingsActions.loadListingsSuccess({listings});
            }),
            catchError((error) =>
              of(ListingsActions.loadListingsFailure({error: error.message})),
            ),
          );
      }),
    ),
  );

  loadListingById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListingById),
      mergeMap(({id}) => {
        // Check cache first
        const cachedListing = this.listingsCache.get(id);
        if (cachedListing) {
          return of(
            ListingsActions.loadListingByIdSuccess({listing: cachedListing}),
          );
        }

        return this.firestoreService.getDocument<Listing>("listings", id).pipe(
          map((listing) => {
            if (!listing) {
              throw new Error("Listing not found");
            }
            // Update cache
            this.listingsCache.set(id, listing);
            setTimeout(() => {
              this.listingsCache.delete(id);
            }, this.cacheExpiration);
            return ListingsActions.loadListingByIdSuccess({listing});
          }),
          catchError((error) =>
            of(ListingsActions.loadListingByIdFailure({error: error.message})),
          ),
        );
      }),
    ),
  );

  // Add cache invalidation on updates
  updateListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.updateListing),
      debounceTime(300), // Add debounce time for rapid updates
      mergeMap(({listing}) => {
        this.listingsCache.delete(listing.id);
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
            this.listingsCache.set(listing.id, updatedListing);
            this.router.navigate([`/listings/${listing.id}`]);
            this.toastController
              .create({
                message: "Listing updated successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return ListingsActions.updateListingSuccess({
              listing: updatedListing,
            });
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Error updating listing: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
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
      mergeMap(({id}) => {
        // Clear from cache
        this.listingsCache.delete(id);

        return from(this.firestoreService.deleteDocument("listings", id)).pipe(
          map(() => {
            // this.router.navigate(["/listings"]); // Want to navigate to account's listings page.
            this.toastController
              .create({
                message: "Listing deleted successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return ListingsActions.deleteListingSuccess({id});
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Error deleting listing: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(
              ListingsActions.deleteListingFailure({error: error.message}),
            );
          }),
        );
      }),
    ),
  );

  submitApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.submitApplication),
      mergeMap(({relatedAccount}) => {
        this.relatedAccountsCache.delete(relatedAccount.listingId);

        return from(this.submitApplicationToFirestore(relatedAccount)).pipe(
          map(() => {
            this.router.navigate(["/listings", relatedAccount.listingId]);
            this.toastController
              .create({
                message: "Application submitted successfully",
                duration: 2000,
                color: "success",
              })
              .then((toast) => toast.present());
            return ListingsActions.submitApplicationSuccess();
          }),
          catchError((error) => {
            this.toastController
              .create({
                message: `Error submitting application: ${error.message}`,
                duration: 2000,
                color: "danger",
              })
              .then((toast) => toast.present());
            return of(
              ListingsActions.submitApplicationFailure({error: error.message}),
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
        {merge: true}, // Use merge if partial updates might be needed
      );
    } catch (error) {
      console.error("Error submitting application to Firestore:", error);
      throw new Error("Failed to submit application. Please try again later.");
    }
  }

  loadListingRelatedAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListingRelatedAccounts),
      mergeMap(({listingId}) => {
        // Check cache first
        const cachedRelatedAccounts = this.relatedAccountsCache.get(listingId);
        if (cachedRelatedAccounts) {
          this.toastController
            .create({
              message: "Applications loaded successfully",
              duration: 2000,
              color: "success",
            })
            .then((toast) => toast.present());

          return of(
            ListingsActions.loadListingRelatedAccountsSuccess({
              listingId,
              relatedAccounts: cachedRelatedAccounts,
            }),
          );
        }

        return this.firestoreService
          .getDocuments<ListingRelatedAccount>(
            `listings/${listingId}/relatedAccounts`,
          )
          .pipe(
            map((relatedAccounts) => {
              // Update cache
              this.relatedAccountsCache.set(listingId, relatedAccounts);
              setTimeout(() => {
                this.relatedAccountsCache.delete(listingId);
              }, this.cacheExpiration);

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
}
