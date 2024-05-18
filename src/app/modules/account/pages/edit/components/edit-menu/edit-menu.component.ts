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
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {IonicModule, ModalController} from "@ionic/angular";
import {Account} from "../../../../../../models/account.model";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";

@Component({
  selector: "app-edit-menu",
  templateUrl: "./edit-menu.component.html",
  styleUrls: ["./edit-menu.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ImageUploadModalComponent],
})
export class EditMenuComponent {
  @Input() account?: Partial<Account>;
  @Input() isProfileOwner: boolean = true; // define if the user is the current user (for edit profile button
  @Output() itemSelected = new EventEmitter<string>();
  selectedItem: string | null = "basic";

  constructor(private modalController: ModalController) {}

  async openImageUploadModal() {
    if (!this.account?.id || !this.isProfileOwner) return;
    let modal = await this.modalController.create({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "accounts",
        docId: this.account?.id,
        firestoreLocation: `accounts/${this.account?.id}/profile`,
        maxHeight: 200,
        maxWidth: 200,
        fieldName: "iconImage",
      },
    });

    await modal.present();
  }

  selectItem(item: string): void {
    this.selectedItem = item;
    this.itemSelected.emit(item);
  }
}
