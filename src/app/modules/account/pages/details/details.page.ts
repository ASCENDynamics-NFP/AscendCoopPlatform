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
import {Location} from "@angular/common";
import {map} from "rxjs/operators";
import {AuthUser} from "@shared/models/auth-user.model";
import {Store} from "@ngrx/store";
import {Account, RelatedAccount} from "@shared/models/account.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectRelatedAccountsByAccountId,
  selectAccountById,
  selectRelatedListingsByAccountId,
} from "../../../../state/selectors/account.selectors";
import {selectAccountError} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {IonContent, ViewWillEnter, ToastController} from "@ionic/angular";
import {RelatedListing} from "@shared/models/related-listing.model";
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
  account$!: Observable<Account | undefined>;
  private subscription: Subscription | null = null;
  private errorSubscription: Subscription | null = null;
  relatedAccounts$!: Observable<RelatedAccount[]>;
  relatedListings$!: Observable<RelatedListing[]>;
  isProfileOwner$!: Observable<boolean>;
  isGroupAdmin$!: Observable<boolean>;
  isGroupMember$!: Observable<boolean>;
  relationshipStatus$!: Observable<string | null>;
  hasRelationship$!: Observable<boolean>;
  error$!: Observable<any>;
  selectedSegment: string = "profile";

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastController: ToastController,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(selectAuthUser);
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

        this.error$ = this.store.select(selectAccountError);

        // Handle account load errors
        if (this.errorSubscription) {
          this.errorSubscription.unsubscribe();
        }
        this.errorSubscription = combineLatest([
          this.error$,
          this.authUser$,
        ]).subscribe(([err, authUser]) => {
          if (
            err &&
            err === "Account not found" &&
            authUser &&
            authUser.uid &&
            this.accountId !== authUser.uid
          ) {
            this.presentToast("Account not found", true);
          } else if (err) {
            // Only show "private profile" message if viewing someone else's profile
            this.presentToast("This profile is private.");
          }
          // If it's their own profile with an error, let the AuthGuard handle the redirect
        });

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

        this.isGroupAdmin$ = combineLatest([
          this.authUser$,
          this.relatedAccounts$,
          this.account$,
        ]).pipe(
          map(([currentUser, relatedAccounts, account]) => {
            if (!currentUser) return false;
            const rel = relatedAccounts.find((ra) => ra.id === currentUser.uid);
            const isAdmin =
              rel?.status === "accepted" &&
              (rel.access === "admin" || rel.access === "moderator");
            const isOwner =
              account?.type === "group" &&
              account.createdBy === currentUser.uid;
            return isAdmin || isOwner;
          }),
        );

        this.isGroupMember$ = combineLatest([
          this.authUser$,
          this.relatedAccounts$,
          this.account$,
        ]).pipe(
          map(([currentUser, relatedAccounts, account]) => {
            if (!currentUser) return false;
            // Check if user is the group owner
            const isOwner =
              account?.type === "group" &&
              account.createdBy === currentUser.uid;
            // Check if user is an accepted member
            const rel = relatedAccounts.find((ra) => ra.id === currentUser.uid);
            const isMember = rel?.status === "accepted";
            return isOwner || isMember;
          }),
        );

        // Check current user's relationship status with this account
        this.relationshipStatus$ = combineLatest([
          this.authUser$,
          this.relatedAccounts$,
        ]).pipe(
          map(([currentUser, relatedAccounts]) => {
            if (!currentUser) return null;
            const rel = relatedAccounts.find((ra) => ra.id === currentUser.uid);
            return rel?.status || null;
          }),
        );

        // Check if current user has any relationship with this account
        this.hasRelationship$ = combineLatest([
          this.authUser$,
          this.relatedAccounts$,
        ]).pipe(
          map(([currentUser, relatedAccounts]) => {
            if (!currentUser) return false;
            const rel = relatedAccounts.find((ra) => ra.id === currentUser.uid);
            return rel !== undefined;
          }),
        );

        // Define relatedListings$ with privacy filtering after permission observables are set
        this.relatedListings$ = combineLatest([
          this.store.select(selectRelatedListingsByAccountId(this.accountId)),
          this.isProfileOwner$,
          this.isGroupAdmin$,
        ]).pipe(
          map(([listings, isOwner, isAdmin]) => {
            // Filter out applicant listings for non-authorized users
            const filteredListings = listings.filter((listing) => {
              // Keep active listings
              if (listing.status !== "active") return false;

              // For applicant listings, only show to owners/admins
              if (
                listing.relationship === "applicant" &&
                !isOwner &&
                !isAdmin
              ) {
                return false;
              }

              return true;
            });

            return filteredListings;
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
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
      this.errorSubscription = null;
    }
  }

  scrollToSection(sectionId: string): void {
    const yOffset = document.getElementById(sectionId)?.offsetTop;
    if (yOffset !== undefined) {
      this.content.scrollToPoint(0, yOffset, 500);
    }
  }

  onSegmentChange(event: any): void {
    this.selectedSegment = event.detail.value;
  }

  private async presentToast(message: string, navigateBack = false) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: "top",
    });
    await toast.present();
    if (navigateBack) {
      await toast.onDidDismiss();
      this.location.back();
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
        url: `https://ascendynamics.org/account/${account.id}`,
        image:
          account.iconImage ||
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: `${account.name}`,
        description: descriptionPrefix,
        image:
          account.iconImage ||
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );

    // Add structured data for profile/group pages
    if (account.type === "user") {
      this.metaService.addStructuredData({
        "@context": "https://schema.org",
        "@type": "Person",
        name: account.name,
        description:
          account.description ||
          `${account.name}'s profile on ASCENDynamics NFP`,
        url: `https://ascendynamics.org/account/${account.id}`,
        image:
          account.iconImage ||
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
        memberOf: {
          "@type": "Organization",
          name: "ASCENDynamics NFP",
        },
        knowsAbout: ["Volunteering", "Community Service", "Nonprofit Work"],
      });
    } else {
      this.metaService.addStructuredData({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: account.name,
        description:
          account.description ||
          `${account.name} organization on ASCENDynamics NFP`,
        url: `https://ascendynamics.org/account/${account.id}`,
        logo:
          account.iconImage ||
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
        parentOrganization: {
          "@type": "Organization",
          name: "ASCENDynamics NFP",
        },
        areaServed: "Global",
        knowsAbout: ["Volunteering", "Community Service", "Nonprofit Work"],
      });
    }
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
        url: "https://ascendynamics.org/",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "Profile | ASCENDynamics NFP",
        description:
          "Customize your profile and stay connected with your community.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );

    // Add structured data for default profile page
    this.metaService.addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Profile | ASCENDynamics NFP",
      description:
        "View and manage your profile details, volunteering history, and preferences on ASCENDynamics NFP.",
      url: "https://ascendynamics.org/profile",
      isPartOf: {
        "@type": "WebSite",
        name: "ASCENDynamics NFP",
        url: "https://ascendynamics.org",
      },
      potentialAction: {
        "@type": "ViewAction",
        target: "https://ascendynamics.org/profile",
      },
    });
  }
}
