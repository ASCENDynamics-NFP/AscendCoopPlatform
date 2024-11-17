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
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AlertController} from "@ionic/angular";
import {Observable, combineLatest} from "rxjs";
import {first, map} from "rxjs/operators";
import {Listing} from "../../../../models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AppState} from "../../../../state/app.state";
import {selectListingById} from "../../../../state/selectors/listings.selectors";
import {ListingRelatedAccount} from "../../../../models/listing-related-account.model";
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
    private router: Router,
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
              this.router.navigate(["/listings"]);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async onApplyToListing() {
    const user = await this.store
      .select(selectAuthUser)
      .pipe(first())
      .toPromise(); // Get the current user

    if (!user) {
      console.error("User or Listing not found");
      return;
    }

    const noteAlert = await this.alertController.create({
      header: "Application Note",
      message: `Your Info: ${user.displayName || "Anonymous"}, ${user.email}, ${user.phoneNumber}. Enter a note for your application (optional):`,
      inputs: [
        {
          name: "note",
          type: "textarea",
          placeholder: "Add a note about your application...",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Submit",
          handler: async (data) => {
            const note = data.note || ""; // Retrieve the entered note
            const user = await this.store
              .select(selectAuthUser)
              .pipe(first())
              .toPromise(); // Get the current user
            if (!user) {
              console.error("User not authenticated");
              return;
            }

            if (this.listingId) {
              const applicant: ListingRelatedAccount = {
                id: user.uid,
                accountId: user.uid,
                iconImage: user.iconImage || undefined,
                name: user.displayName || "Anonymous",
                email: user.email || "",
                phone: user.phoneNumber || undefined,
                listingId: this.listingId,
                status: "applied",
                applicationDate: serverTimestamp(),
                notes: note,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                lastModifiedAt: serverTimestamp(),
                lastModifiedBy: user.uid,
              };

              // Dispatch action to apply for listing with the applicant details
              this.store.dispatch(
                ListingsActions.applyToListing({
                  listingId: this.listingId,
                  applicant,
                }),
              );
            }
          },
        },
      ],
    });

    await noteAlert.present();
  }
}
