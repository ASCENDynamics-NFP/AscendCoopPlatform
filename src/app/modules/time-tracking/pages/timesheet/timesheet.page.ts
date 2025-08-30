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
// src/app/modules/time-tracking/pages/timesheet/timesheet.page.ts

import {Component, OnInit, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {first} from "rxjs/operators";
import {Project} from "../../../../../../shared/models/project.model";
import {Account} from "../../../../../../shared/models/account.model";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import * as ProjectsActions from "../../../../state/actions/projects.actions";
import * as AccountActions from "../../../../state/actions/account.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectEntries} from "../../../../state/selectors/time-tracking.selectors";
import {
  selectActiveProjectsByAccount,
  selectAllProjectsByAccount,
} from "../../../../state/selectors/projects.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {selectRelatedAccountsByAccountId} from "../../../../state/selectors/account.selectors";
import {TimeEntry} from "../../../../../../shared/models/time-entry.model";
import {AppState} from "../../../../state/app.state";
import {TimesheetNotificationService} from "../../services/timesheet-notification.service";

@Component({
  selector: "app-timesheet",
  templateUrl: "./timesheet.page.html",
  styleUrls: ["./timesheet.page.scss"],
})
export class TimesheetPage implements OnInit, OnDestroy {
  projects$!: Observable<Project[]>;
  entries$!: Observable<TimeEntry[]>;
  account$!: Observable<Account | undefined>;
  availableProjects: Project[] = [];
  allProjects: Project[] = []; // Add this property
  allProjectsForValidation: Project[] = []; // New property for validation including archived
  entries: TimeEntry[] = [];
  initialRows: {projectId: string}[] = [];
  private subscriptions = new Subscription();
  private entriesSub?: Subscription;
  accountId: string = "";
  userId: string = "";
  isSubmitting: boolean = false;
  currentWeekStart: Date = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  })();

  // Store the actual current week for "return to current week" functionality
  private todaysWeekStart: Date = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  })();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private notificationService: TimesheetNotificationService,
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get("accountId") ?? "";

    // Load account information
    this.store.dispatch(
      AccountActions.loadAccount({accountId: this.accountId}),
    );

    // Load related accounts to get admin users for notifications
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.accountId}),
    );

    this.account$ = this.store.select(selectAccountById(this.accountId));

    this.projects$ = this.store.select(
      selectActiveProjectsByAccount(this.accountId),
    );

    // Subscribe to active projects for dropdown selection
    const activeProjectsSub = this.projects$.subscribe((projects) => {
      this.availableProjects = projects; // Only active projects for selection
    });
    this.subscriptions.add(activeProjectsSub);

    // Get all projects (including archived) for validation and time entry display
    const allProjectsSub = this.store
      .select(selectAllProjectsByAccount(this.accountId))
      .subscribe((projects) => {
        this.allProjectsForValidation = projects; // All projects for validation
        this.allProjects = projects;
      });
    this.subscriptions.add(allProjectsSub);

    const authSub = this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user) => {
        this.userId = user?.uid ?? "";
        if (this.userId) {
          this.updateEntriesObservable();
          this.loadEntries();
        }
      });
    this.subscriptions.add(authSub);

    this.store.dispatch(
      ProjectsActions.loadProjects({accountId: this.accountId}),
    );
  }

  private loadEntries() {
    this.store.dispatch(
      TimeTrackingActions.loadTimeEntries({
        accountId: this.accountId,
        userId: this.userId,
        weekStart: this.currentWeekStart,
      }),
    );
  }

  private updateEntriesObservable() {
    if (this.entriesSub) {
      this.subscriptions.remove(this.entriesSub);
      this.entriesSub.unsubscribe();
    }
    this.entries$ = this.store.select(
      selectEntries(this.accountId, this.userId, this.currentWeekStart),
    );
    this.entriesSub = this.entries$.subscribe((entries) => {
      this.entries = entries;
      const ids = new Set(entries.map((e) => e.projectId));
      this.initialRows = Array.from(ids).map((id) => ({projectId: id}));
    });
    this.subscriptions.add(this.entriesSub);
  }

  nextWeek() {
    const nextWeekStart = new Date(this.currentWeekStart);
    nextWeekStart.setDate(this.currentWeekStart.getDate() + 7);

    // Check if next week is more than one week in the future
    const maxFutureWeek = new Date(this.todaysWeekStart);
    maxFutureWeek.setDate(this.todaysWeekStart.getDate() + 7);

    if (nextWeekStart > maxFutureWeek) {
      this.showToast(
        "Cannot navigate more than one week into the future",
        "warning",
      );
      return;
    }

    this.currentWeekStart = nextWeekStart;
    this.updateEntriesObservable();
    this.loadEntries();
  }

  previousWeek() {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.updateEntriesObservable();
    this.loadEntries();
  }

  ngOnDestroy() {
    this.store.dispatch(TimeTrackingActions.clearTimeTrackingSubscriptions());
    this.subscriptions.unsubscribe();
  }

  getCurrentWeekLabel(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };
    return this.currentWeekStart.toLocaleDateString("en-US", options);
  }

  getCurrentWeekRange(): string {
    const endDate = new Date(this.currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);

    const startOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const endOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    const startStr = this.currentWeekStart.toLocaleDateString(
      "en-US",
      startOptions,
    );
    const endStr = endDate.toLocaleDateString("en-US", endOptions);

    return `${startStr} - ${endStr}`;
  }

  /**
   * Check if the current week's entries are approved (cannot be edited)
   */
  isCurrentWeekApproved(): boolean {
    if (!this.entries || this.entries.length === 0) {
      return false;
    }

    const statuses = this.entries.map((entry) => entry.status || "draft");
    return statuses.every((status) => status === "approved");
  }

  /**
   * Check if the current week can be edited (not pending, rejected, or approved)
   */
  canEditCurrentWeek(): boolean {
    if (!this.entries || this.entries.length === 0) {
      return true; // Can edit if no entries exist
    }

    const statuses = this.entries.map((entry) => entry.status || "draft");
    // Can edit if ALL entries are drafts OR rejected (so users can fix rejected timesheets)
    return statuses.every(
      (status) => status === "draft" || status === "rejected",
    );
  }

  /**
   * Get the status of the current week for display
   */
  getCurrentWeekStatus():
    | "draft"
    | "pending"
    | "approved"
    | "rejected"
    | "mixed" {
    if (!this.entries || this.entries.length === 0) {
      return "draft";
    }

    const statuses = this.entries.map((entry) => entry.status || "draft");
    const uniqueStatuses = [...new Set(statuses)];

    if (uniqueStatuses.length === 1) {
      return uniqueStatuses[0] as "draft" | "pending" | "approved" | "rejected";
    }

    return "mixed";
  }

  /**
   * Get a user-friendly message explaining why the week cannot be edited
   */
  getWeekStatusMessage(): string {
    const status = this.getCurrentWeekStatus();

    switch (status) {
      case "pending":
        return 'This timesheet is pending approval and cannot be edited. Use "Withdraw" to make changes.';
      case "approved":
        return "This timesheet has been approved and cannot be modified.";
      case "rejected":
        return "This timesheet was rejected. You can now make changes and resubmit.";
      case "mixed":
        return "This timesheet has entries with different statuses. You can submit to convert all to pending.";
      default:
        return "";
    }
  }

  /**
   * Withdraw a pending submission to allow editing
   */
  withdrawSubmission(): void {
    if (this.getCurrentWeekStatus() !== "pending") {
      this.showToast("Only pending submissions can be withdrawn", "warning");
      return;
    }

    // Change all pending entries back to draft status
    const draftEntries = this.entries.map((entry) => ({
      ...entry,
      status: "draft" as const,
    }));

    // Dispatch action to update all entries
    draftEntries.forEach((entry) => {
      this.store.dispatch(TimeTrackingActions.saveTimeEntry({entry}));
    });

    this.showToast(
      "Submission withdrawn. You can now edit your timesheet.",
      "success",
    );
  }

  /**
   * Check if the user is viewing the current week
   */
  isViewingCurrentWeek(): boolean {
    return this.currentWeekStart.getTime() === this.todaysWeekStart.getTime();
  }

  /**
   * Return to the current week (today's week)
   */
  returnToCurrentWeek(): void {
    this.currentWeekStart = new Date(this.todaysWeekStart);
    this.updateEntriesObservable();
    this.loadEntries();
  }

  /**
   * Check if the current week can be submitted for approval
   */
  canSubmitCurrentWeek(): boolean {
    if (!this.entries || this.entries.length === 0) {
      return false; // Can't submit if no entries exist
    }

    // Check if any entries are for archived projects
    if (this.hasArchivedProjectEntries()) {
      return false; // Can't submit if any entries are for archived projects
    }

    const status = this.getCurrentWeekStatus();
    // Can submit if draft, rejected, or mixed (but not pending or approved)
    return status === "draft" || status === "rejected" || status === "mixed";
  }

  /**
   * Check if there are any time entries for archived projects
   */
  hasArchivedProjectEntries(): boolean {
    return this.entries.some((entry) => {
      const project = this.allProjectsForValidation.find(
        (p) => p.id === entry.projectId,
      );
      return project?.archived === true;
    });
  }

  /**
   * Get list of archived projects that have time entries
   */
  getArchivedProjectsWithEntries(): Project[] {
    const archivedProjectIds = new Set(
      this.entries
        .filter((entry) => {
          const project = this.allProjectsForValidation.find(
            (p) => p.id === entry.projectId,
          );
          return project?.archived === true;
        })
        .map((entry) => entry.projectId),
    );

    return this.allProjectsForValidation.filter(
      (project) => project.archived && archivedProjectIds.has(project.id),
    );
  }

  /**
   * Get the appropriate submit button text based on current status
   */
  getSubmitButtonText(): string {
    if (this.hasArchivedProjectEntries()) {
      return "Cannot Submit (Archived Projects)";
    }

    const status = this.getCurrentWeekStatus();
    switch (status) {
      case "mixed":
        return "Submit All for Approval";
      case "rejected":
        return "Resubmit for Approval";
      default:
        return "Submit for Approval";
    }
  }

  /**
   * Get warning message for archived projects
   */
  getArchivedProjectWarning(): string {
    if (!this.hasArchivedProjectEntries()) {
      return "";
    }

    const archivedProjects = this.getArchivedProjectsWithEntries();
    const projectNames = archivedProjects.map((p) => p.name);

    return `Warning: Time entries exist for archived ${projectNames.length === 1 ? "project" : "projects"}: ${projectNames.join(", ")}. These entries cannot be submitted.`;
  }

  submitForApproval() {
    if (this.entries.length === 0) {
      this.showToast("No time entries to submit", "warning");
      return;
    }

    // Check for archived project entries specifically
    if (this.hasArchivedProjectEntries()) {
      const archivedProjects = this.getArchivedProjectsWithEntries();
      const projectNames = archivedProjects.map((p) => p.name);

      this.showToast(
        `Cannot submit timesheet: ${projectNames.join(", ")} ${projectNames.length === 1 ? "is" : "are"} archived. Please remove time entries for archived projects before submitting.`,
        "danger",
      );
      return;
    }

    if (!this.canSubmitCurrentWeek()) {
      this.showToast(
        "This timesheet cannot be submitted in its current state",
        "warning",
      );
      return;
    }

    // Set submitting state
    this.isSubmitting = true;

    // Show immediate loading feedback
    this.showToast("Submitting timesheet...", "primary");

    // Get current user info for display in approval process
    this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user) => {
        if (!user) {
          this.showToast("User information not available", "danger");
          this.isSubmitting = false;
          return;
        }

        // Get user display name (prefer displayName, fall back to name or email)
        const userName =
          user.displayName || user.name || user.email || "Unknown User";

        // Get the original status before submission for better success message
        const originalStatus = this.getCurrentWeekStatus();

        // Update all entries with user name, project name, and status
        const pendingEntries = this.entries.map((entry) => {
          // Find the project for this entry to get the project name
          const project = this.allProjectsForValidation.find(
            (p) => p.id === entry.projectId,
          );
          const projectName = project?.name || "Unknown Project";

          return {
            ...entry,
            status: "pending" as const, // Change from any status to pending for approval
            userName: userName,
            projectName: projectName,
          };
        });

        // Optimistically update local entries for immediate UI feedback
        this.entries = pendingEntries;

        // Dispatch action to submit timesheet
        this.store.dispatch(
          TimeTrackingActions.submitTimesheetForApproval({
            accountId: this.accountId,
            userId: this.userId,
            weekStart: this.currentWeekStart,
            entries: pendingEntries,
          }),
        );

        // Notify admins of timesheet submission
        this.store
          .select(selectRelatedAccountsByAccountId(this.accountId))
          .pipe(first())
          .subscribe((relatedAccounts) => {
            if (relatedAccounts) {
              const adminUserIds = relatedAccounts
                .filter((related) => related.access === "admin")
                .map((related) => related.accountId);

              if (adminUserIds.length > 0) {
                this.notificationService.notifyTimesheetSubmitted(
                  pendingEntries,
                  this.currentWeekStart,
                  adminUserIds,
                );
              }
            }
          });

        // Show success feedback with context based on original status
        setTimeout(() => {
          this.isSubmitting = false;
          let message = `Timesheet submitted! Status changed to "Pending Approval"`;

          if (originalStatus === "mixed") {
            message = `All time entries submitted! Status changed to "Pending Approval"`;
          } else if (originalStatus === "rejected") {
            message = `Timesheet resubmitted! Status changed to "Pending Approval"`;
          }

          this.showToast(message, "success");
        }, 500);
      });
  }

  getTimesheetStatusText(): string {
    if (!this.entries || this.entries.length === 0) {
      return "No Entries";
    }

    const statuses = this.entries.map((entry) => entry.status || "draft");
    const uniqueStatuses = [...new Set(statuses)];

    if (uniqueStatuses.length === 1) {
      switch (uniqueStatuses[0]) {
        case "draft":
          return "Draft";
        case "pending":
          return "Pending Approval";
        case "approved":
          return "Approved";
        case "rejected":
          return "Rejected";
        default:
          return "Unknown";
      }
    } else {
      // Mixed statuses
      if (statuses.some((s) => s === "draft")) {
        return "Draft (Mixed)";
      } else if (statuses.some((s) => s === "pending")) {
        return "Pending (Mixed)";
      } else {
        return "Mixed Status";
      }
    }
  }

  getTimesheetStatusColor(): string {
    if (!this.entries || this.entries.length === 0) {
      return "medium";
    }

    const statuses = this.entries.map((entry) => entry.status || "draft");

    if (statuses.some((s) => s === "rejected")) {
      return "danger";
    } else if (statuses.every((s) => s === "approved")) {
      return "success";
    } else if (statuses.some((s) => s === "pending")) {
      return "warning";
    } else {
      return "primary"; // draft
    }
  }

  getTimesheetStatusIcon(): string {
    if (!this.entries || this.entries.length === 0) {
      return "document-outline";
    }

    const statuses = this.entries.map((entry) => entry.status || "draft");

    if (statuses.some((s) => s === "rejected")) {
      return "close-circle";
    } else if (statuses.every((s) => s === "approved")) {
      return "checkmark-circle";
    } else if (statuses.some((s) => s === "pending")) {
      return "time";
    } else {
      return "create"; // draft
    }
  }

  private async showToast(message: string, color: string = "primary") {
    const {ToastController} = await import("@ionic/angular");
    const toastController = new ToastController();
    const toast = await toastController.create({
      message,
      duration: 3000,
      color,
      position: "top",
    });
    await toast.present();
  }
  //   startOfWeek(date: Date): Date {
  //     const d = new Date(date);
  //     d.setHours(0, 0, 0, 0);
  //     const day = d.getDay();
  //     d.setDate(d.getDate() - day);
  //     return d;
  //   }

  //   previousWeek() {
  //     const prev = new Date(this.currentWeekStart);
  //     prev.setDate(prev.getDate() - 7);
  //     this.currentWeekStart = prev;
  //   }

  //   nextWeek() {
  //     const next = new Date(this.currentWeekStart);
  //     next.setDate(next.getDate() + 7);
  //     this.currentWeekStart = next;
  //   }
}
