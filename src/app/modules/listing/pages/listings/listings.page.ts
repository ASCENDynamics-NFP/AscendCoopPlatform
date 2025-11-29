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
// src/app/modules/listing/pages/listings/listings.page.ts

import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from "@angular/core";
import {Store} from "@ngrx/store";
import {
  Observable,
  Subject,
  Subscription,
  BehaviorSubject,
  combineLatest,
  map,
} from "rxjs";
import {InfiniteScrollCustomEvent, NavController} from "@ionic/angular";
import {Listing} from "@shared/models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {AdvancedFilters} from "../../../../state/actions/listings.actions";
import {AppState} from "../../../../state/app.state";
import {
  selectFilteredListings,
  selectLoading,
  selectError,
  selectAdvancedFilters,
  selectIsAdvancedSearchActive,
  selectHasMoreResults,
  selectAllListings,
} from "../../../../state/selectors/listings.selectors";
import {selectUserSkills} from "../../../../state/selectors/account.selectors";
import {AuthUser} from "@shared/models/auth-user.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {MetaService} from "../../../../core/services/meta.service";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {ListingFilterValues} from "../../components/listing-filter/listing-filter.component";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: "app-listings",
  templateUrl: "./listings.page.html",
  styleUrls: ["./listings.page.scss"],
})
export class ListingsPage implements OnInit, OnDestroy {
  listings$: Observable<Listing[]>;
  displayedListings$: Observable<Listing[]>;
  hasMoreListings$: Observable<boolean>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  authUser$: Observable<AuthUser | null>;
  userSkills$: Observable<string[]>;
  advancedFilters$: Observable<AdvancedFilters>;
  isAdvancedSearchActive$: Observable<boolean>;
  hasMoreResults$: Observable<boolean>;
  listingTypes = ["all", "volunteer", "job", "internship", "gig"];

  // View mode: list or map
  viewMode: "list" | "map" = "list";
  mapsLoaded = false;
  userLocation: {latitude: number; longitude: number} | null = null;

  // Filter panel state
  isFilterExpanded = false;
  activeFilterCount = 0;
  availableSkills: string[] = [
    "JavaScript",
    "TypeScript",
    "Angular",
    "React",
    "Node.js",
    "Python",
    "Java",
    "Project Management",
    "Marketing",
    "Fundraising",
    "Grant Writing",
    "Event Planning",
    "Social Media",
    "Graphic Design",
    "Data Analysis",
    "Community Outreach",
    "Teaching",
    "Mentoring",
  ];

  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  // Infinite scroll state
  private readonly itemsPerLoad = 12;
  private displayedCountSubject = new BehaviorSubject<number>(
    this.itemsPerLoad,
  );

  constructor(
    private metaService: MetaService,
    private navCtrl: NavController,
    private store: Store<AppState>,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.userSkills$ = this.store.select(selectUserSkills);
    this.listings$ = this.store.select(selectFilteredListings);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.advancedFilters$ = this.store.select(selectAdvancedFilters);
    this.isAdvancedSearchActive$ = this.store.select(
      selectIsAdvancedSearchActive,
    );
    this.hasMoreResults$ = this.store.select(selectHasMoreResults);

    // Display listings with infinite scroll - derived once from listings$ and displayedCount$
    this.displayedListings$ = combineLatest([
      this.listings$,
      this.displayedCountSubject,
    ]).pipe(map(([listings, count]) => listings.slice(0, count)));

    // Check if there are more listings to load - created once, not per change detection
    this.hasMoreListings$ = combineLatest([
      this.listings$,
      this.displayedCountSubject,
    ]).pipe(map(([listings, count]) => count < listings.length));
  }

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Volunteer Listings | ASCENDynamics NFP",
      "Explore volunteering opportunities available on ASCENDynamics NFP to make an impact in your community.",
      "volunteer listings, nonprofits, opportunities, community impact",
      {
        title: "Volunteer Listings | ASCENDynamics NFP",
        description:
          "Browse and apply for volunteer roles on ASCENDynamics NFP.",
        url: "https://ascendynamics.org/listings",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "Volunteer Listings | ASCENDynamics NFP",
        description:
          "Find opportunities to contribute and grow your skills with ASCENDynamics NFP.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );

    // Add structured data for volunteer listings page
    this.metaService.addStructuredData({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Volunteer Listings | ASCENDynamics NFP",
      description:
        "Explore volunteering opportunities available on ASCENDynamics NFP to make an impact in your community.",
      url: "https://ascendynamics.org/listings",
      isPartOf: {
        "@type": "WebSite",
        name: "ASCENDynamics NFP",
        url: "https://ascendynamics.org",
      },
      mainEntity: {
        "@type": "ItemList",
        name: "Volunteer Opportunities",
        description:
          "Browse and apply for volunteer roles with nonprofit organizations",
      },
    });
  }

