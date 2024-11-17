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
import {RelatedListing} from "../../../../../../models/related-listing.model";
import {Account} from "../../../../../../models/account.model";

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

  constructor(private router: Router) {}

  get title() {
    switch (this.relationship) {
      case "owner":
        return "My Listings";
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
    return this.relatedListings.filter(
      (rl) => rl.relationship === this.relationship,
    );
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
      this.router.navigate([
        `/account/${this.account.id}/listings/${this.relationship}`,
      ]);
    }
  }
}
