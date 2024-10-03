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
  exports: [SearchPage],
})
export class SearchPageModule {}
