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
import {Observable} from "rxjs";
import {ListingRelatedAccount} from "../../../../models/listing-related-account.model";
import {AppState} from "../../../../state/app.state";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {selectRelatedAccountsByListingId} from "../../../../state/selectors/listings.selectors";
import {ActivatedRoute} from "@angular/router";

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

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) {
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.relatedAccounts$ = this.store.select(
      selectRelatedAccountsByListingId(this.listingId),
    );
    this.loading$ = this.store.select((state) => state.listings.loading);
    this.error$ = this.store.select((state) => state.listings.error);
  }

  ngOnInit() {
    if (this.listingId) {
      this.store.dispatch(
        ListingsActions.loadListingRelatedAccounts({listingId: this.listingId}),
      );
    }
  }
}
