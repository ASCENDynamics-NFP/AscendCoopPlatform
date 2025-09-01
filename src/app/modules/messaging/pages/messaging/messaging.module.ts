import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {MessagingPageRoutingModule} from "./messaging-routing.module";
import {SharedModule} from "../../../../shared/shared.module";
import {MessagingPage} from "./messaging.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule,
    MessagingPageRoutingModule,
  ],
  declarations: [MessagingPage],
})
export class MessagingPageModule {}
