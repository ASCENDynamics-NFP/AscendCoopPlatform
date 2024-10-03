import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {SettingsPage} from "./settings.page";
import {SettingsComponent} from "./components/settings/settings.component";
import {SharedModule} from "../../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{path: "", component: SettingsPage}]),
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [SettingsPage, SettingsComponent],
})
export class SettingsPageModule {}
