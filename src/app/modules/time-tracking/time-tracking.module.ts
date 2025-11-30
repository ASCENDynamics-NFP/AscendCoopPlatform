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
// src/app/modules/time-tracking/time-tracking.module.ts

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {BaseChartDirective} from "ng2-charts";
import {TimeTrackingRoutingModule} from "./time-tracking-routing.module";
import {TimesheetPage} from "./pages/timesheet/timesheet.page";
import {ApprovalsPage} from "./pages/approvals/approvals.page";
import {ReportsPage} from "./pages/reports/reports.page";
import {WeekViewComponent} from "./components/week-view/week-view.component";
import {NotesModalComponent} from "./components/notes-modal/notes-modal.component";
import {AddProjectModalComponent} from "./components/add-project-modal/add-project-modal.component";
import {StatusHistoryModalComponent} from "./components/status-history-modal/status-history-modal.component";
import {timeTrackingReducer} from "../../state/reducers/time-tracking.reducer";
import {TimeTrackingEffects} from "../../state/effects/time-tracking.effects";
import {ProjectsEffects} from "../../state/effects/projects.effects";
import {SharedModule} from "../../shared/shared.module";
import {TimesheetNotificationService} from "./services/timesheet-notification.service";

@NgModule({
  declarations: [
    TimesheetPage,
    ApprovalsPage,
    ReportsPage,
    WeekViewComponent,
    NotesModalComponent,
    AddProjectModalComponent,
    StatusHistoryModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    SharedModule,
    TimeTrackingRoutingModule,
    BaseChartDirective,
    StoreModule.forFeature("timeTracking", timeTrackingReducer),
    EffectsModule.forFeature([TimeTrackingEffects, ProjectsEffects]),
  ],
  providers: [TimesheetNotificationService],
})
export class TimeTrackingModule {}
