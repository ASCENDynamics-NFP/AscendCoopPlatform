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
import {Store} from "@ngrx/store";
import {combineLatest, map, Observable, take} from "rxjs";
import {ListingRelatedAccount} from "../../../../../models/listing-related-account.model";
import {AppState} from "../../../../../state/app.state";
import * as ListingsActions from "../../../../../state/actions/listings.actions";
import {
  selectListingById,
  selectRelatedAccountsByListingId,
} from "../../../../../state/selectors/listings.selectors";
import {ActivatedRoute, Router} from "@angular/router";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {Listing} from "../../../../../models/listing.model";
import {ModalController} from "@ionic/angular";
import {ApplicantDetailsModalComponent} from "./components/applicant-details-modal/applicant-details-modal.component";

@Component({
  selector: "app-applicants",
  templateUrl: "./applicants.page.html",
  styleUrls: ["./applicants.page.scss"],
})
export class ApplicantsPage implements OnInit {
  relatedAccounts$: Observable<ListingRelatedAccount[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  listingId: string;
  listing$: Observable<Listing>;
  isOwner$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private router: Router, // Add Router to constructor
  ) {
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.relatedAccounts$ = this.store.select(
      selectRelatedAccountsByListingId(this.listingId),
    );
    this.loading$ = this.store.select((state) => state.listings.loading);
    this.error$ = this.store.select((state) => state.listings.error);

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
        ListingsActions.loadListingRelatedAccounts({
          listingId: this.listingId,
        }),
      );
    }
  }

  async openApplicantDetailsModal(account: ListingRelatedAccount) {
    // Check if the user is the owner
    this.isOwner$.pipe(take(1)).subscribe((isOwner) => {
      if (isOwner) {
        // Open modal for owners
        this.openModal(account);
      } else {
        // Navigate to the profile page for non-owners
        this.router.navigate(["/account", account.accountId]); // Ensure Router is used correctly
      }
    });
  }

  async openModal(account: ListingRelatedAccount) {
    const modal = await this.modalController.create({
      component: ApplicantDetailsModalComponent,
      componentProps: {account},
    });
    await modal.present();
  }
}
