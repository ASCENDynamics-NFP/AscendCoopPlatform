import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {GroupListPage} from "./group-list.page";
import {SharedModule} from "../../../../shared/shared.module";

@NgModule({
  declarations: [GroupListPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{path: "", component: GroupListPage}]),
    SharedModule,
  ],
  exports: [GroupListPage], // Make it exportable if needed elsewhere
})
export class GroupListPageModule {}
