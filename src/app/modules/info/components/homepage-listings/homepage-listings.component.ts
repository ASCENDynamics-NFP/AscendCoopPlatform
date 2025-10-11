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
/** Homepage Listings Component */

import {Component, OnInit} from "@angular/core";
import {ListingsService} from "../../../../core/services/listings.service";
import {Listing} from "../../../../../../shared/models/listing.model";

@Component({
  selector: "app-homepage-listings",
  templateUrl: "./homepage-listings.component.html",
  styleUrls: ["./homepage-listings.component.scss"],
})
export class HomepageListingsComponent implements OnInit {
  listings: Listing[] = [];
  private listingIconState: Record<string, boolean> = {};

  constructor(private listingsService: ListingsService) {}

  ngOnInit() {
    this.fetchListingsBasedOnLocation();
  }

  // Get user's browser location
  fetchListingsBasedOnLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Call the service with location
        this.listingsService.getHomepageListings(location).subscribe(
          (listings: Listing[]) => {
            this.listings = listings;
            this.listingIconState = {};
            listings.forEach((listing) => {
              this.listingIconState[listing.id] = !!listing.iconImage;
            });
          },
          (error: any) => {
            console.error("Error fetching homepage listings:", error);
          },
        );
      },
      (error: any) => {
        console.error("Error getting location:", error);
      },
    );
  }

  hasListingIcon(listing: Listing): boolean {
    if (!listing.iconImage) return false;
    const state = this.listingIconState[listing.id];
    return state !== false;
  }

  onListingIconError(listingId: string) {
    this.listingIconState[listingId] = false;
  }

  getListingFallbackIcon(listing: Listing): string {
    const iconMap: Record<string, string> = {
      volunteer: "people-outline",
      job: "briefcase-outline",
      // event: "calendar-outline",
      // project: "construct-outline",
      // resource: "library-outline",
      // service: "hand-right-outline",
      internship: "school-outline",
      gig: "flash-outline",
    };
    return iconMap[listing.type?.toLowerCase?.() || ""] || "briefcase-outline";
  }
}
