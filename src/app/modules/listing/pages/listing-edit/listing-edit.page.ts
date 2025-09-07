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
import {
  combineLatest,
  map,
  Observable,
  of,
  tap,
  switchMap,
  catchError,
} from "rxjs";
import {Listing} from "@shared/models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AppState} from "../../../../state/app.state";
import {selectListingById} from "../../../../state/selectors/listings.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {AuthUser} from "@shared/models/auth-user.model";
import {MetaService} from "../../../../core/services/meta.service";
import {AccessService} from "../../../../core/services/access.service";

@Component({
  selector: "app-listing-edit",
  templateUrl: "./listing-edit.page.html",
  styleUrls: ["./listing-edit.page.scss"],
})
export class ListingEditPage implements OnInit {
  authUser$: Observable<AuthUser | null>;
  listing$: Observable<Listing | null>;
  isOwner$: Observable<boolean>;
  ownerAccount$!: Observable<any | undefined>;
  listingId: string | null;

  constructor(
    private metaService: MetaService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private access: AccessService,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.listingId = this.route.snapshot.paramMap.get("id");
    this.listing$ = this.listingId
      ? this.store
          .select(selectListingById(this.listingId))
          .pipe(map((listing) => listing || null)) // Map undefined to null
      : of(null);
    // Resolve owner account (preferred when present)
    this.ownerAccount$ = this.listing$.pipe(
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
      this.authUser$,
      this.listing$,
      this.ownerAccount$,
    ]).pipe(
      map(([user, listing, ownerAccount]) =>
        this.access.isListingOwner(
          listing || undefined,
          user,
          ownerAccount as any,
        ),
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

  ionViewWillEnter() {
    // Default Meta Tags
    this.metaService.updateMetaTags(
      "Edit Listing | ASCENDynamics NFP",
      "Modify your listing details to reach the right audience on ASCENDynamics NFP.",
      "listing, edit, volunteer, nonprofits",
      {
        title: "Edit Listing | ASCENDynamics NFP",
        description:
          "Make updates to your listing to enhance visibility and engagement.",
        url: "https://ascendynamics.org/listings",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: "Edit Listing",
        description:
          "Update your listing on ASCENDynamics NFP to reach a wider audience.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
  }

  onSubmit(listing: Listing) {
    if (this.listingId) {
      this.store.dispatch(ListingsActions.updateListing({listing: listing}));
    }
  }
}
