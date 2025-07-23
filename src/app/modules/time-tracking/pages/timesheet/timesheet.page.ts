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

import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {Project} from "@shared/models/project.model";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";

@Component({
  selector: "app-timesheet",
  templateUrl: "./timesheet.page.html",
  styleUrls: ["./timesheet.page.scss"],
})
export class TimesheetPage implements OnInit {
  projects$!: Observable<Project[]>;
  accountId: string = ""; // You'll need to get this from route params or auth service

  constructor(private store: Store<{timeTracking: {projects: Project[]}}>) {}

  ngOnInit() {
    this.projects$ = this.store.select((state) => state.timeTracking.projects);
    this.store.dispatch(
      TimeTrackingActions.loadProjects({accountId: this.accountId}),
    );
  }
}
