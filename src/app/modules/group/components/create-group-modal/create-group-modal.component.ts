/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {Component} from "@angular/core";
import {IonicModule, ModalController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {AppGroup} from "../../../../models/group.model";
import {StoreService} from "../../../../core/services/store.service";

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
    private storeService: StoreService,
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, "cancel");
  }

  confirm() {
    return this.modalCtrl.dismiss(null, "confirm");
  }

  onSubmit() {
    const group = this.groupForm.value as Partial<AppGroup>;
    group.members = [];
    group.admins = [];
    group.logoImage = "assets/icon/favicon.png";
    group.heroImage = "assets/image/orghero.png";

    this.storeService.createDoc("groups", group).then((groupId) => {
      this.modalCtrl.dismiss({groupId: groupId}, "confirm");
    });
  }
}
