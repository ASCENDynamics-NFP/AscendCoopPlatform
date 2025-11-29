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
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from "@angular/core";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {BehaviorSubject, Observable, Subject, combineLatest, of} from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import {Account} from "@shared/models/account.model";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectFilteredAccounts,
  selectFilteredAccountsWithPrivacy,
  selectAccountLoading,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {DirectoryFilterValues} from "../../components/directory-filter/directory-filter.component";
import {environment} from "../../../../../environments/environment";

type DirectoryType = "all" | "user" | "group";

@Component({
  selector: "app-directory",
  templateUrl: "./directory.page.html",
  styleUrls: ["./directory.page.scss"],
})
export class DirectoryPage implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  authUserId$ = this.store
    .select(selectAuthUser)
    .pipe(map((u) => u?.uid || null));

  // Filters
  searchTerms = new Subject<string>();
  searchedValue = "";
  type$ = new BehaviorSubject<DirectoryType>("all");
  includePrivateGroups$ = new BehaviorSubject<boolean>(true); // show groups I'm a member of
  onlyMyGroups$ = new BehaviorSubject<boolean>(false);
  onlyMyConnections$ = new BehaviorSubject<boolean>(false);
  sort$ = new BehaviorSubject<"name-asc" | "name-desc">("name-asc");

  // Filter panel state
  isFilterExpanded = false;
  activeFilterCount = 0;

  // View mode: list or map
  viewMode: "list" | "map" = "list";
  mapsLoaded = false;
  userLocation: {latitude: number; longitude: number} | null = null;

  // Infinite scroll
  private readonly itemsPerLoad = 12;
  readonly skeletonItems = Array.from({length: this.itemsPerLoad});
  private displayedCountSubject = new BehaviorSubject<number>(
    this.itemsPerLoad,
  );
  private allItems$!: Observable<Account[]>;
  hasMoreItems$!: Observable<boolean>;
  totalItems$!: Observable<number>;
  paginated$!: Observable<Account[]>;
  // All items for the map (only groups)
  allOrganizations$!: Observable<Account[]>;
  private relStatusMap = new Map<
    string,
    "pending" | "accepted" | "blocked" | "declined"
  >();
  private relationships$!: Observable<any[]>;
  private destroy$ = new Subject<void>();
  private mapsCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private store: Store,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading$ = this.store.select(selectAccountLoading);
  }

  ngOnInit() {
    // Ensure accounts are loaded
    this.store.dispatch(AccountActions.loadAccounts());

    // Track relationships for status icons/filters
    this.relationships$ = this.authUserId$.pipe(
      switchMap((uid) =>
        uid ? this.store.select(selectRelatedAccountsByAccountId(uid)) : of([]),
      ),
    );
    this.relationships$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rels: any[]) => {
        const m = new Map<string, any>();
        (rels || []).forEach((r) => m.set(r.id, r.status));
        this.relStatusMap = m as any;
      });

    const term$ = this.searchTerms.pipe(
      startWith(this.searchedValue),
      debounceTime(300),
      distinctUntilChanged(),
    );

    const combined$ = combineLatest([
      term$,
      this.type$,
      this.includePrivateGroups$,
      this.authUserId$,
      this.onlyMyGroups$,
      this.onlyMyConnections$,
      this.sort$,
    ]).pipe(
      map(
        ([
          term,
          type,
          includePrivateGroups,
          uid,
          onlyMyGroups,
          onlyMyConnections,
          sort,
        ]) => {
          const users$ = this.store.select(
            selectFilteredAccountsWithPrivacy(term, "user", uid),
          );

          // Groups selector depends on privacy toggle
          const groups$ = includePrivateGroups
            ? this.store.select(
                selectFilteredAccountsWithPrivacy(term, "group", uid),
              )
            : this.store.select(selectFilteredAccounts(term, "group"));

          const related$ = uid
            ? this.store.select(selectRelatedAccountsByAccountId(uid))
            : of([]);

          return combineLatest([users$, groups$, related$]).pipe(
            map(([users, groups, related]) => {
              // Relationship maps for quick lookup
              const relAcceptedIds = new Set(
                (related as any[])
                  .filter((r) => r?.status === "accepted")
                  .map((r) => r.id),
              );

              // Relationship-based filtering
              const usersFiltered = onlyMyConnections
                ? users.filter((u) => relAcceptedIds.has(u.id))
                : users;
              const groupsFiltered = onlyMyGroups
                ? groups.filter((g) => relAcceptedIds.has(g.id))
                : groups;

              // Merge or pick based on type
              switch (type) {
                case "user":
                  return usersFiltered;
                case "group":
                  return groupsFiltered;
                default: {
                  // In All mode, respect exclusive toggles
                  const onlyGroups = onlyMyGroups && !onlyMyConnections;
                  const onlyConns = onlyMyConnections && !onlyMyGroups;
                  if (onlyGroups) return groupsFiltered;
                  if (onlyConns) return usersFiltered;
                  // Otherwise include both
                  return [...usersFiltered, ...groupsFiltered];
                }
              }
            }),
          );
        },
      ),
      // flatten
      switchMap((inner$) => inner$),
      map((arr) => {
        if (this.sort$.getValue() === "name-desc") {
          return [...arr].sort((a, b) =>
            (b.name || "").localeCompare(a.name || ""),
          );
        }
        return [...arr].sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        );
      }),
    );

    // Store all items for infinite scroll
    this.allItems$ = combined$;

    // Total count
    this.totalItems$ = combined$.pipe(map((arr) => arr.length));

    // Displayed items with infinite scroll
    this.paginated$ = combineLatest([
      combined$,
      this.displayedCountSubject,
    ]).pipe(map(([arr, count]) => arr.slice(0, count)));

    // Check if there are more items to load
    this.hasMoreItems$ = combineLatest([
      combined$,
      this.displayedCountSubject,
    ]).pipe(map(([arr, count]) => count < arr.length));

    // All organizations for the map (filtered to only groups)
    this.allOrganizations$ = combined$.pipe(
      map((arr) => arr.filter((acc) => acc.type === "group")),
    );
  }

  search(ev: CustomEvent) {
    // @ts-ignore - target typed as any from ionic event
    const value = (ev?.detail?.value || ev?.target?.value || "").toString();
    this.searchedValue = value;
    this.searchTerms.next(value);
    this.resetInfiniteScroll();
  }

  setType(type: DirectoryType | undefined | null) {
    const norm: DirectoryType =
      type === "user" || type === "group" || type === "all" ? type : "all";
    this.type$.next(norm);
    this.resetInfiniteScroll();
  }

  togglePrivateGroups(v: boolean) {
    this.includePrivateGroups$.next(v);
    this.resetInfiniteScroll();
  }

  toggleMyGroups(v: boolean) {
    this.onlyMyGroups$.next(v);
    this.resetInfiniteScroll();
  }

  toggleMyConnections(v: boolean) {
    this.onlyMyConnections$.next(v);
    this.resetInfiniteScroll();
  }

  setSort(v: "name-asc" | "name-desc") {
    this.sort$.next(v);
    this.resetInfiniteScroll();
  }

  /**
   * Load more items for infinite scroll
   */
  loadMore(event: InfiniteScrollCustomEvent) {
    this.displayedCountSubject.next(
      this.displayedCountSubject.value + this.itemsPerLoad,
    );
    event.target.complete();
  }

  /**
   * Reset infinite scroll to initial state
   */
  private resetInfiniteScroll() {
    this.displayedCountSubject.next(this.itemsPerLoad);
  }

  openAccount(acc: Account) {
    if (acc?.id) this.router.navigate(["/account", acc.id]);
  }

  getRelStatus(id?: string | null): "accepted" | "pending" | undefined {
    if (!id) return undefined;
    const s = this.relStatusMap.get(id as string);
    return s === "accepted" || s === "pending" ? s : undefined;
  }

  getTypeBadgeLabel(type: string): string {
    return type === "group" ? "directory.groups" : "directory.users";
  }

  // Filter panel methods
  toggleFilter() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  onFilterChange(filterValues: DirectoryFilterValues) {
    this.includePrivateGroups$.next(filterValues.includePrivateGroups);
    this.onlyMyGroups$.next(filterValues.onlyMyGroups);
    this.onlyMyConnections$.next(filterValues.onlyMyConnections);
    this.sort$.next(filterValues.sort);
    this.resetInfiniteScroll();
  }

  onFilterExpandedChange(expanded: boolean) {
    this.isFilterExpanded = expanded;
  }

  onActiveFilterCountChange(count: number) {
    this.activeFilterCount = count;
  }

  // Map view methods
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Clear maps loading interval if still running
    if (this.mapsCheckInterval) {
      clearInterval(this.mapsCheckInterval);
      this.mapsCheckInterval = null;
    }
  }

  private loadGoogleMaps() {
    // Check if already loaded
    if (typeof google !== "undefined" && google.maps) {
      this.mapsLoaded = true;
      this.cdr.detectChanges();
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script is loading, wait for it
      this.mapsCheckInterval = setInterval(() => {
        if (typeof google !== "undefined" && google.maps) {
          if (this.mapsCheckInterval) {
            clearInterval(this.mapsCheckInterval);
            this.mapsCheckInterval = null;
          }
          this.ngZone.run(() => {
            this.mapsLoaded = true;
            this.cdr.detectChanges();
          });
        }
      }, 100);
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

  viewOrganization(id: string) {
    this.router.navigate(["/account", id]);
  }
}