  ngOnInit() {
    this.loadListings();
    this.searchSub = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.store.dispatch(ListingsActions.searchListings({query}));
      });
  }

  loadListings() {
    this.store.dispatch(ListingsActions.loadListings());
  }

  createListing() {
    this.navCtrl.navigateForward("/listings/create");
  }

  viewListing(id: string) {
    this.navCtrl.navigateForward(`/listings/${id}`);
  }

  filterListings(event: any) {
    const listingType = event.detail.value;
    this.store.dispatch(ListingsActions.filterListings({listingType}));
  }

  searchListings(event: any) {
    const query = event.detail.value;
    this.searchSubject.next(query);
  }

  doRefresh(event: any) {
    this.loadListings();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getListingLocation(listing: Listing): string {
    const primaryAddress = listing.contactInformation?.addresses?.[0];
    if (primaryAddress) {
      return `${primaryAddress.city}, ${primaryAddress.country}`;
    }
    return "Location not specified";
  }

  getIconForType(type: string): string {
    const iconMap: Record<string, string> = {
      volunteer: "people-outline",
      job: "briefcase-outline",
      event: "calendar-outline",
      project: "construct-outline",
      resource: "library-outline",
      service: "hand-right-outline",
      all: "apps-outline",
      internship: "school-outline",
      gig: "flash-outline",
    };

    return iconMap[type.toLowerCase()] || "help-outline";
  }

  /**
   * Load more listings for infinite scroll
   */
  loadMore(event: InfiniteScrollCustomEvent) {
    // Increment the displayed count. The reactive hasMoreListings$ observable will automatically
    // disable the infinite scroll when all items are displayed.
    this.displayedCountSubject.next(
      this.displayedCountSubject.value + this.itemsPerLoad,
    );
    event.target.complete();
  }

  onFilterChange(filterValues: ListingFilterValues) {
    const advancedFilters: AdvancedFilters = {
      location: filterValues.location,
      radiusKm: filterValues.radiusKm,
      skills: filterValues.skills,
      remote: filterValues.remote,
      hoursPerWeekMin: filterValues.hoursPerWeekMin,
      hoursPerWeekMax: filterValues.hoursPerWeekMax,
      limit: 20,
    };

    // Check if any filter is active
    const hasActiveFilters = !!(
      filterValues.location ||
      filterValues.radiusKm ||
      (filterValues.skills && filterValues.skills.length > 0) ||
      filterValues.remote ||
      filterValues.hoursPerWeekMin ||
      filterValues.hoursPerWeekMax
    );

    if (hasActiveFilters) {
      this.store.dispatch(
        ListingsActions.advancedSearchListings({filters: advancedFilters}),
      );
    } else {
      // If no filters, clear and load all listings
      this.store.dispatch(ListingsActions.clearAdvancedFilters());
      this.store.dispatch(ListingsActions.loadListings());
    }

    // Reset infinite scroll
    this.resetInfiniteScroll();
  }

  /**
   * Reset infinite scroll to initial state
   */
  resetInfiniteScroll() {
    this.displayedCountSubject.next(this.itemsPerLoad);
  }

  onFilterExpandedChange(expanded: boolean) {
    this.isFilterExpanded = expanded;
  }

  toggleFilter() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  onActiveFilterCountChange(count: number) {
    this.activeFilterCount = count;
  }

  loadMoreResults() {
    this.store.dispatch(ListingsActions.loadMoreListings());
  }

  toggleViewMode() {
    if (this.viewMode === "list") {
      this.viewMode = "map";
      if (!this.mapsLoaded) {
        this.loadGoogleMaps();
      }
    } else {
      this.viewMode = "list";
    }
  }

  private loadGoogleMaps() {
    // Check if already loaded
    if (typeof google !== "undefined" && google.maps) {
      this.mapsLoaded = true;
      this.cdr.detectChanges();
      return;
    }

    const apiKey = environment.googleMapsApiKey;
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      console.warn("Google Maps API key not configured");
      this.mapsLoaded = true; // Still show map component (will show error state)
      this.cdr.detectChanges();
      return;
    }

    // Dynamically load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.ngZone.run(() => {
        this.mapsLoaded = true;
        this.cdr.detectChanges();
      });
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps");
      this.ngZone.run(() => {
        this.mapsLoaded = true; // Show error state
        this.cdr.detectChanges();
      });
    };
    document.head.appendChild(script);
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }
}
