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
import {AccessService} from "../../../../core/services/access.service";
import {AccountSectionsService} from "../../services/account-sections.service";
import {ProfessionalInformation} from "@shared/models/account.model";
import {PrivacyService} from "../../../../core/services/privacy.service";

import {environment} from "../../../../../environments/environment";
@Component({
  standalone: false,
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
  isOwnerOrAdmin$!: Observable<boolean>;
  professionalInfo$!: Observable<ProfessionalInformation | null>;
  laborRights$!: Observable<any | null>;
  canViewProfessional$!: Observable<boolean>;
  canViewLabor$!: Observable<boolean>;
  canViewConnections$!: Observable<boolean>;
  canViewOrganizations$!: Observable<boolean>;

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastController: ToastController,
    private store: Store,
    private access: AccessService,
    private sections: AccountSectionsService,
    private privacy: PrivacyService,
  ) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(selectAuthUser);
    // Wire up all observables from the route snapshot so the first template
    // render has every permission stream ready — segment tabs appear immediately
    // rather than waiting for ionViewWillEnter to fire asynchronously.
    const snapshotId = this.route.snapshot.paramMap.get("accountId");
    if (snapshotId) {
      this.accountId = snapshotId;
      this.initObservables(snapshotId);
    }
  }

  ionViewWillEnter() {
    this.authUser$ = this.store.select(selectAuthUser);

    // Subscribe to route paramMap to detect in-place navigation to a different
    // account (e.g. clicking a related account link without leaving the page).
    this.route.paramMap.subscribe((params) => {
      const newId = params.get("accountId");
      if (!newId) return;

      const idChanged = newId !== this.accountId;
      this.accountId = newId;

      // Always dispatch to refresh data from Firestore.
      this.store.dispatch(AccountActions.loadAccount({accountId: newId}));
      this.store.dispatch(
        AccountActions.loadRelatedAccounts({accountId: newId}),
      );
      this.store.dispatch(
        AccountActions.loadRelatedListings({accountId: newId}),
      );

      // Only re-wire observables when the account ID actually changes.
      // On back-navigation to the same profile the ID is unchanged, so skipping
      // this avoids NG0100 caused by async-pipe re-subscription mid-CD cycle.
      if (idChanged) {
        this.initObservables(newId);
      }

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
          this.presentToast("This profile is private.");
        }
      });
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

  // Helper methods for template
  hasAllowlists(badges: any[]): boolean {
    return badges?.some((x) => x.allowCount > 0) ?? false;
  }

  hasBlocklists(badges: any[]): boolean {
    return badges?.some((x) => x.blockCount > 0) ?? false;
  }

  /** Wire up all derived observables for a given accountId.
   *  Called from ngOnInit (snapshot) so segment tabs are ready on first render,
   *  and from ionViewWillEnter only when the account ID actually changes. */
  private initObservables(accountId: string): void {
    this.account$ = this.store.select(selectAccountById(accountId));
    this.error$ = this.store.select(selectAccountError);
    this.relatedAccounts$ = this.store.select(
      selectRelatedAccountsByAccountId(accountId),
    );
    this.professionalInfo$ = this.sections.professionalInfo$(accountId);
    this.laborRights$ = this.sections.laborRights$(accountId);

    this.isProfileOwner$ = combineLatest([this.authUser$, this.account$]).pipe(
      map(([authUser, account]) =>
        this.access.isOwner(account as any, authUser),
      ),
    );

    this.isGroupAdmin$ = combineLatest([this.authUser$, this.account$]).pipe(
      map(([currentUser, account]) =>
        this.access.isGroupAdmin(account as any, currentUser),
      ),
    );

    this.isGroupMember$ = combineLatest([
      this.authUser$,
      this.relatedAccounts$,
      this.account$,
    ]).pipe(
      map(([currentUser, relatedAccounts, account]) => {
        if (!currentUser) return false;
        const owner = this.access.isOwner(account as any, currentUser);
        const member = this.access.isAcceptedMember(
          relatedAccounts,
          currentUser.uid,
        );
        return owner || member;
      }),
    );

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

    this.isOwnerOrAdmin$ = combineLatest([
      this.isProfileOwner$,
      this.isGroupAdmin$,
    ]).pipe(map(([own, admin]) => own || admin));

    this.relatedListings$ = combineLatest([
      this.store.select(selectRelatedListingsByAccountId(accountId)),
      this.isProfileOwner$,
      this.isGroupAdmin$,
    ]).pipe(
      map(([listings, isOwner, isAdmin]) =>
        listings.filter((listing) => {
          const isSaved = (listing as any).isSaved === true;
          if (!isSaved && listing.status !== "active") return false;
          if (listing.relationship === "applicant" && !isOwner && !isAdmin) {
            return false;
          }
          return true;
        }),
      ),
    );

    const privacyStream = (section: string) =>
      combineLatest([
        this.account$,
        this.isOwnerOrAdmin$,
        this.hasRelationship$,
        this.authUser$,
      ]).pipe(
        map(([acc, ownOrAdmin, related, user]) =>
          acc
            ? this.privacy.canViewSection(acc.privacySettings, section, {
                isOwnerOrAdmin: ownOrAdmin,
                isAuthenticated: !!user?.uid,
                isRelated: related,
                viewerId: user?.uid ?? null,
              })
            : false,
        ),
      );

    this.canViewProfessional$ = privacyStream("professionalInformation");
    this.canViewLabor$ = privacyStream("laborRights");
    this.canViewConnections$ = privacyStream("userList");
    this.canViewOrganizations$ = privacyStream("organizationList");
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
        url: `${environment.appBaseUrl}/account/${account.id}`,
        image: account.iconImage || "/assets/image/icon-512x512.png",
      },
      {
        card: "summary_large_image",
        title: `${account.name}`,
        description: descriptionPrefix,
        image: account.iconImage || "/assets/image/icon-512x512.png",
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
        url: `${environment.appBaseUrl}/account/${account.id}`,
        image: account.iconImage || "/assets/image/icon-512x512.png",
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
        url: `${environment.appBaseUrl}/account/${account.id}`,
        logo: account.iconImage || "/assets/image/icon-512x512.png",
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
        url: environment.appBaseUrl,
        image: "/assets/image/icon-512x512.png",
      },
      {
        card: "summary",
        title: "Profile | ASCENDynamics NFP",
        description:
          "Customize your profile and stay connected with your community.",
        image: "/assets/image/icon-512x512.png",
      },
    );

    // Add structured data for default profile page
    this.metaService.addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Profile | ASCENDynamics NFP",
      description:
        "View and manage your profile details, volunteering history, and preferences on ASCENDynamics NFP.",
      url: `${environment.appBaseUrl}/profile`,
      isPartOf: {
        "@type": "WebSite",
        name: "ASCENDynamics NFP",
        url: environment.appBaseUrl,
      },
      potentialAction: {
        "@type": "ViewAction",
        target: `${environment.appBaseUrl}/profile`,
      },
    });
  }

  // Map visibility to display text and badge color
  private mapVisibility(v: string): {text: string; color: string} {
    const map: Record<string, {text: string; color: string}> = {
      public: {text: "Public", color: "success"},
      authenticated: {text: "Authenticated", color: "medium"},
      related: {text: "Related", color: "primary"},
      groups: {text: "Groups", color: "tertiary"},
      friends: {text: "Friends", color: "tertiary"},
      members: {text: "Members", color: "tertiary"},
      partners: {text: "Partners", color: "tertiary"},
      admins: {text: "Admins", color: "warning"},
      custom: {text: "Custom", color: "dark"},
    };
    return map[v] || {text: v, color: "medium"};
  }
}
