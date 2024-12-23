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
import {AlertController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, combineLatest, BehaviorSubject, of} from "rxjs";
import {map, take} from "rxjs/operators";
import {AuthUser} from "../../../../../models/auth-user.model";
import {Account} from "../../../../../models/account.model";
import {RelatedListing} from "../../../../../models/related-listing.model";
import {
  selectAccountById,
  selectRelatedListingsByAccountId,
} from "../../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../../state/actions/account.actions";
import * as ListingsActions from "../../../../../state/actions/listings.actions";
import {MetaService} from "../../../../../core/services/meta.service";

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
  title: string = "Listings";

  relationshipFilter$ = new BehaviorSubject<string>("all");
  relationshipFilter: string = "all";

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
    private router: Router,
    private store: Store,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ngOnInit() {
    this.currentUser$ = this.store.select(selectAuthUser);

    if (this.accountId) {
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );
      this.account$ = this.store.select(selectAccountById(this.accountId));
      this.relatedListings$ = this.store.select(
        selectRelatedListingsByAccountId(this.accountId),
      );

      this.isOwner$ = combineLatest([
        this.currentUser$,
        of(this.accountId),
      ]).pipe(
        map(([currentUser, accountId]) => currentUser?.uid === accountId),
      );

      this.account$.pipe(take(1)).subscribe((account) => {
        if (account) {
          this.title =
            account.type === "user" ? "My Listings" : "Group Listings";
        }
      });

      this.filteredRelatedListings$ = combineLatest([
        this.relatedListings$,
        this.relationshipFilter$,
        this.isOwner$,
      ]).pipe(
        map(([listings, filter, isOwner]) => {
          let filteredListings = isOwner
            ? listings
            : listings.filter((listing) => listing.status === "active");

          return filter === "all"
            ? filteredListings
            : filteredListings.filter(
                (listing) => listing.relationship === filter,
              );
        }),
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
          return listings.slice(startIndex, startIndex + this.pageSize);
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
        url: "https://app.ASCENDynamics.org/listings",
        image: "https://app.ASCENDynamics.org/assets/icon/logo.png",
      },
      {
        card: "summary",
        title: "Volunteer Listings | ASCENDynamics NFP",
        description:
          "Find opportunities to contribute and grow your skills with ASCENDynamics NFP.",
        image: "https://app.ASCENDynamics.org/assets/icon/logo.png",
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
    this.relationshipFilter$.next(event.detail.value);
  }

  goToPage(pageNumber: number) {
    this.currentPageSubject.next(pageNumber);
  }
}
