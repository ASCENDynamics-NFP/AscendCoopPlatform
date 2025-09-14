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
import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";
import {RelatedListing} from "../../../../../../../../shared/models/related-listing.model";
import {Account} from "../../../../../../../../shared/models/account.model";
import {ListingType} from "../../../../../../../../shared/models/listing.model";

interface ListingGroup {
  type: ListingType;
  listings: RelatedListing[];
}

@Component({
  selector: "app-related-listings",
  templateUrl: "./related-listings.component.html",
  styleUrls: ["./related-listings.component.scss"],
})
export class RelatedListingsComponent {
  @Input() account: Account = {} as Account;
  @Input() relatedListings: RelatedListing[] = [];
  @Input() relationship: "owner" | "applicant" | "participant" | "saved" =
    "owner";
  @Input() isProfileOwner: boolean = false;
  @Input() isGroupAdmin: boolean = false;

  constructor(private router: Router) {}

  get title() {
    switch (this.relationship) {
      case "owner":
        return "Posted Listings";
      case "applicant":
        return "Applications";
      case "participant":
        return "Participating Listings";
      case "saved":
        return "Saved Listings";
      default:
        return "Listings";
    }
  }

  get filteredRelatedListings() {
    // Filter by relationship for all lists except 'saved',
    // which now uses explicit isSaved flag
    if (this.relationship === "saved") {
      return this.relatedListings.filter((rl) => rl.isSaved === true);
    }
    return this.relatedListings.filter(
      (rl) => rl.relationship === this.relationship,
    );
  }

  get canViewPrivateListings(): boolean {
    return this.isProfileOwner || this.isGroupAdmin;
  }

  get isPrivateSection(): boolean {
    // Saved and applicant listings are private (only visible to owner/admin)
    return this.relationship === "saved" || this.relationship === "applicant";
  }

  get shouldShowListings(): boolean {
    // Show applicant listings only to profile owner or group admin
    if (this.relationship === "applicant") {
      return this.canViewPrivateListings;
    }
    return true;
  }

  get activeListings() {
    return this.filteredRelatedListings.filter(
      (listing) => listing.status === "active",
    );
  }

  get activeListingsCount() {
    return this.activeListings.length;
  }

  get groupedActiveListings(): ListingGroup[] {
    const groups: Record<ListingType, RelatedListing[]> = {
      volunteer: [],
      job: [],
      internship: [],
      gig: [],
    };

    // Use activeListings which already filters by relationship and status
    this.activeListings.forEach((listing) => {
      if (groups[listing.type]) {
        groups[listing.type].push(listing);
      }
    });

    return Object.entries(groups)
      .filter(([_, listings]) => listings.length > 0)
      .map(([type, listings]) => ({
        type: type as ListingType,
        listings,
      }))
      .sort((a, b) => b.listings.length - a.listings.length); // Sort by count descending
  }

  getTypeIcon(type: ListingType): string {
    switch (type) {
      case "volunteer":
        return "heart-outline";
      case "job":
        return "briefcase-outline";
      case "internship":
        return "school-outline";
      case "gig":
        return "flash-outline";
      default:
        return "list-outline";
    }
  }

  getEmptyStateIcon(): string {
    switch (this.relationship) {
      case "owner":
        return "add-circle-outline";
      case "applicant":
        return "document-text-outline";
      case "participant":
        return "people-outline";
      case "saved":
        return "bookmark-outline";
      default:
        return "list-outline";
    }
  }

  getEmptyStateTitle(): string {
    switch (this.relationship) {
      case "owner":
        return this.isProfileOwner
          ? "Create Your First Listing"
          : "No Posted Listings";
      case "applicant":
        return "No Applications";
      case "participant":
        return "Not Participating in Any Listings";
      case "saved":
        return "No Saved Listings";
      default:
        return "No Listings";
    }
  }

  getEmptyStateMessage(): string {
    switch (this.relationship) {
      case "owner":
        return this.isProfileOwner
          ? "Start by creating your first volunteer opportunity, job posting, or gig."
          : "This user hasn't posted any listings yet.";
      case "applicant":
        return "No pending applications for listings.";
      case "participant":
        return "Not currently participating in any active listings.";
      case "saved":
        return "Save listings you're interested in to see them here.";
      default:
        return "No listings available.";
    }
  }

  createFirstListing() {
    this.router.navigate(["/listings/create"]);
  }

  goToRelatedListing(id: string | undefined) {
    if (id) {
      this.router.navigate([`/listings/${id}`]);
    } else {
      console.error("Invalid ID provided for navigation.");
    }
  }

  viewAll() {
    if (this.account?.id) {
      this.router.navigate([`/account/${this.account.id}/listings`]);
    }
  }

  viewAllByType(type: ListingType) {
    if (this.account?.id) {
      this.router.navigate([`/account/${this.account.id}/listings`], {
        queryParams: {type: type},
      });
    }
  }
}
