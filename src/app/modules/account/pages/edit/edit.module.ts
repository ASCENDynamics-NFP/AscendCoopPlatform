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
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {EditPage} from "./edit.page";
import {EditMenuComponent} from "./components/edit-menu/edit-menu.component";
import {BasicInfoComponent} from "./components/basic-info/basic-info.component";
import {ContactInfoComponent} from "./components/contact-info/contact-info.component";
import {ProfessionalInfoComponent} from "./components/professional-info/professional-info.component";
import {VolunteerPreferenceInfoComponent} from "./components/volunteer-preference-info/volunteer-preference-info.component";
import {SharedModule} from "../../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {LaborRightsInfoComponent} from "./components/labor-rights-info/labor-rights-info.component";
import {MutualAidCommunityEngagementComponent} from "./components/mutual-aid-community-engagement/mutual-aid-community-engagement.component";

@NgModule({
  declarations: [
    EditPage,
    EditMenuComponent,
    BasicInfoComponent,
    ContactInfoComponent,
    ProfessionalInfoComponent,
    VolunteerPreferenceInfoComponent,
    LaborRightsInfoComponent,
    MutualAidCommunityEngagementComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([{path: "", component: EditPage}]),
    TranslateModule,
  ],
})
export class EditPageModule {}
