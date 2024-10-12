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
import {SearchPage} from "./search.page";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {PartnerSearchComponent} from "./component/partner-search/partner-search.component";
import {MemberSearchComponent} from "./component/member-search/member-search.component";

@NgModule({
  declarations: [SearchPage, PartnerSearchComponent, MemberSearchComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [],
})
export class SearchPageModule {}
