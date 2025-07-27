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
// src/app/modules/time-tracking/time-tracking-routing.module.ts

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TimesheetPage} from "./pages/timesheet/timesheet.page";
import {ApprovalsPage} from "./pages/approvals/approvals.page";
import {AuthGuard} from "../../core/guards/auth.guard";
import {TimeTrackingAccessGuard} from "../../core/guards/time-tracking-access.guard";

const routes: Routes = [
  {
    path: "",
    component: TimesheetPage,
    canActivate: [AuthGuard, TimeTrackingAccessGuard],
  },
  {
    path: "approvals",
    component: ApprovalsPage,
    canActivate: [AuthGuard, TimeTrackingAccessGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeTrackingRoutingModule {}
