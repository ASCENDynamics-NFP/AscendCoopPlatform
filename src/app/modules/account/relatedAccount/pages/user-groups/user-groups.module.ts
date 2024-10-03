import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {UserGroupsPage} from "./user-groups.page";
import {SharedModule} from "../../../../../shared/shared.module";

@NgModule({
  declarations: [UserGroupsPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{path: "", component: UserGroupsPage}]),
    SharedModule,
  ],
  exports: [UserGroupsPage],
})
export class UserGroupsPageModule {}
