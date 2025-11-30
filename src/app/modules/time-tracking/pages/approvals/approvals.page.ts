/*******************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************/
// src/app/modules/time-tracking/pages/approvals/approvals.page.ts

import {Component, OnInit, OnDestroy} from "@angular/core";
import {trigger, style, transition, animate} from "@angular/animations";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subscription, combineLatest, BehaviorSubject} from "rxjs";
import {map, filter, take} from "rxjs/operators";
import {Timestamp} from "firebase/firestore";
import {TimeEntry} from "@shared/models/time-entry.model";
import {AuthUser} from "@shared/models/auth-user.model";
import {Account} from "@shared/models/account.model";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import * as AccountActions from "../../../../state/actions/account.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {selectAllEntriesForAccount} from "../../../../state/selectors/time-tracking.selectors";
import {AppState} from "../../../../state/app.state";
import {
  AlertController,
  ToastController,
  ModalController,
} from "@ionic/angular";
import {TimesheetNotificationService} from "../../services/timesheet-notification.service";
import {NotesModalComponent} from "../../components/notes-modal/notes-modal.component";
import {StatusHistoryModalComponent} from "../../components/status-history-modal/status-history-modal.component";

interface GroupedEntries {
  userId: string;
  userName: string;
  userEmail: string;
  weekStart: Date;
  entries: TimeEntry[];
  totalHours: number;
  status: "draft" | "pending" | "approved" | "rejected";
  projectName?: string;
}

interface SummaryStats {
  pending: {count: number; hours: number};
  approved: {count: number; hours: number};
  rejected: {count: number; hours: number};
  total: {count: number; hours: number};
}

interface ApprovalsPreferences {
  showAllWeeks: boolean;
  statusFilter: "all" | "pending" | "approved" | "rejected";
  sortBy: "date" | "user" | "hours" | "status";
  sortDirection: "asc" | "desc";
}

const APPROVALS_STORAGE_KEY = "approvals-preferences";

@Component({
  selector: "app-approvals",
  templateUrl: "./approvals.page.html",
  styleUrls: ["./approvals.page.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({height: "0", opacity: 0, overflow: "hidden"}),
        animate(
          "200ms ease-out",
          style({height: "*", opacity: 1, overflow: "hidden"}),
        ),
      ]),
      transition(":leave", [
        style({height: "*", opacity: 1, overflow: "hidden"}),
        animate(
          "200ms ease-in",
          style({height: "0", opacity: 0, overflow: "hidden"}),
        ),
      ]),
    ]),
  ],
})
export class ApprovalsPage implements OnInit, OnDestroy {
  accountId: string = "";
  account$!: Observable<Account | undefined>;
  currentUser$!: Observable<AuthUser | null>;
  groupedEntries$!: Observable<GroupedEntries[]>;
  displayEntries$!: Observable<GroupedEntries[]>;
  summaryStats$!: Observable<SummaryStats>;

