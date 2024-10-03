import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {MemberListPage} from "./member-list.page";

@NgModule({
  declarations: [MemberListPage],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [MemberListPage],
})
export class MemberListModule {}
