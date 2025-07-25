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
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subscription, combineLatest, BehaviorSubject} from "rxjs";
import {map, filter} from "rxjs/operators";
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
import {AlertController, ToastController} from "@ionic/angular";

interface GroupedEntries {
  userId: string;
  userName: string;
  userEmail: string;
  weekStart: Date;
  entries: TimeEntry[];
  totalHours: number;
  status: "pending" | "approved" | "rejected";
}

interface ProjectGroupedEntries {
  projectId: string;
  projectName: string;
  totalHours: number;
  users: {
    userId: string;
    userName: string;
    entries: TimeEntry[];
    totalHours: number;
    status: "pending" | "approved" | "rejected";
  }[];
}

type ViewMode = "all" | "by-user" | "by-project";

@Component({
  selector: "app-approvals",
  templateUrl: "./approvals.page.html",
  styleUrls: ["./approvals.page.scss"],
})
export class ApprovalsPage implements OnInit, OnDestroy {
  accountId: string = "";
  account$!: Observable<Account | undefined>;
  currentUser$!: Observable<AuthUser | null>;
  groupedEntries$!: Observable<GroupedEntries[]>;
  projectGroupedEntries$!: Observable<ProjectGroupedEntries[]>;

  // Navigation and filtering properties
  currentWeekStart: Date = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  })();

  viewMode: ViewMode = "by-user";
  showAllWeeks = false;

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

  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get("accountId") ?? "";

    // Load account data
    this.account$ = this.store.select(selectAccountById(this.accountId));
    this.currentUser$ = this.store.select(selectAuthUser);

    // Initialize reactive streams with current values
    this.showAllWeeks$.next(this.showAllWeeks);
    this.currentWeekStart$.next(this.currentWeekStart);

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
      this.account$,
      this.showAllWeeks$,
      this.currentWeekStart$,
    ]).pipe(
      filter(([entries, account]) => !!entries && !!account),
      map(([entries, account, showAllWeeks, currentWeekStart]) => {
        const filteredEntries = showAllWeeks
          ? entries
          : this.filterEntriesByWeek(entries, currentWeekStart);
        return this.groupEntriesByUserAndWeek(filteredEntries, account!);
      }),
    );

    this.projectGroupedEntries$ = combineLatest([
      this.store.select(selectAllEntriesForAccount(this.accountId)),
      this.account$,
      this.showAllWeeks$,
      this.currentWeekStart$,
    ]).pipe(
      filter(([entries, account]) => !!entries && !!account),
      map(([entries, account, showAllWeeks, currentWeekStart]) => {
        const filteredEntries = showAllWeeks
          ? entries
          : this.filterEntriesByWeek(entries, currentWeekStart);
        return this.groupEntriesByProject(filteredEntries, account!);
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.showAllWeeks$.complete();
    this.currentWeekStart$.complete();
  }

  private groupEntriesByUserAndWeek(
    entries: TimeEntry[],
    account: Account,
  ): GroupedEntries[] {
    const grouped = new Map<string, GroupedEntries>();

    entries.forEach((entry) => {
      // Get the start of the week for this entry
      const entryDate = entry.date.toDate();
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
        const statusOrder = {pending: 0, approved: 1, rejected: 2};
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
      const entryDate = entry.date.toDate();
      return entryDate >= weekStart && entryDate < weekEnd;
    });
  }

  private groupEntriesByProject(
    entries: TimeEntry[],
    account: Account,
  ): ProjectGroupedEntries[] {
    const grouped = new Map<string, ProjectGroupedEntries>();

    entries.forEach((entry) => {
      const projectId = entry.projectId;
      const projectName = entry.projectName || "Unknown Project";

      if (!grouped.has(projectId)) {
        grouped.set(projectId, {
          projectId,
          projectName,
          totalHours: 0,
          users: [],
        });
      }

      const project = grouped.get(projectId)!;

      // Find or create user group within this project
      let userGroup = project.users.find((u) => u.userId === entry.userId);
      if (!userGroup) {
        userGroup = {
          userId: entry.userId,
          userName: entry.userName || "Unknown User",
          entries: [],
          totalHours: 0,
          status: "pending",
        };
        project.users.push(userGroup);
      }

      userGroup.entries.push(entry);
      userGroup.totalHours += entry.hours;
      project.totalHours += entry.hours;

      // Update user name if this entry has a more complete name
      if (entry.userName && entry.userName !== "Unknown User") {
        userGroup.userName = entry.userName;
      }

      // Determine overall status for the user within this project
      if (userGroup.entries.some((e) => e.status === "rejected")) {
        userGroup.status = "rejected";
      } else if (userGroup.entries.every((e) => e.status === "approved")) {
        userGroup.status = "approved";
      } else {
        userGroup.status = "pending";
      }
    });

    return Array.from(grouped.values()).sort((a, b) => {
      return a.projectName.localeCompare(b.projectName);
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
          placeholder: "Reason for rejection (optional)",
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
            this.updateTimesheetStatus(group, "rejected", data.reason);
          },
        },
      ],
    });

    await alert.present();
  }

  private updateTimesheetStatus(
    group: GroupedEntries,
    status: "approved" | "rejected",
    notes?: string,
  ) {
    // Get current user for audit trail
    this.currentUser$
      .pipe(filter((user) => !!user))
      .subscribe((currentUser) => {
        const approvalTimestamp = Timestamp.now();

        group.entries.forEach((entry) => {
          const statusChange = {
            status,
            changedBy: currentUser!.uid,
            changedByName:
              currentUser!.displayName || currentUser!.email || "Unknown",
            changedAt: approvalTimestamp,
            reason: notes,
          };

          const updatedEntry: TimeEntry = {
            ...entry,
            status,
            // Audit fields
            approvedBy: currentUser!.uid,
            approvedByName:
              currentUser!.displayName || currentUser!.email || "Unknown",
            approvedAt: approvalTimestamp,
            rejectionReason: status === "rejected" ? notes : undefined,
            originalHours: entry.originalHours || entry.hours, // Preserve original if not already set
            statusHistory: [...(entry.statusHistory || []), statusChange],
            // Update notes with rejection reason if applicable
            notes:
              notes && status === "rejected"
                ? `${entry.notes || ""}\n\nRejection reason: ${notes}`.trim()
                : entry.notes,
          };

          this.store.dispatch(
            TimeTrackingActions.updateTimeEntry({entry: updatedEntry}),
          );
        });

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

  toggleShowAllWeeks(event: any) {
    this.showAllWeeks = event.detail.checked;
    this.showAllWeeks$.next(this.showAllWeeks);
  }

  setViewMode(mode: any) {
    if (
      mode &&
      (mode === "all" || mode === "by-user" || mode === "by-project")
    ) {
      this.viewMode = mode as ViewMode;
    }
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
}
