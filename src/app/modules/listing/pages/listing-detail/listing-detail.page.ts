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
import {
  Observable,
  Subscription,
  combineLatest,
  of,
  firstValueFrom,
} from "rxjs";
import {
  map,
  take,
  filter as rxFilter,
  switchMap,
  catchError,
} from "rxjs/operators";
import {Listing} from "@shared/models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AppState} from "../../../../state/app.state";
import {
  selectListingById,
  selectLoading,
} from "../../../../state/selectors/listings.selectors";
import {MetaService} from "../../../../core/services/meta.service";
import {
  selectAccountById,
  selectRelatedListingsByAccountId,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {RelatedListing} from "@shared/models/related-listing.model";
import {AccessService} from "../../../../core/services/access.service";

@Component({
  selector: "app-listing-detail",
  templateUrl: "./listing-detail.page.html",
  styleUrls: ["./listing-detail.page.scss"],
})
export class ListingDetailPage implements OnInit {
  private subscription: Subscription | null = null;
  listing$: Observable<Listing | undefined>;
  isOwner$: Observable<boolean>;
  loading$: Observable<boolean>;
  private listingId: string;
  isSaved$: Observable<boolean> = of(false);

  constructor(
    private metaService: MetaService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private access: AccessService,
  ) {
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.listing$ = this.store.select(selectListingById(this.listingId));
    this.loading$ = this.store.select(selectLoading);

    // Determine if current user is the listing owner/admin of owner account
    const ownerAccount$ = this.listing$.pipe(
      map((l) => l?.ownerAccountId),
      switchMap((ownerId) =>
        ownerId
          ? this.store
              .select(selectAccountById(ownerId))
              .pipe(catchError(() => of(undefined)))
          : of(undefined),
      ),
    );
    this.isOwner$ = combineLatest([
      this.store.select(selectAuthUser),
      this.listing$,
      ownerAccount$,
    ]).pipe(
      map(([user, listing, ownerAccount]) =>
        this.access.isListingOwner(listing, user, ownerAccount as any),
      ),
    );
  }

  ngOnInit() {
    if (this.listingId) {
      this.store.dispatch(
        ListingsActions.loadListingById({id: this.listingId}),
      );
    }

    // Ensure we have the auth user's related listings loaded to derive saved state
    this.store
      .select(selectAuthUser)
      .pipe(
        rxFilter((u) => !!u?.uid),
        take(1),
      )
      .subscribe((u) => {
        this.store.dispatch(
          AccountActions.loadRelatedListings({accountId: (u as any).uid}),
        );
      });

    // Compute isSaved from auth user's relatedListings
    this.isSaved$ = combineLatest([
      this.store.select(selectAuthUser),
      this.listing$,
    ]).pipe(
      switchMap(([user, listing]) => {
        if (!user?.uid || !listing?.id) return of(false);
        return this.store
          .select(selectRelatedListingsByAccountId(user.uid))
          .pipe(
            map((rels: RelatedListing[]) =>
              (rels || []).some(
                (rl) => rl.id === listing.id && (rl as any).isSaved === true,
              ),
            ),
          );
      }),
    );
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
          const responsibilitiesText =
            listing.responsibilities && listing.responsibilities.length > 0
              ? listing.responsibilities.join(", ")
              : "Multiple responsibilities";

          this.metaService.updateMetaTags(
            `${listing.title} | ASCENDynamics NFP`,
            `Join ${listing.organization} as a ${listing.type}. Responsibilities include ${responsibilitiesText}. Skills required: ${skillsText}. Benefits include: ${benefitsText}.`,
            `listing, volunteer, ${listing.type}, ${skillsText}`,
            {
              title: `${listing.title} | ASCENDynamics NFP`,
              description: `Explore the ${listing.type} opportunity at ${listing.organization}. ${listing.description}`,
              url: `https://ascendynamics.org/listing/${listing.id}`,
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
            url: `https://ascendynamics.org/listing/${listingId}`,
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

  async saveListing(listingId: string) {
    const user = await firstValueFrom(this.store.select(selectAuthUser));
    if (!user?.uid) return;
    this.store.dispatch(
      ListingsActions.saveListing({listingId, accountId: user.uid}),
    );
  }

  async unsaveListing(listingId: string) {
    const user = await firstValueFrom(this.store.select(selectAuthUser));
    if (!user?.uid) return;
    this.store.dispatch(
      ListingsActions.unsaveListing({listingId, accountId: user.uid}),
    );
  }
}
