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
// src/app/pages/account/relatedListings/pages/listings-list.page.ts

import {Component, OnInit} from "@angular/core";
import {AlertController, PopoverController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, combineLatest, BehaviorSubject, of} from "rxjs";
import {map, take, filter, delay} from "rxjs/operators";
import {AuthUser} from "@shared/models/auth-user.model";
import {Account} from "@shared/models/account.model";
import {RelatedListing} from "@shared/models/related-listing.model";
import {
  selectAccountById,
  selectRelatedListingsByAccountId,
  selectRelatedAccountsByAccountId,
} from "../../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {selectListingById} from "../../../../../state/selectors/listings.selectors";
import * as AccountActions from "../../../../../state/actions/account.actions";
import * as ListingsActions from "../../../../../state/actions/listings.actions";
import {MetaService} from "../../../../../core/services/meta.service";
import {AccessService} from "../../../../../core/services/access.service";

@Component({
  selector: "app-listings-list",
  templateUrl: "./listings-list.page.html",
  styleUrls: ["./listings-list.page.scss"],
})
export class ListingsListPage implements OnInit {
  accountId: string | null = null;
  currentUser$!: Observable<AuthUser | null>;
  account$!: Observable<Account | undefined>;
  relatedListings$!: Observable<RelatedListing[]>;
  filteredRelatedListings$!: Observable<RelatedListing[]>;
  paginatedListings$!: Observable<RelatedListing[]>;
  isOwner$!: Observable<boolean>;
  isGroupAdmin$!: Observable<boolean>;
  relatedAccounts$!: Observable<any[]>;
  title: string = "Listings";

  relationshipFilter$ = new BehaviorSubject<string>("all");
  relationshipFilter: string = "all";

  typeFilter$ = new BehaviorSubject<string>("all");
  typeFilter: string = "all";

  // Pagination State
  pageSize = 10; // Number of listings per page
  currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();
  totalItems$!: Observable<number>;
  totalPages$!: Observable<number>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private metaService: MetaService,
    private popoverController: PopoverController,
    private router: Router,
    private store: Store,
    private access: AccessService,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");

