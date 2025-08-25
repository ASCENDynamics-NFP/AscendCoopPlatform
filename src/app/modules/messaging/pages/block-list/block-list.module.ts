import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {BlockListPageRoutingModule} from "./block-list-routing.module";
import {BlockListPageComponent} from "./block-list.page";
import {BlockListComponent} from "../../components/block-list/block-list.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    BlockListPageRoutingModule,
  ],
  declarations: [BlockListPageComponent, BlockListComponent],
})
export class BlockListPageModule {}
