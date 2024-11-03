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
import {AlertController} from "@ionic/angular";
import {Observable, combineLatest} from "rxjs";
import {map} from "rxjs/operators";
import {Listing} from "../../../../models/listing.model";
import * as ListingActions from "../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {ListingsState} from "../../../../state/reducers/listings.reducer";

@Component({
  selector: "app-listing-detail",
  templateUrl: "./listing-detail.page.html",
  styleUrls: ["./listing-detail.page.scss"],
})
export class ListingDetailPage implements OnInit {
  listing$: Observable<Listing | null>;
  isOwner$: Observable<boolean>;

  constructor(
    private store: Store<{listings: ListingsState}>,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) {
    this.listing$ = this.store.select(
      (state) => state.listings.selectedListing,
    );

    // Determine if current user is the listing creator
    this.isOwner$ = combineLatest([
      this.store.select(selectAuthUser),
      this.listing$,
    ]).pipe(
      map(([user, listing]) => {
        return !!(user && listing && listing.createdBy === user.uid);
      }),
    );
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.store.dispatch(ListingActions.loadListingById({id}));
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
            const id = this.route.snapshot.paramMap.get("id");
            if (id) {
              this.store.dispatch(ListingActions.deleteListing({id}));
              this.router.navigate(["/listings"]);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
