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
 *******************************************************************************/
// src/app/modules/time-tracking/time-tracking.module.ts

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {timeReducer} from "../../state/reducers/time.reducer";
import {TimeEffects} from "../../state/effects/time.effects";
import {TimerPage} from "./pages/timer/timer.page";
import {EntriesPage} from "./pages/entries/entries.page";
import {TimeTrackingRoutingModule} from "./time-tracking-routing.module";

@NgModule({
  declarations: [TimerPage, EntriesPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    TimeTrackingRoutingModule,
    StoreModule.forFeature("time", timeReducer),
    EffectsModule.forFeature([TimeEffects]),
  ],
})
export class TimeTrackingModule {}
