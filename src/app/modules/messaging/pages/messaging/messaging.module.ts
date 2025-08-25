import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {MessagingPageRoutingModule} from "./messaging-routing.module";
import {MessagingPage} from "./messaging.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MessagingPageRoutingModule,
  ],
  declarations: [MessagingPage],
})
export class MessagingPageModule {}
