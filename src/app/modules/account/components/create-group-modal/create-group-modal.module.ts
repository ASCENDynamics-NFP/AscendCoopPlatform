import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {CreateGroupModalComponent} from "./create-group-modal.component";

@NgModule({
  declarations: [CreateGroupModalComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  exports: [CreateGroupModalComponent], // Export to be used elsewhere
})
export class CreateGroupModalModule {}
