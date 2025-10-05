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
import {ActivatedRoute, Router} from "@angular/router";
import {Account} from "../../../../../../shared/models/account.model";
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
  private accountId$!: Observable<string>;

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute,
    private router: Router,
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

    // Auto-select type if it has been set earlier (e.g., during signup)
    this.account$
      .pipe(filter((a): a is Account => !!a))
      .subscribe((account) => {
        if (
          this.selectedType === "" &&
          (account.type === "user" || account.type === "group")
        ) {
          this.selectedType = account.type;
        }
      });

    // Check if user has completed registration and redirect if needed
    this.checkRegistrationStatus();
  }

  private checkRegistrationStatus() {
    this.account$
      .pipe(
        filter((account) => !!account),
        take(1),
      )
      .subscribe((account) => {
        // Only auto-redirect when it's reasonably clear that the user
        // completed registration (not just picked a type).
        const hasNonDefaultTagline =
          !!account?.tagline && account.tagline !== "New and looking to help!";
        if (
          account &&
          account.type &&
          account.type !== "new" &&
          hasNonDefaultTagline
        ) {
          this.router.navigate(["/account", account.id], {replaceUrl: true});
        }
      });
  }

  ngOnDestroy() {
    // Re-enable the menu when leaving the registration page
    this.menuCtrl.enable(true);
  }

  ionViewWillEnter() {
    // Enhanced Meta Tags with better descriptions
    this.metaService.updateMetaTags(
      "Complete Your Registration | ASCENDynamics NFP",
      "Join the ASCENDynamics NFP community. Create your profile and start making a difference today.",
      "registration, volunteer, nonprofit, community, social impact",
      {
        title: "Complete Your Registration | ASCENDynamics NFP",
        description:
          "Create your ASCENDynamics NFP profile and connect with meaningful opportunities to make a positive impact.",
        url: "https://ascendynamics.org/registration",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Fregistration-og.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: "Join ASCENDynamics NFP Community",
        description:
          "Create your profile and start connecting with impactful volunteer opportunities.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Fregistration-twitter.png?alt=media",
      },
    );
  }

  ionViewWillLeave() {
    // Re-enable the menu when leaving the registration page
    this.menuCtrl.enable(true);
  }

  selectType(type: "user" | "group") {
    // Enhanced type selection with smooth scroll to form
    this.selectedType = type;

    // Reload account data when user selects a type to ensure fresh data is available
    if (this.accountId$) {
      this.accountId$.pipe(take(1)).subscribe((accountId) => {
        if (accountId) {
          this.store.dispatch(AccountActions.loadAccount({accountId}));
        }
      });
    }

    // Smooth scroll to form section after a brief delay
    setTimeout(() => {
      const formSection = document.querySelector(".form-section");
      if (formSection) {
        formSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 300);
  }

  resetSelection() {
    // Allow users to change their account type selection
    this.selectedType = "";

    // Scroll back to top with smooth animation
    setTimeout(() => {
      const typeSelection = document.querySelector(".type-selection");
      if (typeSelection) {
        typeSelection.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  }

  // Add success feedback when registration completes
  onRegistrationSuccess() {
    // This could be called from the unified registration component
    // Add success animation or feedback here
    console.log("Registration completed successfully!");
  }
}
