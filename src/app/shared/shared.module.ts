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
// src/app/shared/shared.module.ts

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateGroupModalComponent} from "../modules/account/components/create-group-modal/create-group-modal.component";
import {AppHeaderComponent} from "./components/app-header/app-header.component";
import {FeedbackModalComponent} from "./components/feedback-modal/feedback-modal.component";
import {UserMenuComponent} from "./components/user-menu/user-menu.component";
import {ImageUploadModalComponent} from "./components/image-upload-modal/image-upload-modal.component";

@NgModule({
  declarations: [
    AppHeaderComponent,
    CreateGroupModalComponent,
    FeedbackModalComponent,
    ImageUploadModalComponent,
    UserMenuComponent,
  ],
  imports: [
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AppHeaderComponent,
    CreateGroupModalComponent,
    FeedbackModalComponent,
    ImageUploadModalComponent,
    UserMenuComponent,
  ],
})
export class SharedModule {}
