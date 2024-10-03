import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {UsersPage} from "./users.page";
import {SharedModule} from "../../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";

// NgModule for UsersPage
@NgModule({
  declarations: [UsersPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{path: "", component: UsersPage}]),
    TranslateModule,
  ],
  exports: [UsersPage],
})
export class UsersPageModule {}