  // Navigation and filtering properties
  currentWeekStart: Date = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  })();

  showAllWeeks = false;

  // Filter properties
  statusFilter: "all" | "pending" | "approved" | "rejected" = "all";
  sortBy: "date" | "user" | "hours" | "status" = "date";
  sortDirection: "asc" | "desc" = "desc";
  isProcessing = false;

  // User search property
  userSearchTerm = "";

  // Collapsible groups tracking
  expandedGroups = new Set<string>();
  allExpanded = false;

  // Selection tracking for batch operations
  selectedGroups = new Set<string>();
  allPendingSelected = false;

  // Week picker state
  isDatePickerOpen = false;
  selectedDate: string = new Date().toISOString();

  // Undo functionality - track pending actions
  private pendingActions = new Map<
    string,
    {
      timeoutId: ReturnType<typeof setTimeout>;
      group: GroupedEntries;
      status: "approved" | "rejected";
      rejectionReason?: string;
    }
  >();
  private readonly UNDO_DELAY_MS = 10000; // 10 seconds to undo

  // Reactive streams for properties that affect data filtering
  private showAllWeeks$ = new BehaviorSubject<boolean>(false);
  private currentWeekStart$ = new BehaviorSubject<Date>(
    (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d;
    })(),
  );
  private statusFilter$ = new BehaviorSubject<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  private sortBy$ = new BehaviorSubject<"date" | "user" | "hours" | "status">(
    "date",
  );
  private sortDirection$ = new BehaviorSubject<"asc" | "desc">("desc");
  private userSearchTerm$ = new BehaviorSubject<string>("");

  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private notificationService: TimesheetNotificationService,
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get("accountId") ?? "";

    // Load saved preferences from localStorage
    this.loadPreferences();

    // Load account data
    this.account$ = this.store.select(selectAccountById(this.accountId));
    this.currentUser$ = this.store.select(selectAuthUser);

    // Initialize reactive streams with current values
    this.showAllWeeks$.next(this.showAllWeeks);
    this.currentWeekStart$.next(this.currentWeekStart);
    this.statusFilter$.next(this.statusFilter);
    this.sortBy$.next(this.sortBy);
    this.sortDirection$.next(this.sortDirection);

    // Load account and time entries
    this.store.dispatch(
      AccountActions.loadAccount({accountId: this.accountId}),
    );
    this.store.dispatch(
      TimeTrackingActions.loadAllTimeEntriesForAccount({
        accountId: this.accountId,
      }),
    );

    // Create grouped entries observables
    this.groupedEntries$ = combineLatest([
      this.store.select(selectAllEntriesForAccount(this.accountId)),
      this.showAllWeeks$,
      this.currentWeekStart$,
      this.statusFilter$,
      this.sortBy$,
      this.sortDirection$,
    ]).pipe(
      filter(([entries]) => !!entries),
      map(
        ([
          entries,
          showAllWeeks,
          currentWeekStart,
          statusFilter,
          sortBy,
          sortDirection,
        ]) => {
          const filteredEntries = showAllWeeks
            ? entries
            : this.filterEntriesByWeek(entries, currentWeekStart);
          let groupedEntries = this.groupEntriesByUserAndWeek(filteredEntries);

          // Apply status filtering
          if (statusFilter !== "all") {
            groupedEntries = groupedEntries.filter(
              (group) => group.status === statusFilter,
            );
          }

          // Apply sorting
          return this.sortGroupedEntries(groupedEntries, sortBy, sortDirection);
        },
      ),
    );

    this.displayEntries$ = combineLatest([
      this.groupedEntries$,
      this.userSearchTerm$,
    ]).pipe(
      map(([groupedEntries, searchTerm]) => {
        let groups = groupedEntries;

        // Apply user search filter
        if (searchTerm && searchTerm.trim().length > 0) {
          const normalizedSearch = searchTerm.toLowerCase().trim();
          groups = groups.filter(
            (group) =>
              group.userName.toLowerCase().includes(normalizedSearch) ||
              group.userEmail.toLowerCase().includes(normalizedSearch),
          );
        }

        return this.sortGroupedEntries(groups, this.sortBy, this.sortDirection);
      }),
    );

    // Create summary statistics observable (based on unfiltered grouped entries)
    this.summaryStats$ = combineLatest([
      this.store.select(selectAllEntriesForAccount(this.accountId)),
      this.showAllWeeks$,
      this.currentWeekStart$,
    ]).pipe(
      filter(([entries]) => !!entries),
      map(([entries, showAllWeeks, currentWeekStart]) => {
        const filteredEntries = showAllWeeks
          ? entries
          : this.filterEntriesByWeek(entries, currentWeekStart);
        return this.calculateSummaryStats(
          this.groupEntriesByUserAndWeek(filteredEntries),
        );
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.showAllWeeks$.complete();
    this.currentWeekStart$.complete();
    this.userSearchTerm$.complete();

    // Clear all pending undo actions and execute them immediately
    this.pendingActions.forEach((action) => {
      clearTimeout(action.timeoutId);
      this.executeStatusUpdate(
        action.group,
        action.status,
        action.rejectionReason,
      );
    });
    this.pendingActions.clear();
  }

  // Preferences persistence methods
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(APPROVALS_STORAGE_KEY);
      if (stored) {
        const prefs: ApprovalsPreferences = JSON.parse(stored);
        if (typeof prefs.showAllWeeks === "boolean")
          this.showAllWeeks = prefs.showAllWeeks;
        if (prefs.statusFilter) this.statusFilter = prefs.statusFilter;
        if (prefs.sortBy) this.sortBy = prefs.sortBy;
        if (prefs.sortDirection) this.sortDirection = prefs.sortDirection;
      }
    } catch {
      // If parsing fails, use defaults
      console.warn(
        "Failed to load approvals preferences from localStorage. Using default settings.",
      );
    }
  }

  private savePreferences(): void {
    try {
      const prefs: ApprovalsPreferences = {
        showAllWeeks: this.showAllWeeks,
        statusFilter: this.statusFilter,
        sortBy: this.sortBy,
        sortDirection: this.sortDirection,
      };
      localStorage.setItem(APPROVALS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // localStorage might be full or disabled
      console.warn("Failed to save approvals preferences to localStorage");
    }
  }

  // User search methods
  onUserSearchChange(event: CustomEvent<{value?: string | null}>) {
    const searchTerm = event.detail?.value ?? "";
    this.userSearchTerm = searchTerm;
    this.userSearchTerm$.next(searchTerm);
  }

  clearUserSearch() {
    this.userSearchTerm = "";
    this.userSearchTerm$.next("");
  }

  // Collapsible group methods
  getGroupKey(group: GroupedEntries): string {
    return `${group.userId}_${group.weekStart.getTime()}`;
  }

  isGroupExpanded(group: GroupedEntries): boolean {
    return this.expandedGroups.has(this.getGroupKey(group));
  }

  toggleGroupExpansion(group: GroupedEntries): void {
    const key = this.getGroupKey(group);
    if (this.expandedGroups.has(key)) {
      this.expandedGroups.delete(key);
    } else {
      this.expandedGroups.add(key);
    }
    this.updateAllExpandedState();
  }

  expandAllGroups(): void {
    this.displayEntries$.pipe(take(1)).subscribe((groups) => {
      groups.forEach((group) => {
        this.expandedGroups.add(this.getGroupKey(group));
      });
      this.allExpanded = true;
    });
  }

  collapseAllGroups(): void {
    this.expandedGroups.clear();
    this.allExpanded = false;
  }

  private updateAllExpandedState(): void {
    this.displayEntries$.pipe(take(1)).subscribe((groups) => {
      this.allExpanded =
        groups.length > 0 &&
        groups.every((group) =>
          this.expandedGroups.has(this.getGroupKey(group)),
        );
    });
  }

  // Selection methods for batch operations
  isGroupSelected(group: GroupedEntries): boolean {
    return this.selectedGroups.has(this.getGroupKey(group));
  }

  toggleGroupSelection(group: GroupedEntries, event: Event): void {
    event.stopPropagation();
    const key = this.getGroupKey(group);
    if (this.selectedGroups.has(key)) {
      this.selectedGroups.delete(key);
    } else {
      this.selectedGroups.add(key);
    }
    this.updateAllPendingSelectedState();
  }

  selectAllPending(): void {
    this.displayEntries$.pipe(take(1)).subscribe((groups) => {
      groups
        .filter((group) => group.status === "pending")
        .forEach((group) => {
          this.selectedGroups.add(this.getGroupKey(group));
        });
      this.allPendingSelected = true;
    });
  }

  deselectAll(): void {
    this.selectedGroups.clear();
    this.allPendingSelected = false;
  }

  getSelectedCount(): number {
    return this.selectedGroups.size;
  }

  getSelectedPendingGroups(): GroupedEntries[] {
    let result: GroupedEntries[] = [];
    this.displayEntries$.pipe(take(1)).subscribe((groups) => {
      result = groups.filter(
        (group) =>
          group.status === "pending" &&
          this.selectedGroups.has(this.getGroupKey(group)),
      );
    });
    return result;
  }

  private updateAllPendingSelectedState(): void {
    this.displayEntries$.pipe(take(1)).subscribe((groups) => {
      const pendingGroups = groups.filter((g) => g.status === "pending");
      this.allPendingSelected =
        pendingGroups.length > 0 &&
        pendingGroups.every((group) =>
          this.selectedGroups.has(this.getGroupKey(group)),
        );
    });
  }

  private groupEntriesByUserAndWeek(entries: TimeEntry[]): GroupedEntries[] {
    const grouped = new Map<string, GroupedEntries>();

    // Filter out draft entries as they shouldn't appear in approvals
    const submittedEntries = entries.filter(
      (entry) => entry.status !== "draft",
    );

    submittedEntries.forEach((entry) => {
      // Get the start of the week for this entry
      const entryDate = this.toDate(entry.date);
      const weekStart = this.getWeekStart(entryDate);
      const key = `${entry.userId}_${weekStart.getTime()}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          userId: entry.userId,
          userName: entry.userName || "Unknown User",
          userEmail: "",
          weekStart,
          entries: [],
          totalHours: 0,
          status: "pending",
        });
      }

      const group = grouped.get(key)!;
      group.entries.push(entry);
      group.totalHours += entry.hours;

      // Update user name if this entry has a more complete name
      if (entry.userName && entry.userName !== "Unknown User") {
        group.userName = entry.userName;
      }

      // Determine overall status for the week
      if (group.entries.some((e) => e.status === "rejected")) {
        group.status = "rejected";
      } else if (group.entries.every((e) => e.status === "approved")) {
        group.status = "approved";
      } else {
        group.status = "pending";
      }
    });

    return Array.from(grouped.values()).sort((a, b) => {
      // Sort by status (pending first), then by week start date
      if (a.status !== b.status) {
        const statusOrder = {draft: 0, pending: 1, approved: 2, rejected: 3};
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b.weekStart.getTime() - a.weekStart.getTime();
    });
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }

  private filterEntriesByWeek(
    entries: TimeEntry[],
    weekStart: Date,
  ): TimeEntry[] {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    return entries.filter((entry) => {
      const entryDate = this.toDate(entry.date);
      return entryDate >= weekStart && entryDate < weekEnd;
    });
  }

  getWeekRange(weekStart: Date): string {
    const endDate = new Date(weekStart);
    endDate.setDate(endDate.getDate() + 6);

    const startOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const endOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    const startStr = weekStart.toLocaleDateString("en-US", startOptions);
    const endStr = endDate.toLocaleDateString("en-US", endOptions);

    return `${startStr} - ${endStr}`;
  }

  async approveTimesheet(group: GroupedEntries) {
    const alert = await this.alertController.create({
      header: "Approve Timesheet",
      message: `Approve ${group.totalHours} hours for ${group.userName} for week ${this.getWeekRange(group.weekStart)}?`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Approve",
          handler: () => {
            this.updateTimesheetStatus(group, "approved");
          },
        },
      ],
    });

    await alert.present();
  }

  async rejectTimesheet(group: GroupedEntries) {
    const alert = await this.alertController.create({
      header: "Reject Timesheet",
      message: `Reject ${group.totalHours} hours for ${group.userName} for week ${this.getWeekRange(group.weekStart)}?`,
      inputs: [
        {
          name: "reason",
          type: "textarea",
          placeholder: "Please provide a reason for rejection (required)",
          attributes: {
            rows: 3,
            minlength: 10,
            maxlength: 500,
          },
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Reject",
          handler: (data) => {
            const reason = data.reason?.trim();
            if (!reason || reason.length < 10) {
              this.showValidationError(
                "Please provide a rejection reason (at least 10 characters).",
              );
              return false; // Prevent alert from closing
            }
            this.updateTimesheetStatus(group, "rejected", reason);
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Show a validation error toast
   */
  private async showValidationError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: "warning",
      position: "top",
    });
    await toast.present();
  }

  /**
   * Schedule a timesheet status update with undo capability
   */
  private updateTimesheetStatus(
    group: GroupedEntries,
    status: "approved" | "rejected",
    rejectionReason?: string,
  ) {
    const actionKey = this.getGroupKey(group);

    // Cancel any existing pending action for this group
    if (this.pendingActions.has(actionKey)) {
      const existingAction = this.pendingActions.get(actionKey)!;
      clearTimeout(existingAction.timeoutId);
      this.pendingActions.delete(actionKey);
    }

    // Schedule the actual update after delay
    const timeoutId = setTimeout(() => {
      this.executeStatusUpdate(group, status, rejectionReason);
      this.pendingActions.delete(actionKey);
    }, this.UNDO_DELAY_MS);

    // Store the pending action
    this.pendingActions.set(actionKey, {
      timeoutId,
      group,
      status,
      rejectionReason,
    });

    // Show undo toast
    this.showUndoToast(group, status);
  }

  /**
   * Show a toast with undo button
   */
  private async showUndoToast(
    group: GroupedEntries,
    status: "approved" | "rejected",
  ) {
    const actionKey = this.getGroupKey(group);
    const message =
      status === "approved"
        ? `Approving timesheet for ${group.userName}...`
        : `Rejecting timesheet for ${group.userName}...`;

    const toast = await this.toastController.create({
      message,
      duration: this.UNDO_DELAY_MS,
      color: status === "approved" ? "success" : "warning",
      position: "bottom",
      buttons: [
        {
          text: "Undo",
          role: "cancel",
          handler: () => {
            this.undoAction(actionKey);
          },
        },
      ],
    });

    await toast.present();

    // When toast dismisses naturally (not by undo), the action will execute via timeout
    toast.onDidDismiss().then((result) => {
      // If dismissed by undo button, the handler already took care of it
      // If dismissed by timeout or swipe, the setTimeout will handle execution
    });
  }

  /**
   * Cancel a pending action (undo)
   */
  private undoAction(actionKey: string) {
    const pendingAction = this.pendingActions.get(actionKey);
    if (pendingAction) {
      clearTimeout(pendingAction.timeoutId);
      this.pendingActions.delete(actionKey);
      this.showToast("Action undone", "medium");
    }
  }

  /**
   * Execute the actual status update (called after undo delay)
   */
  private executeStatusUpdate(
    group: GroupedEntries,
    status: "approved" | "rejected",
    rejectionReason?: string,
  ) {
    // Get current user for audit trail
    this.currentUser$
      .pipe(
        filter((user) => !!user),
        take(1),
      )
      .subscribe((currentUser) => {
        const approvalTimestamp = Timestamp.now();

        group.entries.forEach((entry) => {
          const statusChange = {
            status,
            changedBy: currentUser!.uid,
            changedByName:
              currentUser!.displayName || currentUser!.email || "Unknown",
            changedAt: approvalTimestamp,
            reason: rejectionReason,
          };

          // Add to note history for admin actions
          const noteHistoryEntry = {
            id: `${status}_${approvalTimestamp.seconds}`,
            content:
              status === "approved"
                ? "Timesheet approved"
                : `Timesheet rejected: ${rejectionReason || "No reason provided"}`,
            createdBy: currentUser!.uid,
            createdByName:
              currentUser!.displayName || currentUser!.email || "Unknown",
            createdAt: approvalTimestamp,
            type: "admin" as const,
          };

          const baseEntry: TimeEntry = {
            ...entry,
            status,
            // Audit fields
            approvedBy: currentUser!.uid,
            approvedByName:
              currentUser!.displayName || currentUser!.email || "Unknown",
            approvedAt: approvalTimestamp,
            originalHours: entry.originalHours || entry.hours,
            rejectionReason:
              status === "rejected" ? rejectionReason : undefined,
            statusHistory: [...(entry.statusHistory || []), statusChange],
            noteHistory: [...(entry.noteHistory || []), noteHistoryEntry],
          };

          this.store.dispatch(
            TimeTrackingActions.updateTimeEntry({entry: baseEntry}),
          );
        });

        // Send notifications to user
        if (status === "approved") {
          this.notificationService.notifyTimesheetApproved(
            group.userId,
            group.weekStart,
            group.totalHours,
            currentUser!.displayName || currentUser!.email || "Unknown",
            currentUser!.uid,
            group.entries[0].accountId,
          );
        } else if (status === "rejected") {
          this.notificationService.notifyTimesheetRejected(
            group.userId,
            group.weekStart,
            group.totalHours,
            rejectionReason || "",
            currentUser!.displayName || currentUser!.email || "Unknown",
            currentUser!.uid,
            group.entries[0].accountId,
          );
        }

        this.showToast(
          `Timesheet ${status} for ${group.userName}`,
          status === "approved" ? "success" : "warning",
        );
      });
  }

  private async showToast(message: string, color: string = "primary") {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: "top",
    });
    await toast.present();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "draft":
        return "medium";
      case "pending":
      default:
        return "warning";
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "approved":
        return "checkmark-circle";
      case "rejected":
        return "close-circle";
      case "draft":
        return "create";
      case "pending":
      default:
        return "time";
    }
  }

  // Navigation methods
  nextWeek() {
    const newDate = new Date(this.currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    this.currentWeekStart = newDate;
    this.currentWeekStart$.next(newDate);
  }

  previousWeek() {
    const newDate = new Date(this.currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    this.currentWeekStart = newDate;
    this.currentWeekStart$.next(newDate);
  }

  /**
   * Jump to the current week (week containing today)
   */
  jumpToThisWeek() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - today.getDay());
    this.currentWeekStart = today;
    this.currentWeekStart$.next(today);
    this.selectedDate = new Date().toISOString();
  }

  /**
   * Check if the current view is showing this week
   */
  isCurrentWeek(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    return this.currentWeekStart.getTime() === thisWeekStart.getTime();
  }

  /**
   * Handle date selection from date picker
   */
  onDateSelected(event: CustomEvent<{value?: string | string[] | null}>) {
    const value = event.detail.value;
    if (!value || Array.isArray(value)) return;
    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);
    // Calculate the week start (Sunday) for the selected date
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
    this.currentWeekStart = weekStart;
    this.currentWeekStart$.next(weekStart);
    this.selectedDate = value;
    this.isDatePickerOpen = false;
  }

  /**
   * Toggle the date picker popover
   */
  toggleDatePicker() {
    if (!this.showAllWeeks) {
      this.isDatePickerOpen = !this.isDatePickerOpen;
    }
  }

  toggleShowAllWeeks(event: CustomEvent<{checked: boolean}>) {
    this.showAllWeeks = event.detail.checked;
    this.showAllWeeks$.next(this.showAllWeeks);
    this.savePreferences();
  }

  getCurrentWeekLabel(): string {
    if (this.showAllWeeks) {
      return "All Time Periods";
    }
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };
    return this.currentWeekStart.toLocaleDateString("en-US", options);
  }

  getCurrentWeekRange(): string {
    if (this.showAllWeeks) {
      return "All Weeks";
    }
    return this.getWeekRange(this.currentWeekStart);
  }

  // Filter control methods
  setStatusFilter(status: "all" | "pending" | "approved" | "rejected") {
    this.statusFilter = status;
    this.statusFilter$.next(status);
    this.savePreferences();
  }

  setSortBy(sortBy: "date" | "user" | "hours" | "status") {
    this.sortBy = sortBy;
    this.sortBy$.next(sortBy);
    this.savePreferences();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    this.sortDirection$.next(this.sortDirection);
    this.savePreferences();
  }

  // Sorting methods
  private sortGroupedEntries(
    entries: GroupedEntries[],
    sortBy: "date" | "user" | "hours" | "status",
    direction: "asc" | "desc",
  ): GroupedEntries[] {
    const sortedEntries = [...entries].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = a.weekStart.getTime() - b.weekStart.getTime();
          break;
        case "user":
          comparison = a.userName.localeCompare(b.userName);
          break;
        case "hours":
          comparison = a.totalHours - b.totalHours;
          break;
        case "status":
          // Sort pending first, then approved, then rejected, then draft
          const statusOrder = {pending: 1, approved: 2, rejected: 3, draft: 4};
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return direction === "asc" ? comparison : -comparison;
    });

    return sortedEntries;
  }

  // Bulk approval methods
  async bulkApprove() {
    const selectedCount = this.getSelectedCount();
    const message =
      selectedCount > 0
        ? `Approve ${selectedCount} selected timesheet(s)?`
        : "Approve all pending timesheets?";

    const alert = await this.alertController.create({
      header: "Bulk Approve",
      message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: selectedCount > 0 ? `Approve ${selectedCount}` : "Approve All",
          role: "confirm",
          cssClass: "confirm-button",
          handler: () => {
            this.performBulkAction("approved");
          },
        },
      ],
    });

    await alert.present();
  }

  async bulkReject() {
    const selectedCount = this.getSelectedCount();
    const message =
      selectedCount > 0
        ? `Reject ${selectedCount} selected timesheet(s)?`
        : "Reject all pending timesheets?";

    const alert = await this.alertController.create({
      header: "Bulk Reject",
      message,
      inputs: [
        {
          name: "reason",
          type: "textarea",
          placeholder: "Please provide a reason for rejection (required)",
          attributes: {
            rows: 3,
            minlength: 10,
            maxlength: 500,
          },
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: selectedCount > 0 ? `Reject ${selectedCount}` : "Reject All",
          cssClass: "danger-button",
          handler: (data) => {
            const reason = data.reason?.trim();
            if (!reason || reason.length < 10) {
              this.showValidationError(
                "Please provide a rejection reason (at least 10 characters).",
              );
              return false; // Prevent alert from closing
            }
            this.performBulkAction("rejected", reason);
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  toDate(value: any): Date {
    if (!value) {
      return new Date(0);
    }
    if (value instanceof Date) {
      return value;
    }
    if (typeof value.toDate === "function") {
      return value.toDate();
    }
    if (typeof value === "string") {
      return new Date(value);
    }
    if (typeof value === "number") {
      return new Date(value);
    }
    if (typeof value.seconds === "number") {
      const millis = value.seconds * 1000 + (value.nanoseconds ?? 0) / 1e6;
      return new Date(millis);
    }
    if (typeof value._seconds === "number") {
      const millis = value._seconds * 1000 + (value._nanoseconds ?? 0) / 1e6;
      return new Date(millis);
    }
    const coerced = new Date(value);
    return isNaN(coerced.getTime()) ? new Date(0) : coerced;
  }

  private performBulkAction(
    status: "approved" | "rejected",
    rejectionReason?: string,
  ) {
    // Prevent multiple clicks
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    // Use take(1) to get current value and automatically unsubscribe
    this.groupedEntries$
      .pipe(take(1))
      .subscribe((entries: GroupedEntries[]) => {
        let entriesToProcess: GroupedEntries[];

        // If there are selected items, process only those; otherwise process all pending
        if (this.selectedGroups.size > 0) {
          entriesToProcess = entries.filter(
            (group) =>
              group.status === "pending" &&
              this.selectedGroups.has(this.getGroupKey(group)),
          );
        } else {
          entriesToProcess = entries.filter(
            (group) => group.status === "pending",
          );
        }

        if (entriesToProcess.length === 0) {
          this.showToast("No pending timesheets to process", "warning");
          this.isProcessing = false;
          return;
        }

        // Schedule bulk action with undo capability
        this.scheduleBulkAction(entriesToProcess, status, rejectionReason);

        // Clear selection after scheduling
        this.selectedGroups.clear();
        this.allPendingSelected = false;
        this.isProcessing = false;
      });
  }

  /**
   * Schedule a bulk action with undo capability
   */
  private scheduleBulkAction(
    groups: GroupedEntries[],
    status: "approved" | "rejected",
    rejectionReason?: string,
  ) {
    const bulkActionKey = `bulk_${Date.now()}`;

    // Cancel any individual pending actions for these groups
    groups.forEach((group) => {
      const actionKey = this.getGroupKey(group);
      if (this.pendingActions.has(actionKey)) {
        const existingAction = this.pendingActions.get(actionKey)!;
        clearTimeout(existingAction.timeoutId);
        this.pendingActions.delete(actionKey);
      }
    });

    // Schedule the bulk update after delay
    const timeoutId = setTimeout(() => {
      groups.forEach((group) => {
        this.executeStatusUpdate(group, status, rejectionReason);
      });
      this.pendingActions.delete(bulkActionKey);
      this.showToast(
        `${groups.length} timesheets ${status}`,
        status === "approved" ? "success" : "warning",
      );
    }, this.UNDO_DELAY_MS);

    // Store the bulk pending action (store first group as representative)
    this.pendingActions.set(bulkActionKey, {
      timeoutId,
      group: groups[0],
      status,
      rejectionReason,
    });

    // Show bulk undo toast
    this.showBulkUndoToast(bulkActionKey, groups.length, status);
  }

  /**
   * Show a toast with undo button for bulk actions
   */
  private async showBulkUndoToast(
    bulkActionKey: string,
    count: number,
    status: "approved" | "rejected",
  ) {
    const actionWord = status === "approved" ? "Approving" : "Rejecting";
    const message = `${actionWord} ${count} timesheet${count > 1 ? "s" : ""}...`;

    const toast = await this.toastController.create({
      message,
      duration: this.UNDO_DELAY_MS,
      color: status === "approved" ? "success" : "warning",
      position: "bottom",
      buttons: [
        {
          text: "Undo",
          role: "cancel",
          handler: () => {
            this.undoAction(bulkActionKey);
          },
        },
      ],
    });

    await toast.present();
  }

  hasEntryNotes(entry: TimeEntry): boolean {
    return !!(
      (entry.notes && entry.notes.trim().length > 0) ||
      (entry.noteHistory && entry.noteHistory.length > 0)
    );
  }

  async openNotesModal(entry: TimeEntry) {
    const modal = await this.modalController.create({
      component: NotesModalComponent,
      componentProps: {
        entry,
        date: this.toDate(entry.date),
        projectName: entry.projectName || "Unknown Project",
        isAdmin: true,
      },
      cssClass: "notes-modal",
      backdropDismiss: true,
    });

    await modal.present();
  }

  async openStatusHistoryModal(group: GroupedEntries) {
    const modal = await this.modalController.create({
      component: StatusHistoryModalComponent,
      componentProps: {
        group,
      },
      cssClass: "status-history-modal",
      backdropDismiss: true,
    });

    await modal.present();
  }

  /**
   * Calculate summary statistics from grouped entries
   */
  private calculateSummaryStats(groups: GroupedEntries[]): SummaryStats {
    const stats: SummaryStats = {
      pending: {count: 0, hours: 0},
      approved: {count: 0, hours: 0},
      rejected: {count: 0, hours: 0},
      total: {count: 0, hours: 0},
    };

    groups.forEach((group) => {
      stats.total.count++;
      stats.total.hours += group.totalHours;

      switch (group.status) {
        case "pending":
          stats.pending.count++;
          stats.pending.hours += group.totalHours;
          break;
        case "approved":
          stats.approved.count++;
          stats.approved.hours += group.totalHours;
          break;
        case "rejected":
          stats.rejected.count++;
          stats.rejected.hours += group.totalHours;
          break;
      }
    });

    return stats;
  }

  /**
   * Export current filtered view to CSV
   */
  exportToCSV() {
    this.displayEntries$.pipe(take(1)).subscribe((entries) => {
      if (!entries || entries.length === 0) {
        this.showToast("No data to export", "warning");
        return;
      }

      // Build CSV content
      const headers = [
        "User",
        "Week Start",
        "Week End",
        "Total Hours",
        "Status",
        "Entries Count",
        "Approved By",
        "Approved Date",
        "Rejection Reason",
      ];

      const rows = entries.map((group) => {
        const weekEnd = new Date(group.weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Get approval info from first entry (all entries in group have same approval)
        const firstEntry = group.entries[0];
        const approvedBy = firstEntry?.approvedByName || "";
        const approvedAt = firstEntry?.approvedAt
          ? this.toDate(firstEntry.approvedAt).toLocaleDateString()
          : "";
        const rejectionReason = firstEntry?.rejectionReason || "";

        return [
          this.escapeCSV(group.userName),
          group.weekStart.toLocaleDateString(),
          weekEnd.toLocaleDateString(),
          group.totalHours.toFixed(2),
          group.status,
          group.entries.length.toString(),
          this.escapeCSV(approvedBy),
          approvedAt,
          this.escapeCSV(rejectionReason),
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Generate filename with date range
      const dateStr = this.showAllWeeks
        ? "all-time"
        : `week-${this.currentWeekStart.toISOString().split("T")[0]}`;
      const statusStr =
        this.statusFilter !== "all" ? `-${this.statusFilter}` : "";
      const filename = `timesheet-approvals-${dateStr}${statusStr}.csv`;

      // Download file
      this.downloadCSV(csvContent, filename);
      this.showToast(
        `Exported ${entries.length} records to ${filename}`,
        "success",
      );
    });
  }

  /**
   * Escapes a string value for safe inclusion in a CSV file.
   *
   * If the value contains a comma, double quote, or newline, it will be wrapped in double quotes,
   * and any existing double quotes will be escaped by doubling them (" -> "").
   * This follows RFC 4180 CSV escaping rules for fields.
   *
   * @param value The string value to escape for CSV.
   * @returns The escaped string, safe for CSV output.
   *
   * Edge cases handled:
   * - Values containing commas, double quotes, or newlines are quoted and quotes are escaped.
   * - Empty or falsy values return an empty string.
   * Triggers download of a CSV file by creating a temporary anchor element and simulating a click.
   *
   * This approach is used for cross-browser compatibility. While modern browsers support
   * direct Blob downloads and the File API, some older browsers and certain mobile browsers
   * do not reliably support the `download` attribute or direct Blob downloads. Creating a
   * temporary DOM element and triggering a click ensures the download works across a wider
   * range of browsers, including legacy and mobile environments.
   *
   * @param content - The CSV content to download.
   * @param filename - The filename for the downloaded CSV.
   */
  private escapeCSV(value: string): string {
    if (!value) return "";
    // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Trigger download of CSV file
   */
  private downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
