import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";

import {ListPage} from "./list.page";
import {SharedModule} from "../../../../../shared/shared.module";

@NgModule({
  declarations: [ListPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: ListPage,
      },
    ]),
    SharedModule,
  ],
})
export class ListPageModule {}
