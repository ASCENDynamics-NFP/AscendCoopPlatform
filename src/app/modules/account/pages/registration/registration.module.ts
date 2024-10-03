import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {RegistrationPage} from "./registration.page";
import {GroupRegistrationComponent} from "./components/group-registration/group-registration.component";
import {UserRegistrationComponent} from "./components/user-registration/user-registration.component";
import {SharedModule} from "../../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    RegistrationPage,
    GroupRegistrationComponent,
    UserRegistrationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{path: "", component: RegistrationPage}]), // Route for the component
    SharedModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class RegistrationPageModule {}
