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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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
  listingForm: FormGroup;
  listing$!: Observable<Listing | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{listings: {selectedListing: Listing | null}}>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.listingForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      price: ["", Validators.required],
    });
    this.listing$ = this.store.select(
      (state) => state.listings.selectedListing,
    );
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.store.dispatch(ListingActions.loadListingById({id}));
    }
  }

  onSubmit() {
    if (this.listingForm.valid) {
      this.store.dispatch(
        ListingActions.updateListing({
          listing: this.listingForm.value,
        }),
      );
    }
  }
}
