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
// src/app/modules/time-tracking/components/week-view/week-view.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {Store} from "@ngrx/store";
import {Timestamp} from "firebase/firestore";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {Project} from "../../../../../../shared/models/project.model";
import {TimeEntry} from "../../../../../../shared/models/time-entry.model";
import {
  StandardProjectCategory,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "../../../../../../shared/models/standard-project-template.model";
import {SuccessHandlerService} from "../../../../core/services/success-handler.service";
import {
  ToastController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import {NotesModalComponent} from "../notes-modal/notes-modal.component";

@Component({
  selector: "app-week-view",
  templateUrl: "./week-view.component.html",
  styleUrls: ["./week-view.component.scss"],
})
export class WeekViewComponent implements OnInit, OnChanges {
  @Input() weekStart: Date = new Date();
  @Input() availableProjects: Project[] = [];
  @Input() allProjects: Project[] = []; // Include archived projects for time entry display
  @Input() entries: TimeEntry[] = [];
  @Input() accountId: string = "";
  @Input() userId: string = "";
  @Input() currentUserName: string = "";
  @Input() initialRows: {projectId: string | null}[] = [];
  @Input() readonly: boolean = false;
  @Input() relatedAccounts: any[] = [];
  @Input() status: "draft" | "pending" | "approved" | "rejected" | "mixed" =
    "draft";
  @Output() addProjectClicked = new EventEmitter<void>();

  /** Selected rows referencing project ids */
  rows: {projectId: string | null}[] = [];

  days: Date[] = [];

  rowTotals: number[] = [];
  columnTotals: number[] = [];
  totalHours = 0;

  isLoading = false;

  constructor(
    private store: Store,
    private successHandler: SuccessHandlerService,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.calculateDays();
    if (
      this.rows.length === 0 &&
      this.initialRows &&
      this.initialRows.length > 0
    ) {
      this.rows = [...this.initialRows];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["entries"]) {
      // Update totals when entries change from parent component
      this.updateTotals();
    }
    if (changes["weekStart"]) {
      this.calculateDays();
    }
    if (changes["initialRows"]) {
      const rows: {projectId: string | null}[] =
        changes["initialRows"].currentValue;
      if (rows && rows.length > 0) {
        // Always update rows when initialRows changes, regardless of current row state
        this.rows = [...rows];
        this.updateTotals();
      }
    } else if (changes["availableProjects"]) {
      // Handle project changes (including archived projects being filtered out)
      this.handleProjectChanges();
    }
  }

  private calculateDays() {
    this.days = [];
    const start = new Date(this.weekStart);
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      this.days.push(day);
    }
    this.updateTotals();
  }

  getEntry(projectId: string, day: Date): TimeEntry | undefined {
    const toJsDate = (val: any): Date | null => {
      try {
        if (!val) return null;
        if (typeof val.toDate === "function") return val.toDate();
        if (val instanceof Date) return val as Date;
        if (typeof val === "string") return new Date(val);
        // Fallback attempt (e.g., {seconds, nanoseconds})
        if (
          typeof val === "object" &&
          "seconds" in val &&
          "nanoseconds" in val
        ) {
          const ms = val.seconds * 1000 + Math.floor(val.nanoseconds / 1e6);
          return new Date(ms);
        }
        return new Date(val);
      } catch {
        return null;
      }
    };

    return this.entries.find((e) => {
      if (e.projectId !== projectId) return false;
      const d = toJsDate(e.date);
      return d ? d.toDateString() === day.toDateString() : false;
    });
  }

  onHoursChange(rowIndex: number, day: Date, event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    const projectId = this.rows[rowIndex]?.projectId;
    if (!projectId) {
      this.showValidationError(
        "Please select a project before entering hours.",
      );
      target.value = "";
      return;
    }

    // Validate that the project still exists in available projects
    const projectExists = this.availableProjects.some(
      (p) => p.id === projectId,
    );
    if (!projectExists) {
      this.showValidationError(
        "Selected project is no longer available. Please select a different project.",
      );
      target.value = "";
      return;
    }

    const inputValue = target.value;
    const hours = Number(inputValue);

    // Check if the existing entry is approved
    const existing = this.getEntry(projectId, day);
    if (existing && existing.status === "approved") {
      this.showValidationError(
        "Cannot modify approved time entries. Please contact an administrator if changes are needed.",
      );
      target.value = existing.hours.toString();
      return;
    }

    // Validate input
    if (inputValue !== "" && (isNaN(hours) || hours < 0 || hours > 24)) {
      // Show validation error and reset input
      this.showValidationError("Hours must be between 0 and 24");
      target.value = existing ? existing.hours.toString() : "";
      return;
    }

    // Auto-save immediately
    this.saveEntry(projectId, day, inputValue === "" ? 0 : hours);
  }

  isSelected(id: string, excludeIndex?: number): boolean {
    return this.rows.some(
      (r, idx) => r.projectId === id && idx !== excludeIndex,
    );
  }

  addRow() {
    if (this.availableProjects.length === 0) {
      this.showValidationError(
        "No projects available. Contact an administrator to create projects.",
      );
      return;
    }

    // Always add a new row without pre-selecting a project
    this.rows.push({
      projectId: null,
    });
    this.updateTotals();
  }

  async removeRow(index: number) {
    const row = this.rows[index];
    if (!row.projectId) {
      // No project selected, safe to remove
      this.rows.splice(index, 1);
      this.updateTotals();
      return;
    }

    // Check if this row has any time entries with hours > 0
    const entriesWithHours = this.days
      .map((day) => this.getEntry(row.projectId!, day))
      .filter(
        (entry): entry is TimeEntry => entry !== undefined && entry.hours > 0,
      );

    if (entriesWithHours.length === 0) {
      // No hours entered, safe to remove
      this.rows.splice(index, 1);
      this.updateTotals();
      return;
    }

    // Calculate total hours that will be deleted
    const totalHours = entriesWithHours.reduce(
      (sum, entry) => sum + entry.hours,
      0,
    );

    // Show confirmation dialog
    const alert = await this.alertController.create({
      header: "Delete Time Entries",
      message: `This will delete ${totalHours} hours of entered time for this project. This action cannot be undone. Continue?`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete",
          role: "destructive",
          handler: () => {
            this.deleteRowAndEntries(index, entriesWithHours);
          },
        },
      ],
    });

    await alert.present();
  }

  private deleteRowAndEntries(index: number, entries: TimeEntry[]) {
    // Delete all time entries for this project/row
    entries.forEach((entry) => {
      this.store.dispatch(TimeTrackingActions.deleteTimeEntry({entry}));
    });

    // Remove the row from UI
    this.rows.splice(index, 1);
    this.updateTotals();

    this.successHandler.handleSuccess(`Deleted ${entries.length} time entries`);
  }

  addProjectById(index: number, event: Event) {
    let id: string;

    // Handle both regular select and ion-select events
    if ("detail" in event && (event as any).detail) {
      // ion-select event
      id = (event as any).detail.value;
    } else {
      // regular select event
      const target = event.target as HTMLSelectElement;
      if (!target) return;
      id = target.value;
    }

    if (this.isSelected(id, index)) return;
    const project = this.availableProjects.find((p) => p.id === id);
    if (project) {
      this.rows[index].projectId = project.id;
    }
    this.updateTotals();
  }

  updateTotals() {
    this.rowTotals = [];
    this.columnTotals = new Array(this.days.length).fill(0);
    this.totalHours = 0;

    this.rows.forEach((row, rowIdx) => {
      let rowSum = 0;
      if (row.projectId) {
        for (let i = 0; i < this.days.length; i++) {
          const day = this.days[i];
          const entry = this.getEntry(row.projectId, day);
          const hrs = entry ? entry.hours : 0;
          rowSum += hrs;
          this.columnTotals[i] += hrs;
        }
      }
      this.rowTotals[rowIdx] = rowSum;
      this.totalHours += rowSum;
    });
  }

  private async showValidationError(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: "top",
      color: "danger",
    });
    await toast.present();
  }

  hasNotes(projectId: string, day: Date): boolean {
    const entry = this.getEntry(projectId, day);
    return !!(
      (entry?.notes && entry.notes.trim().length > 0) ||
      (entry?.noteHistory && entry.noteHistory.length > 0)
    );
  }

  async openNotesModal(projectId: string, day: Date) {
    const entry = this.getEntry(projectId, day);

    // Check if the entry is approved
    if (entry && entry.status === "approved") {
      this.showValidationError(
        "Cannot modify notes for approved time entries. Please contact an administrator if changes are needed.",
      );
      return;
    }

    const project = this.availableProjects.find((p) => p.id === projectId);

    const modal = await this.modalController.create({
      component: NotesModalComponent,
      componentProps: {
        entry: entry,
        date: day,
        projectName: project?.name || "Unknown Project",
        isAdmin: false, // TODO: Get from user role/permissions
      },
      cssClass: "notes-modal",
      backdropDismiss: true,
    });

    await modal.present();

    // Handle the result when modal is dismissed
    const result = await modal.onDidDismiss();
    if (result.data && (result.data.notes || result.data.noteHistory)) {
      // Auto-save notes immediately
      const currentHours = entry?.hours ?? 0;
      this.saveEntry(
        projectId,
        day,
        currentHours,
        result.data.notes,
        result.data.noteHistory,
      );
    }
  }

  /**
   * Check if a project is archived (no longer in active projects)
   */
  isProjectArchived(projectId: string): boolean {
    const activeProjectIds = this.availableProjects.map((p) => p.id);
    return !activeProjectIds.includes(projectId);
  }

  /**
   * Check if a time entry is approved
   */
  isEntryApproved(projectId: string, day: Date): boolean {
    const entry = this.getEntry(projectId, day);
    return entry?.status === "approved";
  }

  /**
   * Get project details (including archived ones)
   */
  getProjectDetails(projectId: string): Project | undefined {
    // First check active projects
    let project = this.availableProjects.find((p) => p.id === projectId);
    if (!project && this.allProjects) {
      // If not found in active, check all projects (including archived)
      project = this.allProjects.find((p) => p.id === projectId);
    }
    return project;
  }

  /**
   * Handle changes to available projects (e.g., when projects are archived)
   */
  private handleProjectChanges() {
    const activeProjectIds = this.availableProjects.map((p) => p.id);
    let hasOrphanedProjects = false;

    // Check for rows with projects that are no longer active (archived)
    this.rows.forEach((row, index) => {
      if (row.projectId && !activeProjectIds.includes(row.projectId)) {
        // Project was archived
        hasOrphanedProjects = true;

        // Check if this row has any time entries
        const hasEntries = this.days.some((day) => {
          const entry = this.getEntry(row.projectId!, day);
          return entry && entry.hours > 0;
        });

        if (hasEntries) {
          // Keep the row but mark it as archived
          // The UI will show it with a special indicator
          // Users can view existing entries but can't add new ones
        } else {
          // Remove the row if it has no time entries
          this.rows.splice(index, 1);
        }
      }
    });

    if (hasOrphanedProjects) {
      this.updateTotals();
    }
  }

  // Category-related methods for enhanced project selection
  get groupedProjects(): {[category: string]: Project[]} {
    const grouped: {[category: string]: Project[]} = {};

    this.availableProjects.forEach((project) => {
      const category = project.standardCategory || "general";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(project);
    });

    return grouped;
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.groupedProjects).sort();
  }

  getCategoryInfo(category: string) {
    const categoryInfo =
      STANDARD_PROJECT_CATEGORIES_INFO[category as StandardProjectCategory];
    if (categoryInfo) {
      return {
        name: category,
        description: categoryInfo.description,
        icon: categoryInfo.icon,
        color: categoryInfo.color,
      };
    }
    return {
      name: "General",
      description: "General projects",
      icon: "folder",
      color: "#666666",
    };
  }

  getProjectDisplayName(project: Project): string {
    if (project.standardCategory) {
      return `${project.name} (${project.standardCategory})`;
    }
    return project.name;
  }

  getClientName(projectId: string): string {
    const project = this.getProjectDetails(projectId);
    if (!project) return "";

    // If we have related accounts passed in (Global Mode), try to find the group name
    if (this.relatedAccounts && this.relatedAccounts.length > 0) {
      const account = this.relatedAccounts.find(
        (a) => a.id === project.accountId,
      );
      if (account) {
        return account.name;
      }
    }

    // Fallback or if in single account mode (we might want to pass the current account name too)
    return "";
  }

  /**
   * Save a single time entry immediately
   */
  private saveEntry(
    projectId: string,
    day: Date,
    hours: number,
    notes?: string,
    noteHistory?: any[],
  ) {
    const existing = this.getEntry(projectId, day);

    if (
      hours === 0 &&
      existing &&
      !notes &&
      !noteHistory &&
      (!existing.notes || existing.notes.trim() === "")
    ) {
      // Delete the entry only if no notes
      this.store.dispatch(
        TimeTrackingActions.deleteTimeEntry({entry: existing}),
      );
    } else if (
      hours > 0 ||
      notes ||
      noteHistory ||
      (existing && existing.notes)
    ) {
      // Get project to find the correct accountId
      const project = this.getProjectDetails(projectId);
      const entryAccountId = project?.accountId || this.accountId;

      // Create or update entry
      const entry: TimeEntry = {
        id: existing ? existing.id : "",
        accountId: entryAccountId,
        projectId,
        userId: existing ? existing.userId : this.userId,
        date: existing ? existing.date : Timestamp.fromDate(day),
        hours: hours > 0 ? hours : existing?.hours || 0,
        status:
          existing?.status === "rejected"
            ? "draft"
            : existing?.status || "draft",
        notes: notes !== undefined ? notes : existing?.notes || "",
        projectName: existing?.projectName || project?.name || "",
        userName: existing?.userName || this.currentUserName,
      };

      if (noteHistory) {
        entry.noteHistory = noteHistory;
      } else if (existing?.noteHistory) {
        entry.noteHistory = existing.noteHistory;
      }

      this.store.dispatch(TimeTrackingActions.saveTimeEntry({entry}));
    }
  }
}
