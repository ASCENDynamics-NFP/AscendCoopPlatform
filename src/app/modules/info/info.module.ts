/********************************************************************************
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
// src/app/modules/info/info.module.ts

import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import {SharedModule} from "../../shared/shared.module";
import {InfoRoutingModule} from "./info-routing.module";

import {AboutUsPage} from "./pages/about-us/about-us.page";
import {ServicesPage} from "./pages/services/services.page";
import {StartupsPage} from "./pages/startups/startups.page";
import {EventCalendarPage} from "./pages/event-calendar/event-calendar.page";
import {TeamPage} from "./pages/team/team.page";
import {ThinkTankPage} from "./pages/think-tank/think-tank.page";
import {PrivacyPolicyPage} from "./pages/privacy-policy/privacy-policy.page";
import {TermsOfUsePage} from "./pages/terms-of-use/terms-of-use.page";
import {ChildSafetyPage} from "./pages/child-safety/child-safety.page";
import {LandingPage} from "./pages/landing/landing.page";
import {InfoFooterComponent} from "./components/info-footer/info-footer.component";
import {HomepageListingsComponent} from "./components/homepage-listings/homepage-listings.component";
import {LeadFormComponent} from "./components/lead-form/lead-form.component";
import {TimeAgoPipe} from "../../shared/pipes/time-ago.pipe";

@NgModule({
  declarations: [
    AboutUsPage,
    ServicesPage,
    StartupsPage,
    EventCalendarPage,
    TeamPage,
    ThinkTankPage,
    PrivacyPolicyPage,
    TermsOfUsePage,
    ChildSafetyPage,
    LandingPage,
    InfoFooterComponent,
    HomepageListingsComponent,
    LeadFormComponent,
    TimeAgoPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    SharedModule,
    InfoRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InfoModule {}
