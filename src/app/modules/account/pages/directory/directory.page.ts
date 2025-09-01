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
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {BehaviorSubject, Observable, Subject, combineLatest, of} from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import {Account} from "@shared/models/account.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectFilteredAccounts,
  selectFilteredAccountsWithPrivacy,
  selectAccountLoading,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

type DirectoryType = "all" | "user" | "group";

@Component({
  selector: "app-directory",
  templateUrl: "./directory.page.html",
  styleUrls: ["./directory.page.scss"],
})
export class DirectoryPage implements OnInit {
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

  // Pagination
  pageSize = 12;
  currentPage$ = new BehaviorSubject<number>(1);
  totalItems$!: Observable<number>;
  paginated$!: Observable<Account[]>;
  private relStatusMap = new Map<
    string,
    "pending" | "accepted" | "blocked" | "declined"
  >();
  private relationships$!: Observable<any[]>;

  constructor(
    private store: Store,
    private router: Router,
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
    this.relationships$.subscribe((rels: any[]) => {
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

    // Total count and page slice
    this.totalItems$ = combined$.pipe(map((arr) => arr.length));
    this.paginated$ = combineLatest([combined$, this.currentPage$]).pipe(
      map(([arr, page]) => {
        const start = (page - 1) * this.pageSize;
        return arr.slice(start, start + this.pageSize);
      }),
    );
  }

  search(ev: CustomEvent) {
    // @ts-ignore - target typed as any from ionic event
    const value = (ev?.detail?.value || ev?.target?.value || "").toString();
    this.searchedValue = value;
    this.searchTerms.next(value);
    this.currentPage$.next(1);
  }

  setType(type: DirectoryType | undefined | null) {
    const norm: DirectoryType =
      type === "user" || type === "group" || type === "all" ? type : "all";
    this.type$.next(norm);
    this.currentPage$.next(1);
  }

  togglePrivateGroups(v: boolean) {
    this.includePrivateGroups$.next(v);
    this.currentPage$.next(1);
  }

  toggleMyGroups(v: boolean) {
    this.onlyMyGroups$.next(v);
    this.currentPage$.next(1);
  }

  toggleMyConnections(v: boolean) {
    this.onlyMyConnections$.next(v);
    this.currentPage$.next(1);
  }

  setSort(v: "name-asc" | "name-desc") {
    this.sort$.next(v);
    this.currentPage$.next(1);
  }

  goToPage(p: number) {
    this.currentPage$.next(p);
  }

  openAccount(acc: Account) {
    if (acc?.id) this.router.navigate(["/account", acc.id]);
  }

  getRelStatus(id?: string | null): "accepted" | "pending" | undefined {
    if (!id) return undefined;
    const s = this.relStatusMap.get(id as string);
    return s === "accepted" || s === "pending" ? s : undefined;
  }
}
