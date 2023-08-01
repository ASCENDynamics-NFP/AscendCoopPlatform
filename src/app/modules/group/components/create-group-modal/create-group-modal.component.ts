import {Component} from "@angular/core";
import {IonicModule, ModalController} from "@ionic/angular";
import {OverlayEventDetail} from "@ionic/core/components";
import {CommonModule} from "@angular/common";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {GroupsService} from "../../../../core/services/groups.service";
import {AppGroup} from "../../../../models/group.model";

@Component({
  selector: "app-create-group-modal",
  templateUrl: "./create-group-modal.component.html",
  styleUrls: ["./create-group-modal.component.scss"],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class CreateGroupModalComponent {
  groupForm = this.fb.group({
    name: ["", Validators.required],
    description: ["", Validators.required],
    tagline: ["", Validators.required],
  });

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private groupsService: GroupsService,
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, "cancel");
  }

  confirm() {
    return this.modalCtrl.dismiss(null, "confirm");
  }

  onSubmit() {
    this.groupsService
      .createGroup(this.groupForm.value as Partial<AppGroup>)
      .then((groupId) => {
        return this.modalCtrl.dismiss({groupId: groupId}, "confirm");
      });
  }
}
