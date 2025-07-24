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
  @Input() projects: Project[] = [];
  @Input() availableProjects: Project[] = [];
  @Input() entries: TimeEntry[] = [];
  @Input() accountId: string = "";
  @Input() userId: string = "";

  days: Date[] = [];
  dropdownOpen = false;

  rowTotals: {[projectId: string]: number} = {};
  columnTotals: number[] = [];
  totalHours = 0;

  constructor(private store: Store) {}

  ngOnInit() {
    this.calculateDays();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["weekStart"]) {
      this.calculateDays();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entries"]) {
      this.updateTotals();
    }
  }

  getEntry(projectId: string, day: Date): TimeEntry | undefined {
    return this.entries.find((e) => {
      return (
        e.projectId === projectId &&
        e.date.toDate().toDateString() === day.toDateString()
      );
    });
  }

  onHoursChange(project: Project, day: Date, event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    const hours = Number(target.value);
    if (isNaN(hours)) {
      return;
    }
    const existing = this.getEntry(project.id, day);
    if (!existing && (!target.value || hours === 0)) {
      return;
    }
    const entry: TimeEntry = {
      id: existing ? existing.id : "",
      accountId: this.accountId,
      projectId: project.id,
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

  toggleProjectDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(id: string): boolean {
    return this.projects.some((p) => p.id === id);
  }

  addProjectById(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (!target) return;

    const id = target.value;
    const project = this.availableProjects.find((p) => p.id === id);
    if (project && !this.isSelected(id)) {
      this.projects.push(project);
    }
    this.dropdownOpen = false;
  }

  private updateTotals() {
    this.rowTotals = {};
    this.columnTotals = new Array(this.days.length).fill(0);
    this.totalHours = 0;

    for (const project of this.projects) {
      let rowSum = 0;
      for (let i = 0; i < this.days.length; i++) {
        const day = this.days[i];
        const entry = this.getEntry(project.id, day);
        const hrs = entry ? entry.hours : 0;
        rowSum += hrs;
        this.columnTotals[i] += hrs;
      }
      this.rowTotals[project.id] = rowSum;
      this.totalHours += rowSum;
    }
  }
}
