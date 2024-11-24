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
// src/app/pages/account/relatedListings/pages/listings-list.page.ts

import {Component, OnInit} from "@angular/core";
import {AlertController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, combineLatest, BehaviorSubject, of} from "rxjs";
import {map, take} from "rxjs/operators";
import {AuthUser} from "../../../../../models/auth-user.model";
import {Account} from "../../../../../models/account.model";
import {RelatedListing} from "../../../../../models/related-listing.model";
import {
  selectAccountById,
  selectRelatedListingsByAccountId,
} from "../../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../../state/actions/account.actions";
import * as ListingsActions from "../../../../../state/actions/listings.actions";

@Component({
  selector: "app-listings-list",
  templateUrl: "./listings-list.page.html",
  styleUrls: ["./listings-list.page.scss"],
})
export class ListingsListPage implements OnInit {
  // Route Parameters
  accountId: string | null = null;

  // Observables
  currentUser$!: Observable<AuthUser | null>;
  account$!: Observable<Account | undefined>;
  relatedListings$!: Observable<RelatedListing[]>;
  filteredRelatedListings$!: Observable<RelatedListing[]>;
  isOwner$!: Observable<boolean>;
  title: string = "Listings"; // Default title

  // Filtering
  relationshipFilter$ = new BehaviorSubject<string>("all");
  relationshipFilter: string = "all";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store,
    private alertController: AlertController,
  ) {
    // Extract route parameters
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ngOnInit() {
    // Select the authenticated user from the store
    this.currentUser$ = this.store.select(selectAuthUser);

    if (this.accountId) {
      // Dispatch an action to load the account details if not already loaded
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );

      // Select the specific account by ID
      this.account$ = this.store.select(selectAccountById(this.accountId));

      // Select related listings for the account
      this.relatedListings$ = this.store.select(
        selectRelatedListingsByAccountId(this.accountId),
      );

      // Determine ownership based on current user and accountId
      this.isOwner$ = combineLatest([
        this.currentUser$,
        of(this.accountId),
      ]).pipe(
        map(([currentUser, accountId]) => currentUser?.uid === accountId),
      );

      // Set the title based on the account type
      this.account$.pipe(take(1)).subscribe((account) => {
        if (account) {
          this.title =
            account.type === "user" ? "My Listings" : "Group Listings";
        }
      });

      // Create filtered listings observable
      this.filteredRelatedListings$ = combineLatest([
        this.relatedListings$,
        this.relationshipFilter$,
      ]).pipe(
        map(([listings, filter]) => {
          if (filter === "all") {
            return listings;
          } else {
            return listings.filter(
              (listing) => listing.relationship === filter,
            );
          }
        }),
      );

      // Dispatch action to load related listings if not already loaded
      this.store.dispatch(
        AccountActions.loadRelatedListings({accountId: this.accountId}),
      );
    }
  }

  /**
   * Removes a related listing.
   * @param listing The related listing to remove.
   */
  async removeRelatedListing(listing: RelatedListing) {
    const alert = await this.alertController.create({
      header: "Confirm Removal",
      message:
        listing.relationship === "owner"
          ? "Are you sure you want to delete this listing?"
          : "Are you sure you want to remove your application?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Remove",
          role: "destructive",
          handler: () => {
            if (this.accountId && listing.id) {
              this.store.dispatch(
                AccountActions.deleteRelatedListing({
                  accountId: this.accountId,
                  relatedListingId: listing.id,
                }),
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteListing(listing: RelatedListing) {
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
            if (listing.id) {
              this.store.dispatch(
                ListingsActions.deleteListing({id: listing.id}),
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * TrackBy function to optimize *ngFor rendering.
   * @param index The index of the item.
   * @param item The related listing item.
   * @returns The unique identifier for the item.
   */
  trackById(index: number, item: RelatedListing): string {
    return item.id;
  }

  /**
   * Navigates to the listing details page.
   * @param listingId The ID of the listing.
   */
  goToListing(listingId: string | undefined) {
    if (listingId) {
      this.router.navigate([`/listings/${listingId}`]);
    } else {
      console.error("Invalid listing ID");
    }
  }

  /**
   * Handles changes in the relationship filter.
   * @param event The event containing the new filter value.
   */
  onRelationshipFilterChange(event: any) {
    this.relationshipFilter$.next(event.detail.value);
  }
}
