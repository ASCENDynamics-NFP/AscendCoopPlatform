/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AuthRoutingModule} from "./auth-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {SignupPage} from "./pages/signup/signup.page";
import {LoginPage} from "./pages/login/login.page";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {authReducer} from "../../state/reducers/auth.reducer";
import {AuthEffects} from "../../state/effects/auth.effects";
import {LandingPage} from "./pages/landing/landing.page";
import {SharedModule} from "../../shared/shared.module";
import {HomepageListingsComponent} from "./pages/landing/components/homepage-listings/homepage-listings.component";
import {TimeAgoPipe} from "../../shared/pipes/time-ago.pipe";

@NgModule({
  declarations: [
    HomepageListingsComponent,
    LoginPage,
    SignupPage,
    LandingPage,
    TimeAgoPipe,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    StoreModule.forFeature("auth", authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  // exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule {}
