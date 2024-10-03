import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";

import {FriendsPage} from "./friends.page";
import {SharedModule} from "../../../../../shared/shared.module";

@NgModule({
  declarations: [FriendsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: FriendsPage,
      },
    ]),
    SharedModule,
  ],
})
export class FriendsPageModule {}
