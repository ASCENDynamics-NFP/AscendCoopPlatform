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
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {Store} from "@ngrx/store";
import {Timestamp} from "firebase/firestore";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {Project} from "@shared/models/project.model";
import {TimeEntry} from "@shared/models/time-entry.model";

@Component({
  selector: "app-week-view",
  templateUrl: "./week-view.component.html",
  styleUrls: ["./week-view.component.scss"],
})
export class WeekViewComponent implements OnInit, OnChanges {
  @Input() weekStart: Date = new Date();
  @Input() availableProjects: Project[] = [];
  @Input() entries: TimeEntry[] = [];
  @Input() accountId: string = "";
  @Input() userId: string = "";
  @Input() initialRows: {projectId: string | null}[] = [];

  /** Selected rows referencing project ids */
  rows: {projectId: string | null}[] = [];

  days: Date[] = [];

  rowTotals: number[] = [];
  columnTotals: number[] = [];
  totalHours = 0;

  constructor(private store: Store) {}

  ngOnInit() {
    this.calculateDays();
    if (this.rows.length === 0) {
      if (this.initialRows && this.initialRows.length > 0) {
        this.rows = [...this.initialRows];
      } else if (this.availableProjects.length === 1) {
        this.rows.push({projectId: this.availableProjects[0].id});
      } else {
        this.rows.push({projectId: null});
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entries"]) {
      this.updateTotals();
    }
    if (changes["weekStart"]) {
      this.calculateDays();
    }
    if (changes["initialRows"] && this.rows.length === 0) {
      const rows: {projectId: string | null}[] =
        changes["initialRows"].currentValue;
      if (rows && rows.length > 0) {
        this.rows = [...rows];
        this.updateTotals();
      }
    } else if (changes["availableProjects"] && this.rows.length === 0) {
      if (this.availableProjects.length === 1) {
        this.rows.push({projectId: this.availableProjects[0].id});
      }
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
    return this.entries.find((e) => {
      return (
        e.projectId === projectId &&
        e.date.toDate().toDateString() === day.toDateString()
      );
    });
  }

  onHoursChange(rowIndex: number, day: Date, event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    const projectId = this.rows[rowIndex]?.projectId;
    if (!projectId) {
      return;
    }

    const hours = Number(target.value);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      return;
    }
    const existing = this.getEntry(projectId, day);
    if (!existing && (!target.value || hours === 0)) {
      return;
    }
    if (existing && hours === 0) {
      this.entries = this.entries.filter((e) => e !== existing);
      this.updateTotals();
      this.store.dispatch(
        TimeTrackingActions.deleteTimeEntry({entry: existing}),
      );
      return;
    }
    const entry: TimeEntry = {
      id: existing ? existing.id : "",
      accountId: this.accountId,
      projectId,
      userId: existing ? existing.userId : this.userId,
      date: existing ? existing.date : Timestamp.fromDate(day),
      hours,
      status: existing ? existing.status : "pending",
      notes: existing?.notes,
    };
    if (existing) {
      existing.hours = hours;
    } else {
      this.entries.push(entry);
    }
    this.updateTotals();
    this.store.dispatch(TimeTrackingActions.saveTimeEntry({entry}));
  }

  isSelected(id: string, excludeIndex?: number): boolean {
    return this.rows.some(
      (r, idx) => r.projectId === id && idx !== excludeIndex,
    );
  }

  addRow() {
    this.rows.push({
      projectId:
        this.availableProjects.length === 1
          ? this.availableProjects[0].id
          : null,
    });
    this.updateTotals();
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
    this.updateTotals();
  }

  addProjectById(index: number, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (!target) return;

    const id = target.value;
    if (this.isSelected(id, index)) return;
    const project = this.availableProjects.find((p) => p.id === id);
    if (project) {
      this.rows[index].projectId = project.id;
    }
    this.updateTotals();
  }

  private updateTotals() {
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
}
