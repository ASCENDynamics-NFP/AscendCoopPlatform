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
  switchMap,
} from "rxjs";
import {FirestoreService} from "../../core/services/firestore.service";
import {ListingsService} from "../../core/services/listings.service";
import {FirebaseFunctionsService} from "../../core/services/firebase-functions.service";
import {StorageService} from "../../core/services/storage.service";
import * as ListingsActions from "../actions/listings.actions";
import {AdvancedFilters} from "../actions/listings.actions";
import {Listing} from "../../../../shared/models/listing.model";
import {serverTimestamp} from "@angular/fire/firestore";
import {ListingRelatedAccount} from "../../../../shared/models/listing-related-account.model";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {AppState} from "../app.state";
import * as AccountActions from "../actions/account.actions";
import {
  selectListingById,
  selectAreListingsFresh,
  selectAreRelatedAccountsFresh,
  selectAdvancedFilters,
  selectNextCursor,
  selectAllListings,
} from "../selectors/listings.selectors";
import {SearchListingsRequest} from "../../core/services/firebase-functions.service";

@Injectable()
export class ListingsEffects {
  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private listingsService: ListingsService,
    private storageService: StorageService,
    private router: Router,
    private toastController: ToastController,
    private store: Store<AppState>,
    private firebaseFunctions: FirebaseFunctionsService,
  ) {}

  // Create a new listing
  createListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.createListing),
      mergeMap(({listing}) => {
        // Convert listing to CreateListingRequest format
        const createRequest = {
          title: listing.title,
          organization: listing.organization || "",
          description: listing.description || "",
          type: listing.type as "volunteer" | "job" | "event" | "project",
          category: "general", // Default category since Listing model doesn't have category
          status:
            (listing.status as "active" | "inactive" | "draft") || "active",
          remote: listing.remote || false,
          ownerAccountId: (listing as any)?.ownerAccountId || undefined,
          contactInformation: {
            emails:
              listing.contactInformation?.emails?.map((e) => ({
                email: e.email || "",
                type: e.name || "contact", // Use name field as type
              })) || [],
            phoneNumbers:
              listing.contactInformation?.phoneNumbers?.map((p) => ({
                number: p.number || "",
                type: p.type || "mobile",
              })) || [],
            addresses:
              listing.contactInformation?.addresses?.map((a) =>
                a
                  ? {
                      street: a.street || undefined,
                      city: a.city || undefined,
                      state: a.state || undefined,
                      zipCode: a.zipcode || undefined, // Fix: use zipcode not zipCode
                      country: a.country || undefined,
                      remote: a.remote || undefined,
                    }
                  : {},
              ) || [],
          },
          requirements: listing.requirements || [],
          skills: listing.skills?.map((skill) => skill.name) || [], // Extract skill names
          timeCommitment: listing.timeCommitment
            ? {
                hoursPerWeek: listing.timeCommitment.hoursPerWeek,
                duration: listing.timeCommitment.duration,
                schedule: listing.timeCommitment.schedule,
              }
            : undefined,
          iconImage: listing.iconImage,
          heroImage: listing.heroImage,
        };

        return this.listingsService.createListing(createRequest).pipe(
          map((result) => {
            const newListing = {
              ...listing,
              id: result.listing?.id || result.id,
              createdAt: result.listing?.createdAt || new Date(),
              lastModifiedAt: result.listing?.lastModifiedAt || new Date(),
            };
            this.router.navigate([`/listings/${newListing.id}`]);
            this.showToast("Listing created successfully", "success");
            return ListingsActions.createListingSuccess({
              listing: newListing,
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

  // Load all listings if not fresh
  loadListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListings),
      withLatestFrom(this.store.select(selectAreListingsFresh)),
      switchMap(([_, areFresh]) => {
        // If data is fresh, dispatch success with empty action to reset loading
        if (areFresh) {
          return this.store.select(selectAllListings).pipe(
            take(1),
            map((listings) => ListingsActions.loadListingsSuccess({listings})),
          );
        }
        // Otherwise fetch from backend
        return this.listingsService
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
          );
      }),
    ),
  );

  // Load a single listing by ID if not already in the store
  loadListingById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListingById),
      mergeMap(({id}) =>
        this.store.select(selectListingById(id)).pipe(
          take(1),
          mergeMap((listing) => {
            if (listing) {
              // Listing already loaded
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

  // Update an existing listing (via callable)
  updateListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.updateListing),
      debounceTime(300),
      mergeMap(({listing}) =>
        this.listingsService.updateListing(listing.id, listing as any).pipe(
          map(() => {
            // Only navigate if we're not on the account listings page
            // and not already on this listing's detail page
            const currentUrl = this.router.url;
            const isAccountListingsPage = /\/account\/[^\/]+\/listings$/.test(
              currentUrl,
            );
            const isSameListingDetail = new RegExp(
              `^/listings/${listing.id}(?:$|/)`,
            ).test(currentUrl);
            if (!isAccountListingsPage && !isSameListingDetail) {
              this.router.navigate([`/listings/${listing.id}`]);
            }
            this.showToast("Listing updated successfully", "success");
            return ListingsActions.updateListingSuccess({
              listing,
            });
          }),
          // After success, force-refresh owner related listings so profile segments update
          // Note: ownerAccountId may be the user's own uid or a group id
          mergeMap((action) => {
            const ownerId = (listing as any).ownerAccountId;
            return ownerId
              ? [
                  action,
                  AccountActions.loadRelatedListings({
                    accountId: ownerId,
                    forceReload: true as any,
                  }) as any,
                ]
              : [action];
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
        ),
      ),
    ),
  );

  // Delete a listing
  deleteListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.deleteListing),
      mergeMap(({id}) =>
        this.listingsService.deleteListing(id).pipe(
          map(() => {
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

  // Submit application (related to a listing)
  submitApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.submitApplication),
      mergeMap(({relatedAccount}) => {
        const applicationId = relatedAccount.id;
        const listingId = relatedAccount.listingId;
        let resumeUrl: string | null = null;
        let coverLetterUrl: string | null = null;

        return from(
          (async () => {
            if ((relatedAccount as any).resumeFile) {
              resumeUrl = await this.storageService.uploadFile(
                `accounts/${applicationId}/listing/${listingId}/resume.pdf`,
                (relatedAccount as any).resumeFile,
              );
            }
            if ((relatedAccount as any).coverLetterFile) {
              coverLetterUrl = await this.storageService.uploadFile(
                `accounts/${applicationId}/listing/${listingId}/coverLetter.pdf`,
                (relatedAccount as any).coverLetterFile,
              );
            }
          })(),
        ).pipe(
          // attempt to apply
          switchMap(() =>
            this.listingsService
              .applyToListing(
                listingId,
                (relatedAccount as any).notes,
                undefined,
                resumeUrl,
                coverLetterUrl,
                (relatedAccount as any).firstName,
                (relatedAccount as any).lastName,
                (relatedAccount as any).email,
                (relatedAccount as any).phone,
              )
              .pipe(
                map(() => {
                  this.router.navigate(["/listings", listingId]);
                  this.showToast(
                    "Application submitted successfully",
                    "success",
                  );
                  return ListingsActions.submitApplicationSuccess();
                }),
                catchError((error) => {
                  const msg = String(error?.message || error).toLowerCase();
                  if (msg.includes("already applied")) {
                    // Fallback: update existing application (notes/files)
                    return this.firebaseFunctions
                      .updateMyApplication(
                        listingId,
                        (relatedAccount as any).notes,
                        resumeUrl,
                        coverLetterUrl,
                        (relatedAccount as any).firstName,
                        (relatedAccount as any).lastName,
                        (relatedAccount as any).email,
                        (relatedAccount as any).phone,
                      )
                      .pipe(
                        map(() => {
                          this.router.navigate(["/listings", listingId]);
                          this.showToast(
                            "Application updated successfully",
                            "success",
                          );
                          return ListingsActions.submitApplicationSuccess();
                        }),
                        catchError((err2) => {
                          this.showToast(
                            `Error updating application: ${err2.message}`,
                            "danger",
                          );
                          return of(
                            ListingsActions.submitApplicationFailure({
                              error: err2.message,
                            }),
                          );
                        }),
                      );
                  }
                  this.showToast(
                    `Error submitting application: ${error.message}`,
                    "danger",
                  );
                  return of(
                    ListingsActions.submitApplicationFailure({
                      error: error.message,
                    }),
                  );
                }),
              ),
          ),
        );
      }),
    ),
  );

  // Load related accounts for a listing if not fresh
  loadListingRelatedAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadListingRelatedAccounts),
      mergeMap(({listingId}) =>
        this.store.select(selectAreRelatedAccountsFresh(listingId)).pipe(
          take(1),
          filter((areFresh) => !areFresh), // Only load if stale
          switchMap(() =>
            this.listingsService
              .getDocuments<ListingRelatedAccount>(
                `listings/${listingId}/relatedAccounts`,
              )
              .pipe(
                map((relatedAccounts) => {
                  this.showToast("Applications loaded successfully", "success");
                  return ListingsActions.loadListingRelatedAccountsSuccess({
                    listingId,
                    relatedAccounts,
                  });
                }),
                catchError((error) => {
                  this.showToast(
                    `Error loading applications: ${error.message}`,
                    "danger",
                  );
                  return of(
                    ListingsActions.loadListingRelatedAccountsFailure({
                      listingId,
                      error: error.message,
                    }),
                  );
                }),
              ),
          ),
        ),
      ),
    ),
  );

  // Helper method for submitting an application
  private async submitApplicationToFirestore(
    relatedAccount: ListingRelatedAccount,
  ): Promise<void> {
    try {
      const applicationId = relatedAccount.id;

      // Upload files if present
      const resumeFile = relatedAccount.resumeFile
        ? await this.storageService.uploadFile(
            `accounts/${applicationId}/listing/${relatedAccount.listingId}/resume.pdf`,
            relatedAccount.resumeFile,
          )
        : null;

      const coverLetterFile = relatedAccount.coverLetterFile
        ? await this.storageService.uploadFile(
            `accounts/${applicationId}/listing/${relatedAccount.listingId}/coverLetter.pdf`,
            relatedAccount.coverLetterFile,
          )
        : null;

      // Save application data using setDocument
      await this.firestoreService.setDocument(
        `listings/${relatedAccount.listingId}/relatedAccounts/${applicationId}`,
        {
          id: applicationId,
          name: relatedAccount.name,
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
          iconImage: relatedAccount.iconImage,
          accountId: applicationId,
          type: "application",
          status: "applied",
        },
        {merge: true},
      );
    } catch (error) {
      console.error("Error submitting application to Firestore:", error);
      throw new Error("Failed to submit application. Please try again later.");
    }
  }

  updateRelatedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.updateRelatedAccount),
      mergeMap(({listingId, relatedAccount}) => {
        // Support all pipeline status values
        const status = relatedAccount.status as
          | "reviewing"
          | "interviewed"
          | "accepted"
          | "declined";
        return this.listingsService
          .manageApplication(
            listingId,
            relatedAccount.id,
            status,
            (relatedAccount as any).notes,
          )
          .pipe(
            map(() =>
              ListingsActions.updateRelatedAccountSuccess({
                listingId,
                relatedAccount,
              }),
            ),
            catchError((error) =>
              of(
                ListingsActions.updateRelatedAccountFailure({
                  error: error.message,
                }),
              ),
            ),
          );
      }),
    ),
  );

  // Save a listing for a user
  saveListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.saveListing),
      mergeMap(({listingId, accountId}) =>
        this.listingsService.saveListing(listingId).pipe(
          mergeMap(() => {
            this.showToast("Listing saved successfully", "success");
            return [
              ListingsActions.saveListingSuccess({listingId, accountId}),
              // Force reload related listings so Saved segment updates immediately
              AccountActions.loadRelatedListings({
                accountId,
                forceReload: true as any,
              }) as any,
            ];
          }),
          catchError((error) => {
            this.showToast(`Error saving listing: ${error.message}`, "danger");
            return of(
              ListingsActions.saveListingFailure({error: error.message}),
            );
          }),
        ),
      ),
    ),
  );

  // Unsave a listing for a user
  unsaveListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.unsaveListing),
      mergeMap(({listingId, accountId}) =>
        this.listingsService.unsaveListing(listingId).pipe(
          mergeMap(() => {
            this.showToast("Listing removed from saved items", "success");
            return [
              ListingsActions.unsaveListingSuccess({listingId, accountId}),
              AccountActions.loadRelatedListings({
                accountId,
                forceReload: true as any,
              }) as any,
            ];
          }),
          catchError((error) => {
            this.showToast(
              `Error removing saved listing: ${error.message}`,
              "danger",
            );
            return of(
              ListingsActions.unsaveListingFailure({error: error.message}),
            );
          }),
        ),
      ),
    ),
  );

  // Advanced search listings using backend callable function
  advancedSearchListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.advancedSearchListings),
      debounceTime(300),
      switchMap(({filters}) => {
        // Convert AdvancedFilters to SearchListingsRequest
        const searchRequest: SearchListingsRequest = {};

        // NOTE: Location filtering is currently disabled because listings
        // don't have geocoded coordinates in the expected format.
        // TODO: Enable once listings have location.coordinates field populated
        // if (filters.location) {
        //   searchRequest.location = {
        //     latitude: filters.location.latitude,
        //     longitude: filters.location.longitude,
        //   };
        // }
        // if (filters.radiusKm) {
        //   searchRequest.radiusKm = filters.radiusKm;
        // }

        if (filters.skills && filters.skills.length > 0) {
          searchRequest.skills = filters.skills;
        }

        if (filters.type) {
          searchRequest.type = filters.type as
            | "volunteer"
            | "job"
            | "event"
            | "project";
        }

        if (filters.remote !== null && filters.remote !== undefined) {
          searchRequest.remote = filters.remote;
        }

        if (
          filters.hoursPerWeekMin !== null &&
          filters.hoursPerWeekMin !== undefined
        ) {
          searchRequest.hoursPerWeekMin = filters.hoursPerWeekMin;
        }

        if (
          filters.hoursPerWeekMax !== null &&
          filters.hoursPerWeekMax !== undefined
        ) {
          searchRequest.hoursPerWeekMax = filters.hoursPerWeekMax;
        }

        if (filters.limit) {
          searchRequest.limit = filters.limit;
        }

        if (filters.startAfter) {
          searchRequest.startAfter = filters.startAfter;
        }

        return this.listingsService.searchListings(searchRequest).pipe(
          map((listings) =>
            ListingsActions.advancedSearchListingsSuccess({
              listings,
              hasMore: listings.length === (filters.limit || 20),
              nextCursor:
                listings.length > 0
                  ? listings[listings.length - 1].id
                  : undefined,
            }),
          ),
          catchError((error) => {
            this.showToast(`Search failed: ${error.message}`, "danger");
            return of(
              ListingsActions.advancedSearchListingsFailure({
                error: error.message,
              }),
            );
          }),
        );
      }),
    ),
  );

  // Load more listings (pagination)
  loadMoreListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadMoreListings),
      withLatestFrom(
        this.store.select(selectAdvancedFilters),
        this.store.select(selectNextCursor),
      ),
      filter(([_, __, nextCursor]) => !!nextCursor),
      switchMap(([_, filters, nextCursor]) => {
        const searchRequest: SearchListingsRequest = {
          ...this.buildSearchRequest(filters),
          startAfter: nextCursor || undefined,
        };

        return this.listingsService.searchListings(searchRequest).pipe(
          map((newListings) =>
            ListingsActions.advancedSearchListingsSuccess({
              listings: newListings,
              hasMore: newListings.length === (filters.limit || 20),
              nextCursor:
                newListings.length > 0
                  ? newListings[newListings.length - 1].id
                  : undefined,
            }),
          ),
          catchError((error) =>
            of(
              ListingsActions.advancedSearchListingsFailure({
                error: error.message,
              }),
            ),
          ),
        );
      }),
    ),
  );

  // Helper to build search request from filters
  private buildSearchRequest(filters: AdvancedFilters): SearchListingsRequest {
    const searchRequest: SearchListingsRequest = {};

    // Location filtering - uses contactInformation.addresses[].geopoint on backend
    if (filters.location) {
      searchRequest.location = {
        latitude: filters.location.latitude,
        longitude: filters.location.longitude,
      };
    }

    if (filters.radiusKm) {
      searchRequest.radiusKm = filters.radiusKm;
    }

    if (filters.skills && filters.skills.length > 0) {
      searchRequest.skills = filters.skills;
    }

    if (filters.type) {
      searchRequest.type = filters.type as
        | "volunteer"
        | "job"
        | "event"
        | "project";
    }

    if (filters.remote !== null && filters.remote !== undefined) {
      searchRequest.remote = filters.remote;
    }

    if (
      filters.hoursPerWeekMin !== null &&
      filters.hoursPerWeekMin !== undefined
    ) {
      searchRequest.hoursPerWeekMin = filters.hoursPerWeekMin;
    }

    if (
      filters.hoursPerWeekMax !== null &&
      filters.hoursPerWeekMax !== undefined
    ) {
      searchRequest.hoursPerWeekMax = filters.hoursPerWeekMax;
    }

    if (filters.limit) {
      searchRequest.limit = filters.limit;
    }

    return searchRequest;
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

  // Bulk update status effect - loops through selected applicants
  bulkUpdateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.bulkUpdateStatus),
      mergeMap(({listingId, applicantIds, status}) => {
        // Create an array of update calls
        const updateCalls = applicantIds.map((applicantId) =>
          this.listingsService.manageApplication(
            listingId,
            applicantId,
            status,
          ),
        );

        // Execute all updates in parallel
        return from(
          Promise.all(updateCalls.map((call) => call.toPromise())),
        ).pipe(
          map(() => {
            this.showToast(
              `Successfully updated ${applicantIds.length} applicant(s) to ${status}`,
              "success",
            );
            // Reload related accounts to refresh the view
            this.store.dispatch(
              ListingsActions.loadListingRelatedAccounts({listingId}),
            );
            return ListingsActions.bulkUpdateStatusSuccess();
          }),
          catchError((error) => {
            this.showToast(
              `Error updating applicants: ${error.message}`,
              "danger",
            );
            return of(
              ListingsActions.bulkUpdateStatusFailure({error: error.message}),
            );
          }),
        );
      }),
    ),
  );
}
