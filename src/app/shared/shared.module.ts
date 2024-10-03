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
