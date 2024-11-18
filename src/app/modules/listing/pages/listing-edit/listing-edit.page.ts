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
// src/app/modules/listings/pages/listing-edit/listing-edit.page.ts

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {combineLatest, first, map, Observable, of, tap} from "rxjs";
import {Listing} from "../../../../models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AppState} from "../../../../state/app.state";
import {selectListingById} from "../../../../state/selectors/listings.selectors";
import {AuthUser} from "../../../../models/auth-user.model";

@Component({
  selector: "app-listing-edit",
  templateUrl: "./listing-edit.page.html",
  styleUrls: ["./listing-edit.page.scss"],
})
export class ListingEditPage implements OnInit {
  authUser$: Observable<AuthUser | null>;
  listing$: Observable<Listing | null>;
  isOwner$: Observable<boolean>;
  listingId: string | null;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.listingId = this.route.snapshot.paramMap.get("id");
    this.listing$ = this.listingId
      ? this.store
          .select(selectListingById(this.listingId))
          .pipe(map((listing) => listing || null)) // Map undefined to null
      : of(null);
    this.isOwner$ = combineLatest([this.authUser$, this.listing$]).pipe(
      map(
        ([user, listing]) =>
          !!(user && listing && listing.createdBy === user.uid),
      ),
      tap((isOwner) => {
        if (!isOwner) {
          this.router.navigate(["/listings"]);
        }
      }),
    );
  }

  ngOnInit() {
    if (this.listingId) {
      this.store.dispatch(
        ListingsActions.loadListingById({id: this.listingId}),
      );
    }
  }

  onSubmit(listing: Listing) {
    if (this.listingId) {
      this.authUser$.pipe(first()).subscribe((user) => {
        if (user) {
          const updatedListing = {
            ...listing,
            id: listing.id || this.listingId!,
          };
          this.store.dispatch(
            ListingsActions.updateListing({listing: updatedListing}),
          );
          this.router.navigate(["/listings", this.listingId]);
        }
      });
    }
  }
}
