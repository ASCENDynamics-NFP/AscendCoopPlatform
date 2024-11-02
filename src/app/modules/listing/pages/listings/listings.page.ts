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
import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {NavController} from "@ionic/angular";
import {Listing} from "../../../../models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {ListingsState} from "../../../../state/reducers/listings.reducer";

@Component({
  selector: "app-listings",
  templateUrl: "./listings.page.html",
  styleUrls: ["./listings.page.scss"],
})
export class ListingsPage implements OnInit {
  listings$: Observable<Listing[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  listingTypes = ["all", "volunteer", "job", "internship", "gig"];

  constructor(
    private store: Store<{listings: ListingsState}>,
    private navCtrl: NavController,
  ) {
    this.listings$ = this.store.select((state) =>
      state.listings.filteredListings.length > 0
        ? state.listings.filteredListings
        : state.listings.listings,
    );
    this.loading$ = this.store.select((state) => state.listings.loading);
    this.error$ = this.store.select((state) => state.listings.error);
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
}
