import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {SignupPage} from "./signup.page";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [SignupPage],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LegalModalComponent,
    RouterModule.forChild([{path: "", component: SignupPage}]),
  ],
  exports: [SignupPage],
})
export class SignupPageModule {}
