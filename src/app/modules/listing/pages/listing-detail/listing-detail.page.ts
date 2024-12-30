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
import {Observable, Subscription, combineLatest} from "rxjs";
import {map} from "rxjs/operators";
import {Listing} from "../../../../models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AppState} from "../../../../state/app.state";
import {selectListingById} from "../../../../state/selectors/listings.selectors";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-listing-detail",
  templateUrl: "./listing-detail.page.html",
  styleUrls: ["./listing-detail.page.scss"],
})
export class ListingDetailPage implements OnInit {
  private subscription: Subscription | null = null;
  listing$: Observable<Listing | undefined>;
  isOwner$: Observable<boolean>;
  private listingId: string;

  constructor(
    private metaService: MetaService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
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

  ionViewWillEnter() {
    this.subscription = this.listing$.subscribe({
      next: (listing) => {
        if (listing) {
          const benefitsText = listing.benefits
            ? listing.benefits.join(", ")
            : "Explore unique benefits tailored to this opportunity";
          const skillsText =
            listing.skills && listing.skills.length > 0
              ? listing.skills.map((skill) => skill.name).join(", ")
              : "No specific skills required, just bring your enthusiasm!";

          this.metaService.updateMetaTags(
            `${listing.title} | ASCENDynamics NFP`,
            `Join ${listing.organization} as a ${listing.type}. Responsibilities include ${listing.responsibilities.join(", ")}. Skills required: ${skillsText}. Benefits include: ${benefitsText}.`,
            `listing, volunteer, ${listing.type}, ${skillsText}`,
            {
              title: `${listing.title} | ASCENDynamics NFP`,
              description: `Explore the ${listing.type} opportunity at ${listing.organization}. ${listing.description}`,
              url: `https://app.ASCENDynamics.org/listing/${listing.id}`,
              image:
                listing.heroImage ||
                listing.iconImage ||
                "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
            },
            {
              card: "summary_large_image",
              title: listing.title,
              description: listing.description,
              image:
                listing.heroImage ||
                listing.iconImage ||
                "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
            },
          );
        }
      },
      error: (error) => {
        const listingId = this.route.snapshot.paramMap.get("id");
        this.metaService.updateMetaTags(
          "Discover Opportunities | ASCENDynamics NFP",
          "Explore a variety of opportunities to contribute and grow your skills. Join our community today!",
          "volunteer, nonprofits, community, opportunities",
          {
            title: "Discover Opportunities | ASCENDynamics NFP",
            description:
              "Explore a variety of opportunities to contribute and grow your skills. Join our community today!",
            url: `https://app.ASCENDynamics.org/listing/${listingId}`,
            image:
              "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
          },
          {
            card: "summary_large_image",
            title: "Discover Opportunities",
            description:
              "Explore a variety of opportunities to contribute and grow your skills. Join our community today!",
            image:
              "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
          },
        );
      },
    });
  }

  ionViewWillLeave() {
    // Unsubscribe when leaving the page to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
