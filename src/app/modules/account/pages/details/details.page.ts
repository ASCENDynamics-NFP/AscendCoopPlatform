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
// src/app/modules/account/pages/details/details.page.ts

import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription, combineLatest} from "rxjs";
import {filter, map, take, tap} from "rxjs/operators";
import {AuthUser} from "../../../../models/auth-user.model";
import {Store} from "@ngrx/store";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectRelatedAccountsByAccountId,
  selectAccountById,
  selectRelatedListingsByAccountId,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {IonContent, ViewWillEnter} from "@ionic/angular";
import {RelatedListing} from "../../../../models/related-listing.model";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
})
export class DetailsPage implements OnInit, ViewWillEnter {
  @ViewChild(IonContent, {static: false}) content!: IonContent;
  public accountId: string | null = null;
  authUser$!: Observable<AuthUser | null>;
  account$!: Observable<Account | null>;
  private subscription: Subscription | null = null;
  relatedAccounts$!: Observable<RelatedAccount[]>;
  relatedListings$!: Observable<RelatedListing[]>;
  isProfileOwner$!: Observable<boolean>;

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(selectAuthUser);

    this.authUser$
      .pipe(
        filter((user): user is AuthUser => user !== null),
        take(1),
        tap((user) => {
          if (!user.type) {
            this.router.navigate([`/account/registration/${user.uid}`]);
          }
        }),
      )
      .subscribe();
  }

  ionViewWillEnter() {
    // Initialize authUser$ observable
    this.authUser$ = this.store.select(selectAuthUser);

    // Subscribe to route paramMap to detect changes in accountId
    this.route.paramMap.subscribe((params) => {
      this.accountId = params.get("accountId");

      if (this.accountId) {
        // Dispatch loadAccount action to fetch account data
        this.store.dispatch(
          AccountActions.loadAccount({accountId: this.accountId}),
        );
        this.store.dispatch(
          AccountActions.loadRelatedAccounts({accountId: this.accountId}),
        );
        this.store.dispatch(
          AccountActions.loadRelatedListings({accountId: this.accountId}),
        );

        // Select account and related accounts from the store
        this.account$ = this.store.select(selectAccountById(this.accountId));
        this.relatedAccounts$ = this.store.select(
          selectRelatedAccountsByAccountId(this.accountId),
        );
        this.relatedListings$ = this.store
          .select(selectRelatedListingsByAccountId(this.accountId))
          .pipe(
            map((listings) =>
              listings.filter((listing) => listing.status === "active"),
            ),
          );

        // Determine if the current user is the profile owner
        this.isProfileOwner$ = combineLatest([
          this.authUser$,
          this.account$,
        ]).pipe(
          map(([authUser, account]) => {
            if (account && authUser) {
              return account.id === authUser.uid;
            }
            return false;
          }),
        );
      }
    });

    this.subscription = this.account$.subscribe({
      next: (account) => {
        if (account) {
          this.updateAccountMeta(account);
        }
      },
      error: () => {
        this.setDefaultMeta();
      },
    });
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
      this.subscription = null;
    }
  }

  scrollToSection(sectionId: string): void {
    const yOffset = document.getElementById(sectionId)?.offsetTop;
    if (yOffset !== undefined) {
      this.content.scrollToPoint(0, yOffset, 500);
    }
  }

  private updateAccountMeta(account: Account) {
    const accountType =
      account.type === "user"
        ? "Profile"
        : account.type.charAt(0).toUpperCase() + account.type.slice(1);
    const descriptionPrefix =
      account.type === "user"
        ? `Explore ${account.name}'s profile. Learn about their volunteering efforts and achievements on ASCENDynamics NFP.`
        : `Discover ${account.name}. Join their efforts to make a difference through volunteering.`;
    const tags =
      account.type === "user"
        ? "profile, user, volunteer"
        : "group, volunteer, community";

    this.metaService.updateMetaTags(
      `${account.name} | ASCENDynamics NFP`,
      descriptionPrefix,
      tags,
      {
        title: `${account.name} | ASCENDynamics NFP`,
        description: descriptionPrefix,
        url: `https://app.ASCENDynamics.org/account/${account.id}`,
        image:
          account.iconImage ||
          "https://app.ASCENDynamics.org/assets/icon/logo.png",
      },
      {
        card: "summary_large_image",
        title: `${account.name}`,
        description: descriptionPrefix,
        image:
          account.iconImage ||
          "https://app.ASCENDynamics.org/assets/icon/logo.png",
      },
    );
  }

  private setDefaultMeta() {
    this.metaService.updateMetaTags(
      "Profile | ASCENDynamics NFP",
      "View and manage your profile details, volunteering history, and preferences on ASCENDynamics NFP.",
      "profile, volunteer, community, nonprofits",
      {
        title: "Profile | ASCENDynamics NFP",
        description:
          "Manage your profile and connect with volunteering opportunities on ASCENDynamics NFP.",
        url: "https://app.ASCENDynamics.org/",
        image: "https://app.ASCENDynamics.org/assets/icon/logo.png",
      },
      {
        card: "summary",
        title: "Profile | ASCENDynamics NFP",
        description:
          "Customize your profile and stay connected with your community.",
        image: "https://app.ASCENDynamics.org/assets/icon/logo.png",
      },
    );
  }
}
