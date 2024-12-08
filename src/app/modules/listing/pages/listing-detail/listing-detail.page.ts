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
// src/app/modules/listings/pages/listing-detail/listing-detail.page.ts

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {AlertController} from "@ionic/angular";
import {Observable, combineLatest} from "rxjs";
import {first, map} from "rxjs/operators";
import {Listing} from "../../../../models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AppState} from "../../../../state/app.state";
import {selectListingById} from "../../../../state/selectors/listings.selectors";
import {serverTimestamp} from "firebase/firestore";

@Component({
  selector: "app-listing-detail",
  templateUrl: "./listing-detail.page.html",
  styleUrls: ["./listing-detail.page.scss"],
})
export class ListingDetailPage implements OnInit {
  listing$: Observable<Listing | undefined>;
  isOwner$: Observable<boolean>;
  private listingId: string;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) {
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.listing$ = this.store.select(selectListingById(this.listingId));

    // Determine if current user is the listing creator
    this.isOwner$ = combineLatest([
      this.store.select(selectAuthUser),
      this.listing$,
    ]).pipe(
      map(
        ([user, listing]) =>
          !!(user && listing && listing.createdBy === user.uid),
      ),
    );
  }

  ngOnInit() {
    if (this.listingId) {
      this.store.dispatch(
        ListingsActions.loadListingById({id: this.listingId}),
      );
    }
  }

  async deleteListing() {
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
            if (this.listingId) {
              this.store.dispatch(
                ListingsActions.deleteListing({id: this.listingId}),
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  togglePublishStatus() {
    this.listing$.pipe(first()).subscribe(async (listing) => {
      if (listing) {
        const newStatus = listing.status === "active" ? "draft" : "active";
        const updatedListing = {
          ...listing,
          status: newStatus,
          lastModifiedAt: serverTimestamp(),
        } as Listing;
        this.store.dispatch(
          ListingsActions.updateListing({listing: updatedListing}),
        );
      }
    });
  }
}
