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
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {first, filter, take} from "rxjs/operators";
import {Listing} from "@shared/models/listing.model";
import * as ListingActions from "../../../../state/actions/listings.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectListingById} from "../../../../state/selectors/listings.selectors";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-listing-create",
  templateUrl: "./listing-create.page.html",
  styleUrls: ["./listing-create.page.scss"],
})
export class ListingCreatePage implements OnInit {
  templateListing: Listing | null = null;

  constructor(
    private metaService: MetaService,
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Check if we have a template parameter for duplication
    const templateId = this.route.snapshot.queryParamMap.get("template");
    if (templateId) {
      // Load the template listing
      this.store.dispatch(ListingActions.loadListingById({id: templateId}));

      // Get the template listing from store
      this.store
        .select(selectListingById(templateId))
        .pipe(
          filter((listing): listing is Listing => listing != null),
          take(1),
        )
        .subscribe((listing) => {
          // Create a copy without id and timestamps for the template
          this.templateListing = {
            ...listing,
            id: "", // Reset ID for new listing
            title: listing.title,
            createdAt: undefined as any,
            lastModifiedAt: undefined as any,
            createdBy: "",
            lastModifiedBy: undefined,
            status: "active" as const, // Always start new listings as active
          };
        });
    }
  }

  ionViewWillEnter() {
    // Default Meta Tags
    this.metaService.updateMetaTags(
      "Create Listing | ASCENDynamics NFP",
      "Create listing details to reach the right audience on ASCENDynamics NFP.",
      "listing, create, volunteer, nonprofits",
      {
        title: "Create Listing | ASCENDynamics NFP",
        description: "Create a listing to enhance visibility and engagement.",
        url: "https://ascendynamics.org/listings",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: "Create Listing",
        description:
          "Create your listing on ASCENDynamics NFP to reach a wider audience.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
  }

  onSubmit(formValue: any) {
    this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user) => {
        if (user) {
          const listing = {
            ...formValue,
            createdBy: user.uid,
          };
          this.store.dispatch(ListingActions.createListing({listing}));
        }
      });
  }
}
