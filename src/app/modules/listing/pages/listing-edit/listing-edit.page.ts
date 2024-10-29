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
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {Listing} from "../../../../models/listing.model";
import * as ListingActions from "../../../../state/actions/listings.actions";

@Component({
  selector: "app-listing-edit",
  templateUrl: "./listing-edit.page.html",
  styleUrls: ["./listing-edit.page.scss"],
})
export class ListingEditPage implements OnInit {
  listing$: Observable<Listing | null>;
  id: string | null = null;

  constructor(
    private store: Store<{listings: {selectedListing: Listing | null}}>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.listing$ = this.store.select(
      (state) => state.listings.selectedListing,
    );
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.store.dispatch(ListingActions.loadListingById({id: this.id}));
    }
  }

  onSubmit(listing: Listing) {
    if (this.id) {
      const updatedListing = {...listing, id: this.id};
      this.store.dispatch(
        ListingActions.updateListing({listing: updatedListing}),
      );
      this.router.navigate(["/listings", this.id]);
    }
  }
}
