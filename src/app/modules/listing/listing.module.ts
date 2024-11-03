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
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {ListingsPage} from "./pages/listings/listings.page";
import {ListingRoutingModule} from "./listing-routing.module";
import {listingsReducer} from "../../state/reducers/listings.reducer";
import {ListingsEffects} from "../../state/effects/listings.effects";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ListingDetailPage} from "./pages/listing-detail/listing-detail.page";
import {ListingEditPage} from "./pages/listing-edit/listing-edit.page";
import {ListingCreatePage} from "./pages/listing-create/listing-create.page";
import {TimestampPipe} from "../../shared/pipes/timestamp.pipe";
import {ListingFormComponent} from "./components/listing-form/listing-form.component";
import {FormatAddressPipe} from "../../shared/pipes/format-address.pipe";
import {HeroComponent} from "./pages/listing-detail/components/hero/hero.component";

@NgModule({
  declarations: [
    ListingsPage,
    ListingCreatePage,
    ListingDetailPage,
    ListingEditPage,
    TimestampPipe,
    ListingFormComponent,
    FormatAddressPipe,
    HeroComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    ListingRoutingModule,
    StoreModule.forFeature("listings", listingsReducer),
    EffectsModule.forFeature([ListingsEffects]),
  ],
})
export class ListingModule {}
