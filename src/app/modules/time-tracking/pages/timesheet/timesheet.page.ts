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
import {selectActiveProjectsByAccount} from "../../../../state/selectors/projects.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {TimeEntry} from "../../../../../../shared/models/time-entry.model";
import {AppState} from "../../../../state/app.state";

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
  entries: TimeEntry[] = [];
  initialRows: {projectId: string}[] = [];
  private subscriptions = new Subscription();
  private entriesSub?: Subscription;
  accountId: string = "";
  userId: string = "";
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
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get("accountId") ?? "";

    // Load account information
    this.store.dispatch(
      AccountActions.loadAccount({accountId: this.accountId}),
    );
    this.account$ = this.store.select(selectAccountById(this.accountId));

    this.projects$ = this.store.select(
      selectActiveProjectsByAccount(this.accountId),
    );

    const projSub = this.projects$.subscribe((projects) => {
      this.availableProjects = projects;
    });
    this.subscriptions.add(projSub);

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
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
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

  saveTimesheet() {
    // TODO: Implement save functionality
    console.log("Saving timesheet...");
  }

  submitForApproval() {
    if (this.entries.length === 0) {
      this.showToast("No time entries to submit", "warning");
      return;
    }

    // Get current user info for display in approval process
    this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user) => {
        if (!user) {
          this.showToast("User information not available", "danger");
          return;
        }

        // Get user display name (prefer displayName, fall back to name or email)
        const userName =
          user.displayName || user.name || user.email || "Unknown User";

        // Update all entries with user name, project name, and status
        const pendingEntries = this.entries.map((entry) => {
          // Find the project for this entry to get the project name
          const project = this.availableProjects.find(
            (p) => p.id === entry.projectId,
          );
          const projectName = project?.name || "Unknown Project";

          return {
            ...entry,
            status: "pending" as const, // Change from draft to pending for approval
            userName: userName,
            projectName: projectName,
          };
        });

        // Dispatch action to submit timesheet
        this.store.dispatch(
          TimeTrackingActions.submitTimesheetForApproval({
            accountId: this.accountId,
            userId: this.userId,
            weekStart: this.currentWeekStart,
            entries: pendingEntries,
          }),
        );

        this.showToast("Timesheet submitted for approval", "success");
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
