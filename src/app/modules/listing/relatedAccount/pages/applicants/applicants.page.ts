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
// src/app/modules/listing/relatedAccount/pages/applicants/applicants.page.ts

import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  take,
  of,
  switchMap,
  catchError,
} from "rxjs";
import {
  ListingRelatedAccount,
  ApplicationStatus,
} from "@shared/models/listing-related-account.model";
import {AppState} from "../../../../../state/app.state";
import * as ListingsActions from "../../../../../state/actions/listings.actions";
import {
  selectListingById,
  selectRelatedAccountsByListingId,
  selectRelatedAccountsByStatus,
  selectSelectedApplicantIds,
  selectSelectedApplicantsCount,
} from "../../../../../state/selectors/listings.selectors";
import {ActivatedRoute, Router} from "@angular/router";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {Listing} from "@shared/models/listing.model";
import {ModalController, ToastController} from "@ionic/angular";
import {ApplicantDetailsModalComponent} from "./components/applicant-details-modal/applicant-details-modal.component";
import {MetaService} from "../../../../../core/services/meta.service";
import {selectAccountById} from "../../../../../state/selectors/account.selectors";
import {AccessService} from "../../../../../core/services/access.service";
import {filter} from "rxjs/operators";

@Component({
  selector: "app-applicants",
  templateUrl: "./applicants.page.html",
  styleUrls: ["./applicants.page.scss"],
})
export class ApplicantsPage implements OnInit {
  relatedAccounts$: Observable<ListingRelatedAccount[]> = new Observable();
  accountsByStatus$!: Observable<
    Record<ApplicationStatus, ListingRelatedAccount[]>
  >;
  paginatedAccounts$!: Observable<ListingRelatedAccount[]>;
  currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();
  pageSize = 20; // Items per page
  maxVisiblePages = 5; // Max visible page numbers

  // View mode: list or pipeline
  viewMode: "list" | "pipeline" = "list";

  // Bulk selection
  selectedApplicantIds$!: Observable<string[]>;
  selectedCount$!: Observable<number>;

  totalItems$!: Observable<number>;
  totalPages$!: Observable<number>;
  pageNumbers$!: Observable<number[]>;
  currentPageStart$!: Observable<number>;
  currentPageEnd$!: Observable<number>;

  pagination$!: Observable<{
    currentPage: number;
    totalPages: number;
    pageNumbers: number[];
  }>;

  currentPageRange$!: Observable<{
    start: number;
    end: number;
    total: number;
  }>;

  loading$: Observable<boolean> = new Observable();
  error$: Observable<string | null> = new Observable();
  listingId: string = "";
  listing$: Observable<Listing> = new Observable();
  isOwner$: Observable<boolean> = new Observable();

