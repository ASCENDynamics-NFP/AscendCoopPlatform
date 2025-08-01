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
// src/app/modules/account/pages/registration/registration.page.ts

import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Account} from "@shared/models/account.model";
import {Store} from "@ngrx/store";
import {
  selectAccountById,
  selectAccountLoading,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {Observable} from "rxjs";
import {
  switchMap,
  filter,
  map,
  shareReplay,
  startWith,
  take,
} from "rxjs/operators";
import {MetaService} from "../../../../core/services/meta.service";
import {MenuController} from "@ionic/angular";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.page.html",
  styleUrls: ["./registration.page.scss"],
})
export class RegistrationPage implements OnInit, OnDestroy {
  public selectedType: "user" | "group" | "" = "";
  public account$!: Observable<Account | undefined>;
  public loading$!: Observable<boolean>;
  public isDataReady$!: Observable<boolean>;
  private accountId$!: Observable<string>;

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute,
    private store: Store,
    private menuCtrl: MenuController,
  ) {}

  ngOnInit() {
    // Disable the menu when entering the registration page
    this.menuCtrl.enable(false);

    // Get accountId as an observable
    this.accountId$ = this.route.paramMap.pipe(
      map((params) => params.get("accountId")),
      filter((accountId): accountId is string => accountId !== null),
      shareReplay(1),
    );

    // Dispatch action to load the account when accountId is available
    this.accountId$.subscribe((accountId) => {
      this.store.dispatch(AccountActions.loadAccount({accountId}));
    });

    // Select the account loading state
    this.loading$ = this.store.select(selectAccountLoading);

    // Select the account from the store
    this.account$ = this.accountId$.pipe(
      switchMap((accountId) => this.store.select(selectAccountById(accountId))),
    );

    // For registration page, show content immediately after initial setup
    // Use a timeout to give the observables time to initialize
    this.isDataReady$ = this.accountId$.pipe(
      map(() => true), // Once we have accountId, we're ready
      startWith(false), // Brief initial loading state
    );
  }

  ngOnDestroy() {
    // Re-enable the menu when leaving the registration page
    this.menuCtrl.enable(true);
  }

  ionViewWillEnter() {
    // Default Meta Tags
    this.metaService.updateMetaTags(
      "Registration | ASCENDynamics NFP",
      "Create your account and join the ASCENDynamics NFP community today.",
      "registration, sign up, volunteer, nonprofits",
      {
        title: "Registration | ASCENDynamics NFP",
        description:
          "Sign up for ASCENDynamics NFP to explore and connect with impactful opportunities.",
        url: "https://app.ASCENDynamics.org/registration",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: "Join ASCENDynamics NFP",
        description:
          "Sign up to connect with meaningful opportunities and start making a difference.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
  }

  ionViewWillLeave() {
    // Re-enable the menu when leaving the registration page
    this.menuCtrl.enable(true);
  }

  selectType(type: "user" | "group") {
    // Reload account data when user selects a type to ensure fresh data is available
    // Only if accountId$ is initialized
    if (this.accountId$) {
      this.accountId$.pipe(take(1)).subscribe((accountId) => {
        if (accountId) {
          this.store.dispatch(AccountActions.loadAccount({accountId}));
        }
      });
    }

    this.selectedType = type;
  }
}