    // Check for type query parameter from profile component
    const typeParam = this.activatedRoute.snapshot.queryParamMap.get("type");
    if (typeParam) {
      this.typeFilter = typeParam;
      this.typeFilter$.next(typeParam);
    }
  }

  ngOnInit() {
    this.currentUser$ = this.store.select(selectAuthUser);

    if (this.accountId) {
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );
      this.store.dispatch(
        AccountActions.loadRelatedAccounts({accountId: this.accountId}),
      );
      this.account$ = this.store.select(selectAccountById(this.accountId));
      this.relatedAccounts$ = this.store.select(
        selectRelatedAccountsByAccountId(this.accountId),
      );

      this.isOwner$ = combineLatest([this.currentUser$, this.account$]).pipe(
        map(([user, account]) => this.access.isOwner(account as any, user)),
      );

      this.isGroupAdmin$ = combineLatest([
        this.currentUser$,
        this.account$,
      ]).pipe(
        map(([user, account]) =>
          this.access.isGroupAdmin(account as any, user),
        ),
      );

      // Add privacy filtering to relatedListings$ to prevent unauthorized access to applicant data
      this.relatedListings$ = combineLatest([
        this.store.select(selectRelatedListingsByAccountId(this.accountId)),
        this.isOwner$,
        this.isGroupAdmin$,
      ]).pipe(
        map(([listings, isOwner, isGroupAdmin]) => {
          // Filter out applicant listings for non-owners and non-admins
          return listings.filter((listing) => {
            // For applicant listings, only show to owners or group admins
            if (
              listing.relationship === "applicant" &&
              !isOwner &&
              !isGroupAdmin
            ) {
              return false;
            }
            return true;
          });
        }),
      );

      this.account$.pipe(take(1)).subscribe((account) => {
        if (account) {
          this.title =
            account.type === "user" ? "Posted Listings" : "Group Listings";
        }
      });

      this.filteredRelatedListings$ = combineLatest([
        this.relatedListings$,
        this.relationshipFilter$,
        this.typeFilter$,
        this.isOwner$,
        this.isGroupAdmin$,
      ]).pipe(
        map(
          ([
            listings,
            relationshipFilter,
            typeFilter,
            isOwner,
            isGroupAdmin,
          ]) => {
            let filteredListings = listings;
            const hasPermission = isOwner || isGroupAdmin;

            // Security check: Restrict access to sensitive relationship filters
            if (
              (relationshipFilter === "applicant" ||
                relationshipFilter === "archived" ||
                relationshipFilter === "saved") &&
              !hasPermission
            ) {
              // If non-authorized user tries to access restricted filters, return empty results
              return [];
            }

            // Filter by relationship
            if (relationshipFilter === "archived") {
              // Show expired and filled listings only (authorized users only)
              filteredListings = hasPermission
                ? listings.filter(
                    (listing) =>
                      listing.status === "expired" ||
                      listing.status === "filled",
                  )
                : [];
            } else {
              // For non-archived listings, apply status filtering first
              if (hasPermission) {
                // Owners/admins see active and draft listings (not expired/filled)
                filteredListings = listings.filter(
                  (listing) =>
                    listing.status === "active" || listing.status === "draft",
                );
              } else {
                // Non-owners see only active listings
                filteredListings = listings.filter(
                  (listing) => listing.status === "active",
                );
              }

              // Then filter by relationship if not "all"
              if (relationshipFilter !== "all") {
                filteredListings = filteredListings.filter(
                  (listing) => listing.relationship === relationshipFilter,
                );
              }

              // For non-owners viewing profiles, additionally filter to only show owner's listings
              // This prevents seeing saved/participated listings of others
              if (!hasPermission && relationshipFilter === "all") {
                filteredListings = filteredListings.filter(
                  (listing) => listing.relationship === "owner",
                );
              }
            }

            // Filter by type if not "all"
            if (typeFilter !== "all") {
              filteredListings = filteredListings.filter(
                (listing) => listing.type === typeFilter,
              );
            }

            return filteredListings;
          },
        ),
      );

      // Pagination Logic
      this.totalItems$ = this.filteredRelatedListings$.pipe(
        map((listings) => listings.length),
      );

      this.totalPages$ = this.totalItems$.pipe(
        map((totalItems) => Math.ceil(totalItems / this.pageSize)),
      );

      this.paginatedListings$ = combineLatest([
        this.filteredRelatedListings$,
        this.currentPage$,
      ]).pipe(
        map(([listings, currentPage]) => {
          const startIndex = (currentPage - 1) * this.pageSize;
          const paginatedResults = listings.slice(
            startIndex,
            startIndex + this.pageSize,
          );
          return paginatedResults;
        }),
      );

      this.store.dispatch(
        AccountActions.loadRelatedListings({accountId: this.accountId}),
      );
    }
  }

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Volunteer Listings | ASCENDynamics NFP",
      "Explore volunteering opportunities available on ASCENDynamics NFP to make an impact in your community.",
      "volunteer listings, nonprofits, opportunities, community impact",
      {
        title: "Volunteer Listings | ASCENDynamics NFP",
        description:
          "Browse and apply for volunteer roles on ASCENDynamics NFP.",
        url: "https://ascendynamics.org/listings",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "Volunteer Listings | ASCENDynamics NFP",
        description:
          "Find opportunities to contribute and grow your skills with ASCENDynamics NFP.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
  }

  /**
   * Removes a related listing.
   * @param listing The related listing to remove.
   */
  async removeRelatedListing(listing: RelatedListing) {
    const alert = await this.alertController.create({
      header: "Confirm Removal",
      message:
        listing.relationship === "owner"
          ? "Are you sure you want to delete this listing?"
          : "Are you sure you want to remove your application?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Remove",
          role: "destructive",
          handler: () => {
            if (this.accountId && listing.id) {
              this.store.dispatch(
                AccountActions.deleteRelatedListing({
                  accountId: this.accountId,
                  relatedListingId: listing.id,
                }),
              );
              // Refresh the listings after removal
              of(null)
                .pipe(delay(1000))
                .subscribe(() => this.refreshRelatedListings());
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteListing(listing: RelatedListing) {
    const alert = await this.alertController.create({
      header: "Confirm Deletion",
      message: "Are you sure you want to delete this listing?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete",
          role: "destructive",
          handler: () => {
            if (listing.id) {
              this.store.dispatch(
                ListingsActions.deleteListing({id: listing.id}),
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * TrackBy function to optimize *ngFor rendering.
   * @param index The index of the item.
   * @param item The related listing item.
   * @returns The unique identifier for the item.
   */
  trackById(index: number, item: RelatedListing): string {
    return item.id;
  }

  /**
   * Navigates to the listing details page.
   * @param listingId The ID of the listing.
   */
  goToListing(listingId: string | undefined) {
    if (listingId) {
      this.router.navigate([`/listings/${listingId}`]);
    } else {
      console.error("Invalid listing ID");
    }
  }

  /**
   * Handles changes in the relationship filter.
   * @param event The event containing the new filter value.
   */
  onRelationshipFilterChange(event: any) {
    const newFilter = event.detail.value;

    // Check if user is trying to access restricted filters
    combineLatest([this.isOwner$, this.isGroupAdmin$])
      .pipe(take(1))
      .subscribe(([isOwner, isGroupAdmin]) => {
        const hasPermission = isOwner || isGroupAdmin;

        if (
          (newFilter === "applicant" || newFilter === "archived") &&
          !hasPermission
        ) {
          // Redirect to "all" filter if user doesn't have permission
          this.relationshipFilter = "all";
          this.relationshipFilter$.next("all");
          console.warn(
            "Access denied: Only account owners and group admins can view applicant and archived listings",
          );
        } else {
          this.relationshipFilter = newFilter;
          this.relationshipFilter$.next(newFilter);
        }
      });
  }

  /**
   * Handles changes in the type filter.
   * @param event The event containing the new filter value.
   */
  onTypeFilterChange(event: any) {
    this.typeFilter$.next(event.detail.value);
  }

  /**
   * Gets the appropriate color for the status badge.
   * @param status The listing status.
   * @returns The color for the badge.
   */
  getStatusColor(status: string): string {
    switch (status) {
      case "active":
        return "success";
      case "filled":
        return "warning";
      case "expired":
        return "danger";
      default:
        return "medium";
    }
  }

  goToPage(pageNumber: number) {
    this.currentPageSubject.next(pageNumber);
  }

  /**
   * Saves a listing for the current user.
   * @param listing The listing to save.
   */
  async saveListing(listing: RelatedListing) {
    if (!this.accountId || !listing.id) return;

    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser?.uid) {
        this.store.dispatch(
          ListingsActions.saveListing({
            listingId: listing.id,
            accountId: currentUser.uid,
          }),
        );
        // Refresh the listings after saving with a delay
        of(null)
          .pipe(delay(1000))
          .subscribe(() => this.refreshRelatedListings());
      }
    });
  }

  /**
   * Removes a saved listing.
   * @param listing The saved listing to remove.
   */
  async unsaveListing(listing: RelatedListing) {
    if (!this.accountId || !listing.id) return;

    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser?.uid) {
        this.store.dispatch(
          ListingsActions.unsaveListing({
            listingId: listing.id,
            accountId: currentUser.uid,
          }),
        );
        // Refresh the listings after unsaving with a delay
        of(null)
          .pipe(delay(1000))
          .subscribe(() => this.refreshRelatedListings());
      }
    });
  }

  /**
   * Archives an active listing.
   * @param listing The listing to archive.
   */
  async archiveListing(listing: RelatedListing) {
    if (!listing.id) return;

    const alert = await this.alertController.create({
      header: "Archive Listing",
      message:
        "Archive this listing? It will no longer be visible to applicants.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Archive",
          handler: () => {
            this.updateListingStatus(listing, "filled");
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Reactivates an archived listing.
   * @param listing The listing to reactivate.
   */
  async unarchiveListing(listing: RelatedListing) {
    if (!listing.id) return;

    const alert = await this.alertController.create({
      header: "Reactivate Listing",
      message:
        "Reactivate this listing? It will become visible to applicants again.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Reactivate",
          handler: () => {
            this.updateListingStatus(listing, "active");
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Marks a listing as filled.
   * @param listing The listing to mark as filled.
   */
  async markAsFilled(listing: RelatedListing) {
    if (!listing.id) return;

    const alert = await this.alertController.create({
      header: "Mark as Filled",
      message: "Mark this position as filled? The listing will be archived.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Mark as Filled",
          handler: () => {
            this.updateListingStatus(listing, "filled");
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Duplicates a listing for reuse.
   * @param listing The listing to duplicate.
   */
  duplicateListing(listing: RelatedListing) {
    if (!listing.id) return;

    // First ensure the full listing is loaded in the store
    this.store.dispatch(ListingsActions.loadListingById({id: listing.id}));

    // Navigate to create page with pre-filled data
    this.router.navigate(["/listings/create"], {
      queryParams: {
        template: listing.id,
      },
    });
  }

  /**
   * Helper method to safely update listing status by ensuring we have the full listing data.
   * @param relatedListing The related listing to update.
   * @param status The new status to set.
   */
  private updateListingStatus(
    relatedListing: RelatedListing,
    status: "active" | "filled" | "expired",
  ): void {
    // First, try to get the full listing from the store
    this.store
      .select(selectListingById(relatedListing.id))
      .pipe(take(1))
      .subscribe((fullListing) => {
        if (fullListing) {
          // We have the full listing, update it immediately
          this.store.dispatch(
            ListingsActions.updateListing({
              listing: {
                ...fullListing,
                status: status,
              },
            }),
          );
          // Multi-stage refresh to handle backend timing
          this.performDelayedRefresh();
        } else {
          // Full listing not in store, load it first
          this.store.dispatch(
            ListingsActions.loadListingById({id: relatedListing.id}),
          );

          // Wait for the listing to be loaded
          this.store
            .select(selectListingById(relatedListing.id))
            .pipe(
              filter((listing) => listing != null),
              take(1),
            )
            .subscribe((listing) => {
              if (listing) {
                this.store.dispatch(
                  ListingsActions.updateListing({
                    listing: {
                      ...listing,
                      status: status,
                    },
                  }),
                );
                // Multi-stage refresh to handle backend timing
                this.performDelayedRefresh();
              }
            });
        }
      });
  }

  /**
   * Performs multiple delayed refreshes to ensure backend changes are captured
   */
  private performDelayedRefresh(): void {
    // Immediate refresh (in case effect-based refresh works)
    this.refreshRelatedListings();

    // Short delay refresh (1 second)
    of(null)
      .pipe(delay(1000))
      .subscribe(() => {
        this.refreshRelatedListings();
      });

    // Medium delay refresh (3 seconds)
    of(null)
      .pipe(delay(3000))
      .subscribe(() => {
        this.refreshRelatedListings();
      });

    // Long delay refresh (5 seconds) - final safety net
    of(null)
      .pipe(delay(5000))
      .subscribe(() => {
        this.refreshRelatedListings();
      });
  }

  /**
   * Refreshes the related listings data from the backend
   */
  private refreshRelatedListings(): void {
    if (this.accountId) {
      // Dispatch action to reload the related listings with force reload
      this.store.dispatch(
        AccountActions.loadRelatedListings({
          accountId: this.accountId,
          forceReload: true,
        }),
      );
    }
  } /**
   * Helper method to navigate from popover and close it
   * @param route The route to navigate to
   */
  navigateAndClosePopover(route: string): void {
    // Extract listing ID from the route if it's an edit route
    const editMatch = route.match(/\/listings\/([^\/]+)\/edit/);
    if (editMatch) {
      const listingId = editMatch[1];
      // Ensure the listing is loaded before navigating
      this.store.dispatch(ListingsActions.loadListingById({id: listingId}));
    }
    this.router.navigate([route]);
  }

  /**
   * Helper method to close a popover
   * @param triggerId The ID of the trigger element
   */
  async closePopover(triggerId: string): Promise<void> {
    // Use PopoverController to dismiss the topmost popover
    const popover = await this.popoverController.getTop();
    if (popover) {
      await popover.dismiss();
    }
  }
}