  constructor(
    private metaService: MetaService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
    private access: AccessService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.listingId = this.route.snapshot.paramMap.get("id") || "";

    if (this.listingId) {
      this.store.dispatch(
        ListingsActions.loadListingById({id: this.listingId}),
      );

      this.store.dispatch(
        ListingsActions.loadListingRelatedAccounts({
          listingId: this.listingId,
        }),
      );

      this.relatedAccounts$ = this.store.select(
        selectRelatedAccountsByListingId(this.listingId),
      );

      // Pipeline view data
      this.accountsByStatus$ = this.store.select(
        selectRelatedAccountsByStatus(this.listingId),
      );

      // Bulk selection
      this.selectedApplicantIds$ = this.store.select(
        selectSelectedApplicantIds,
      );
      this.selectedCount$ = this.store.select(selectSelectedApplicantsCount);

      this.loading$ = this.store.select((state) => state.listings.loading);
      this.error$ = this.store.select((state) => state.listings.error);

      this.listing$ = this.store
        .select(selectListingById(this.listingId))
        .pipe(filter((listing): listing is Listing => listing !== undefined));

      // Determine if current user is the listing owner or admin of owner account
      const ownerAccount$ = this.listing$.pipe(
        map((l) => l?.ownerAccountId),
        switchMap((ownerId) =>
          ownerId
            ? this.store
                .select(selectAccountById(ownerId))
                .pipe(catchError(() => of(undefined)))
            : of(undefined),
        ),
      );
      this.isOwner$ = combineLatest([
        this.store.select(selectAuthUser),
        this.listing$,
        ownerAccount$,
      ]).pipe(
        map(([user, listing, ownerAccount]) =>
          this.access.isListingOwner(listing, user, ownerAccount as any),
        ),
      );
    }

    // Default Meta Tags
    this.metaService.updateMetaTags(
      "Listing Applicants | ASCENDynamics NFP",
      "View and manage applicants for your listing on ASCENDynamics NFP.",
      "listing, applicants, volunteer, nonprofits",
      {
        title: "Listing Applicants | ASCENDynamics NFP",
        description:
          "Review and manage all applicants for your listing to find the right candidates.",
        url: "https://ascendynamics.org/listing/applicants",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: "Listing Applicants",
        description: "Manage applicants for your listing on ASCENDynamics NFP.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );

    this.setPaginationCalculations();
  }

  setPaginationCalculations() {
    // Calculate total items dynamically
    this.totalItems$ = this.relatedAccounts$.pipe(
      map((accounts) => accounts.length),
    );

    // Calculate total pages
    this.totalPages$ = this.totalItems$.pipe(
      map((totalItems) => Math.ceil(totalItems / this.pageSize)),
    );

    // Generate paginated accounts
    this.paginatedAccounts$ = combineLatest([
      this.relatedAccounts$,
      this.currentPage$,
    ]).pipe(
      map(([accounts, currentPage]) => {
        const startIndex = (currentPage - 1) * this.pageSize;
        return accounts.slice(startIndex, startIndex + this.pageSize);
      }),
    );

    // Generate page numbers
    this.pageNumbers$ = combineLatest([
      this.currentPage$,
      this.totalPages$,
    ]).pipe(
      map(([currentPage, totalPages]) => {
        let startPage = Math.max(
          1,
          currentPage - Math.floor(this.maxVisiblePages / 2),
        );
        let endPage = startPage + this.maxVisiblePages - 1;
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
        }
        return Array.from(
          {length: endPage - startPage + 1},
          (_, i) => startPage + i,
        );
      }),
    );

    // Calculate start and end indices for the current page
    this.currentPageStart$ = combineLatest([
      this.currentPage$,
      this.totalItems$,
    ]).pipe(
      map(([currentPage, totalItems]) => {
        const start = (currentPage - 1) * this.pageSize + 1;
        return Math.min(start, totalItems);
      }),
    );

    this.currentPageEnd$ = combineLatest([
      this.currentPage$,
      this.totalItems$,
    ]).pipe(
      map(([currentPage, totalItems]) =>
        Math.min(currentPage * this.pageSize, totalItems),
      ),
    );

    // Combine pagination observables
    this.pagination$ = combineLatest([
      this.currentPage$,
      this.totalPages$,
      this.pageNumbers$,
    ]).pipe(
      map(([currentPage, totalPages, pageNumbers]) => ({
        currentPage,
        totalPages,
        pageNumbers,
      })),
    );

    // Combine current page range observables
    this.currentPageRange$ = combineLatest([
      this.currentPageStart$,
      this.currentPageEnd$,
      this.totalItems$,
    ]).pipe(map(([start, end, total]) => ({start, end, total})));
  }

  async openApplicantDetailsModal(account: ListingRelatedAccount) {
    combineLatest([this.isOwner$, this.store.select(selectAuthUser)])
      .pipe(take(1))
      .subscribe(([isOwner, authUser]) => {
        // Check if user is owner or if it's their own account
        if (isOwner && authUser && authUser.uid !== account.id) {
          this.openModal(account, isOwner);
        } else {
          this.router.navigate(["/account", account.id]);
        }
      });
  }

  async openModal(relatedAccount: ListingRelatedAccount, isOwner: boolean) {
    const modal = await this.modalController.create({
      component: ApplicantDetailsModalComponent,
      componentProps: {relatedAccount, isOwner},
    });
    await modal.present();
  }

  goToPage(pageNumber: number) {
    this.currentPageSubject.next(pageNumber);
  }

  nextPage() {
    this.currentPage$.pipe(take(1)).subscribe((currentPage) => {
      this.currentPageSubject.next(currentPage + 1);
    });
  }

  previousPage() {
    this.currentPage$.pipe(take(1)).subscribe((currentPage) => {
      this.currentPageSubject.next(currentPage - 1);
    });
  }

  // View mode toggle
  toggleViewMode(mode: "list" | "pipeline") {
    this.viewMode = mode;
  }

  // Pipeline status change handler
  onStatusChange(event: {
    account: ListingRelatedAccount;
    newStatus: ApplicationStatus;
  }) {
    this.store.dispatch(
      ListingsActions.updateRelatedAccount({
        listingId: this.listingId,
        relatedAccount: {...event.account, status: event.newStatus},
      }),
    );
  }

  // Bulk selection methods
  toggleSelection(applicantId: string) {
    this.store.dispatch(
      ListingsActions.toggleApplicantSelection({applicantId}),
    );
  }

  selectAll() {
    this.relatedAccounts$.pipe(take(1)).subscribe((accounts) => {
      const applicantIds = accounts.map((a) => a.id);
      this.store.dispatch(ListingsActions.selectAllApplicants({applicantIds}));
    });
  }

  deselectAll() {
    this.store.dispatch(ListingsActions.clearApplicantSelection());
  }

  isSelected(applicantId: string): Observable<boolean> {
    return this.selectedApplicantIds$.pipe(
      map((ids) => ids.includes(applicantId)),
    );
  }

  // Bulk status update
  bulkUpdateStatus(
    status: "reviewing" | "interviewed" | "accepted" | "declined",
  ) {
    this.selectedApplicantIds$.pipe(take(1)).subscribe((applicantIds) => {
      if (applicantIds.length === 0) {
        this.showToast("No applicants selected", "warning");
        return;
      }

      this.store.dispatch(
        ListingsActions.bulkUpdateStatus({
          listingId: this.listingId,
          applicantIds,
          status,
        }),
      );
    });
  }

  // Export to CSV
  exportToCsv() {
    this.relatedAccounts$.pipe(take(1)).subscribe((accounts) => {
      this.selectedApplicantIds$.pipe(take(1)).subscribe((selectedIds) => {
        // If there are selected items, export only those; otherwise export all
        const accountsToExport =
          selectedIds.length > 0
            ? accounts.filter((a) => selectedIds.includes(a.id))
            : accounts;

        if (accountsToExport.length === 0) {
          this.showToast("No applicants to export", "warning");
          return;
        }

        // Create CSV content
        const headers = [
          "Name",
          "Email",
          "Phone",
          "Status",
          "Application Date",
        ];
        const rows = accountsToExport.map((account) => {
          const date =
            account.applicationDate && "toDate" in account.applicationDate
              ? (account.applicationDate as any).toDate().toISOString()
              : "";
          return [
            `${account.firstName} ${account.lastName}`,
            account.email,
            account.phone || "",
            account.status,
            date,
          ];
        });

        const csvContent = [
          headers.join(","),
          ...rows.map((row) =>
            row
              .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
              .join(","),
          ),
        ].join("\n");

        // Download the file
        const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `applicants-${this.listingId}-${new Date().toISOString().split("T")[0]}.csv`,
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showToast(
          `Exported ${accountsToExport.length} applicant(s)`,
          "success",
        );
      });
    });
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
