import {Component, Input, OnInit, OnDestroy} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  take,
  map,
  combineLatest,
} from "rxjs";
import {
  Account,
  RelatedAccount,
} from "../../../../../../shared/models/account.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectFilteredAccounts,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";

@Component({
  selector: "app-invite-member-modal",
  templateUrl: "./invite-member-modal.component.html",
  styleUrls: ["./invite-member-modal.component.scss"],
})
export class InviteMemberModalComponent implements OnInit, OnDestroy {
  @Input() groupId!: string;
  @Input() groupName!: string;

  inviteForm: FormGroup;
  searchResults$: Observable<Account[]>;
  selectedAccounts: Account[] = [];
  loading = false;
  searchType: "user" | "group" = "user";
  maxSelections = 10;
  private destroy$ = new Subject<void>();
  private searchTerms$ = new Subject<string>();

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
    this.inviteForm = this.formBuilder.group({
      searchTerm: ["", [Validators.minLength(2)]],
    });

    // Search results will be set up in ngOnInit when groupId is available
    this.searchResults$ = new Observable();
  }

  ngOnInit() {
    this.setupSearchResults();
    this.setupSearch();
    // Load initial accounts
    this.store.dispatch(AccountActions.loadAccounts());
  }

  private setupSearchResults() {
    // Set up search results excluding existing members/partners
    this.searchResults$ = combineLatest([
      this.store.select(selectFilteredAccounts("", this.searchType)),
      this.store.select(selectRelatedAccountsByAccountId(this.groupId)),
    ]).pipe(
      map(([allAccounts, relatedAccounts]) => {
        // Get IDs of existing members/partners (both accepted and pending)
        const existingAccountIds = new Set(
          relatedAccounts
            .filter(
              (rel) =>
                (rel.relationship === "member" ||
                  rel.relationship === "partner") &&
                (rel.status === "accepted" || rel.status === "pending"),
            )
            .map((rel) => rel.id),
        );

        // Also exclude already selected accounts
        const selectedAccountIds = new Set(
          this.selectedAccounts.map((acc) => acc.id),
        );

        // Filter out existing, selected accounts, and the current group account
        return allAccounts
          .filter(
            (account) =>
              account.id !== this.groupId && // Exclude current group
              !existingAccountIds.has(account.id) &&
              !selectedAccountIds.has(account.id),
          )
          .slice(0, 10);
      }),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    // Setup debounced search
    this.searchTerms$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term: string) => {
        this.loading = true;
        this.updateSearchResults(term);
        this.loading = false;
      });
  }

  private updateSearchResults(searchTerm: string = "") {
    this.searchResults$ = combineLatest([
      this.store.select(selectFilteredAccounts(searchTerm, this.searchType)),
      this.store.select(selectRelatedAccountsByAccountId(this.groupId)),
    ]).pipe(
      map(([allAccounts, relatedAccounts]) => {
        // Get IDs of existing members/partners (both accepted and pending)
        const existingAccountIds = new Set(
          relatedAccounts
            .filter(
              (rel) =>
                (rel.relationship === "member" ||
                  rel.relationship === "partner") &&
                (rel.status === "accepted" || rel.status === "pending"),
            )
            .map((rel) => rel.id),
        );

        // Also exclude already selected accounts
        const selectedAccountIds = new Set(
          this.selectedAccounts.map((acc) => acc.id),
        );

        // Filter out existing, selected accounts, and the current group account
        return allAccounts
          .filter(
            (account) =>
              account.id !== this.groupId && // Exclude current group
              !existingAccountIds.has(account.id) &&
              !selectedAccountIds.has(account.id),
          )
          .slice(0, 10);
      }),
    );
  }

  onSearchTypeChange(event: any) {
    const value = event.detail.value;
    if (value === "user" || value === "group") {
      this.searchType = value;
      this.clearAllSelections();
      this.updateSearchResults();
    }
  }

  onSearchInput(event: any) {
    const term = event.target.value?.trim();
    this.searchTerms$.next(term || "");
  }

  selectAccount(account: Account) {
    // Check if already selected
    if (this.isAccountSelected(account)) {
      return;
    }

    // Check if we've reached the maximum
    if (this.selectedAccounts.length >= this.maxSelections) {
      this.showToast(
        `Maximum ${this.maxSelections} selections allowed`,
        "warning",
      );
      return;
    }

    // Add to selected accounts
    this.selectedAccounts.push(account);

    // Update search results to exclude newly selected account
    this.updateSearchResults();

    // Clear search term if we've selected accounts
    if (this.selectedAccounts.length > 0) {
      this.inviteForm.get("searchTerm")?.setValue("");
      this.searchTerms$.next("");
    }
  }

  removeSelectedAccount(account: Account) {
    this.selectedAccounts = this.selectedAccounts.filter(
      (acc) => acc.id !== account.id,
    );
    this.updateSearchResults();
  }

  clearAllSelections() {
    this.selectedAccounts = [];
    this.inviteForm.get("searchTerm")?.setValue("");
    this.searchTerms$.next("");
    this.updateSearchResults();
  }

  isAccountSelected(account: Account): boolean {
    return this.selectedAccounts.some((selected) => selected.id === account.id);
  }

  async sendInvitations() {
    if (this.selectedAccounts.length === 0 || !this.groupId) {
      const accountType = this.searchType === "user" ? "users" : "partners";
      await this.showToast(`Please select ${accountType} to invite`, "warning");
      return;
    }

    try {
      this.loading = true;

      // Get current user
      this.store
        .select(selectAuthUser)
        .pipe(take(1))
        .subscribe(async (currentUser) => {
          if (!currentUser?.uid) {
            await this.showToast("Unable to send invitations", "danger");
            return;
          }

          let successCount = 0;
          let failCount = 0;

          // Send invitations for each selected account
          for (const selectedAccount of this.selectedAccounts) {
            try {
              // Determine relationship type based on account type
              const relationship =
                selectedAccount.type === "user" ? "member" : "partner";

              // Create invitation record - group inviting user/partner
              const invitation: Partial<RelatedAccount> = {
                id: selectedAccount.id,
                accountId: this.groupId, // Group's account
                initiatorId: this.groupId, // Group is initiating the invitation
                targetId: selectedAccount.id, // User/Group being invited
                type:
                  selectedAccount.type === "new"
                    ? "user"
                    : selectedAccount.type,
                status: "pending",
                relationship: relationship,
                requestType: "invitation",
                name: selectedAccount.name,
                tagline: selectedAccount.tagline,
                iconImage: selectedAccount.iconImage,
                createdBy: currentUser.uid,
                lastModifiedBy: currentUser.uid,
              };

              // Dispatch action to create the invitation
              this.store.dispatch(
                AccountActions.createRelatedAccount({
                  accountId: this.groupId,
                  relatedAccount: invitation as RelatedAccount,
                }),
              );

              successCount++;
            } catch (error) {
              console.error(
                `Error sending invitation to ${selectedAccount.name}:`,
                error,
              );
              failCount++;
            }
          }

          // Show summary message
          if (successCount > 0 && failCount === 0) {
            await this.showToast(
              `Successfully sent ${successCount} invitation${successCount > 1 ? "s" : ""}`,
              "success",
            );
          } else if (successCount > 0 && failCount > 0) {
            await this.showToast(
              `Sent ${successCount} invitations, ${failCount} failed`,
              "warning",
            );
          } else {
            await this.showToast("Failed to send invitations", "danger");
          }

          if (successCount > 0) {
            this.dismiss(true);
          }
        });
    } catch (error) {
      console.error("Error sending invitations:", error);
      await this.showToast("Failed to send invitations", "danger");
    } finally {
      this.loading = false;
    }
  }

  dismiss(success: boolean = false) {
    this.modalController.dismiss(success);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: "bottom",
    });
    await toast.present();
  }

  get isFormValid(): boolean {
    return this.selectedAccounts.length > 0;
  }

  get selectionCountText(): string {
    return `${this.selectedAccounts.length}/${this.maxSelections}`;
  }
}
