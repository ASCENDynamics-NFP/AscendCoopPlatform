import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {LoginPage} from "./login.page";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{path: "", component: LoginPage}]),
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [LoginPage],
})
export class LoginPageModule {}
