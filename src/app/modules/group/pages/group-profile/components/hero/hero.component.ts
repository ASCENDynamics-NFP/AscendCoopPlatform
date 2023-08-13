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
import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {IonicModule, ModalController} from "@ionic/angular";
import {AppGroup} from "../../../../../../models/group.model";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ImageUploadModalComponent],
})
export class HeroComponent {
  @Input() group: Partial<AppGroup> | null = null; // define your user here
  @Input() isAdmin: boolean = false;
  @Input() isMember: boolean = false;
  @Input() isPendingMember: boolean = false;

  constructor(private modalController: ModalController) {}

  async openImageUploadModal(imageType: string) {
    if (!this.group?.id || !this.isAdmin) return;
    if (imageType === "heroImage") {
      let modal = await this.modalController.create({
        component: ImageUploadModalComponent,
        componentProps: {
          collectionName: "groups",
          docId: this.group?.id,
          firestoreLocation: `groups/${this.group?.id}/profile`,
          maxHeight: 300,
          maxWidth: 900,
          fieldName: "heroImage",
        },
      });

      await modal.present();

      // const {data} = await modal.onWillDismiss();
      // if (data) {
      //   const profileImageUrl = data;
      // }
    } else if (imageType === "logoImage") {
      let modal = await this.modalController.create({
        component: ImageUploadModalComponent,
        componentProps: {
          collectionName: "groups",
          docId: this.group?.id,
          firestoreLocation: `groups/${this.group?.id}/profile`,
          maxHeight: 200,
          maxWidth: 200,
          fieldName: "logoImage",
        },
      });

      await modal.present();

      // const {data} = await modal.onWillDismiss();
      // if (data) {
      //   const profileImageUrl = data;
      // }
    }
  }
}
