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
import {AppUser} from "../../../../../../models/user.model"; // import your user model
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ImageUploadModalComponent],
})
export class HeroComponent {
  @Input() user?: Partial<AppUser>; // define your user here

  constructor(private modalController: ModalController) {}

  async openImageUploadModal() {
    const modal = await this.modalController.create({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "users",
        docId: this.user?.id,
        firestoreLocation: `users/${this.user?.id}/profile`,
        maxHeight: 200,
        maxWidth: 200,
      },
    });

    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      const profileImageUrl = data;
    }
  }
}
