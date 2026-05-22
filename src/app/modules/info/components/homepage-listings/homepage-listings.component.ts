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
  standalone: false,
  selector: "app-homepage-listings",
  templateUrl: "./homepage-listings.component.html",
  styleUrls: ["./homepage-listings.component.scss"],
})
export class HomepageListingsComponent implements OnInit {
  listings: Listing[] = [];

  constructor(private listingsService: ListingsService) {}

  ngOnInit() {
    this.fetchListingsBasedOnLocation();
  }

  // Get user's browser location, with immediate fallback if unavailable
  fetchListingsBasedOnLocation() {
    if (!navigator.geolocation) {
      this.fetchListingsFallback();
      return;
    }

    // Fall back after 5 s if the permission prompt is ignored or slow
    const timeoutId = setTimeout(() => this.fetchListingsFallback(), 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.listingsService.getHomepageListings(location).subscribe({
          next: (listings) => {
            this.listings = listings;
          },
          error: (error) => {
            console.error("Error fetching homepage listings:", error);
            this.fetchListingsFallback();
          },
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        console.warn(
          "Geolocation unavailable, loading listings without location:",
          error,
        );
        this.fetchListingsFallback();
      },
      {timeout: 5000, maximumAge: 60000},
    );
  }

  private fetchListingsFallback() {
    if (this.listings.length > 0) return;
    // No location available — call without coordinates so the server returns
    // any active listings rather than sorting from an arbitrary (0,0) point.
    this.listingsService.getHomepageListings().subscribe({
      next: (listings) => {
        this.listings = listings;
      },
      error: (error) =>
        console.error("Error fetching homepage listings:", error),
    });
  }
}
