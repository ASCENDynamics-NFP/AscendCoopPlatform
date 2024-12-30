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
// src/app/modules/listing/pages/listings/listings.page.ts

import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {Observable, BehaviorSubject, combineLatest, map} from "rxjs";
import {NavController} from "@ionic/angular";
import {Listing} from "../../../../models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {AppState} from "../../../../state/app.state";
import {
  selectFilteredListings,
  selectLoading,
  selectError,
} from "../../../../state/selectors/listings.selectors";
import {AuthUser} from "../../../../models/auth-user.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-listings",
  templateUrl: "./listings.page.html",
  styleUrls: ["./listings.page.scss"],
})
export class ListingsPage implements OnInit {
  listings$: Observable<Listing[]>;
  paginatedListings$: Observable<Listing[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  authUser$: Observable<AuthUser | null>;
  listingTypes = ["all", "volunteer", "job", "internship", "gig"];

  // Pagination State
  pageSize = 10;
  currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();
  totalItems$: Observable<number>;
  totalPages$: Observable<number>;

  constructor(
    private metaService: MetaService,
    private navCtrl: NavController,
    private store: Store<AppState>,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.listings$ = this.store.select(selectFilteredListings);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);

    // Calculate total items dynamically
    this.totalItems$ = this.listings$.pipe(map((listings) => listings.length));

    // Calculate total pages
    this.totalPages$ = this.totalItems$.pipe(
      map((totalItems) => Math.ceil(totalItems / this.pageSize)),
    );

    // Paginate listings
    this.paginatedListings$ = combineLatest([
      this.listings$,
      this.currentPage$,
    ]).pipe(
      map(([listings, currentPage]) => {
        const startIndex = (currentPage - 1) * this.pageSize;
        return listings.slice(startIndex, startIndex + this.pageSize);
      }),
    );
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

  ngOnInit() {
    this.loadListings();
  }

  loadListings() {
    this.store.dispatch(ListingsActions.loadListings());
  }

  createListing() {
    this.navCtrl.navigateForward("/listings/create");
  }

  viewListing(id: string) {
    this.navCtrl.navigateForward(`/listings/${id}`);
  }

  filterListings(event: any) {
    const listingType = event.detail.value;
    this.store.dispatch(ListingsActions.filterListings({listingType}));
  }

  searchListings(event: any) {
    const query = event.detail.value;
    this.store.dispatch(ListingsActions.searchListings({query}));
  }

  doRefresh(event: any) {
    this.loadListings();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getListingLocation(listing: Listing): string {
    const primaryAddress = listing.contactInformation?.addresses?.[0];
    if (primaryAddress) {
      return `${primaryAddress.city}, ${primaryAddress.country}`;
    }
    return "Location not specified";
  }

  getIconForType(type: string): string {
    const iconMap: Record<string, string> = {
      volunteer: "people-outline",
      job: "briefcase-outline",
      event: "calendar-outline",
      project: "construct-outline",
      resource: "library-outline",
      service: "hand-right-outline",
      all: "apps-outline",
      internship: "school-outline",
      gig: "flash-outline",
    };

    return iconMap[type.toLowerCase()] || "help-outline";
  }

  goToPage(pageNumber: number) {
    this.currentPageSubject.next(pageNumber);
  }
}
