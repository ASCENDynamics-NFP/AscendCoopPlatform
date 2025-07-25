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
import {Project} from "@shared/models/project.model";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectEntries,
  selectProjects,
} from "../../../../state/selectors/time-tracking.selectors";
import {TimeEntry} from "@shared/models/time-entry.model";
import {AppState} from "../../../../state/app.state";

@Component({
  selector: "app-timesheet",
  templateUrl: "./timesheet.page.html",
  styleUrls: ["./timesheet.page.scss"],
})
export class TimesheetPage implements OnInit, OnDestroy {
  projects$!: Observable<Project[]>;
  entries$!: Observable<TimeEntry[]>;
  availableProjects: Project[] = [];
  entries: TimeEntry[] = [];
  initialRows: {projectId: string}[] = [];
  private subscriptions = new Subscription();
  accountId: string = "";
  userId: string = "";
  currentWeekStart: Date = (() => {
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

    this.projects$ = this.store.select(selectProjects);
    this.entries$ = this.store.select(selectEntries);

    const projSub = this.projects$.subscribe((projects) => {
      this.availableProjects = projects;
    });
    this.subscriptions.add(projSub);

    const entriesSub = this.entries$.subscribe((entries) => {
      this.entries = entries;
      const ids = new Set(entries.map((e) => e.projectId));
      this.initialRows = Array.from(ids).map((id) => ({projectId: id}));
    });
    this.subscriptions.add(entriesSub);

    const authSub = this.store
      .select(selectAuthUser)
      .pipe(first())
      .subscribe((user) => {
        this.userId = user?.uid ?? "";
        if (this.userId) {
          this.loadEntries();
        }
      });
    this.subscriptions.add(authSub);

    this.store.dispatch(
      TimeTrackingActions.loadProjects({accountId: this.accountId}),
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

  nextWeek() {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.loadEntries();
  }

  previousWeek() {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.loadEntries();
  }

  ngOnDestroy() {
    this.store.dispatch(TimeTrackingActions.clearTimeTrackingSubscriptions());
    this.subscriptions.unsubscribe();
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
