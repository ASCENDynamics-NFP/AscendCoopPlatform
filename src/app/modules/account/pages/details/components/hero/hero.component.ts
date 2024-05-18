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
import {Account} from "../../../../../../models/account.model";
import {FormsModule} from "@angular/forms";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";
import {RouterModule} from "@angular/router";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ImageUploadModalComponent,
  ],
})
export class HeroComponent {
  @Input() account?: Partial<Account>;
  @Input() isProfileOwner: boolean = false;

  constructor(private modalController: ModalController) {}

  get hasDonationURL() {
    // find Donation category in account.webLinks array return boolean
    return this.account?.webLinks?.some(
      (webLink) => webLink?.category?.toLowerCase() === "donation",
    );
  }

  async openImageUploadModal() {
    if (!this.account?.id || !this.isProfileOwner) return;
    let modal = await this.modalController.create({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "accounts",
        docId: this.account?.id,
        firestoreLocation: `accounts/${this.account?.id}/profile`,
        maxHeight: 300,
        maxWidth: 900,
        fieldName: "heroImage",
      },
    });

    await modal.present();
  }

  onLink(category: string) {
    if (this.account?.webLinks) {
      const webLink = this.account.webLinks.find(
        (link) => link.category?.toLowerCase() === category.toLowerCase(),
      );
      if (webLink && webLink.url) {
        window.open(webLink.url, "_blank");
      } else {
        console.error(`No URL found for category: ${category}`);
      }
    } else {
      console.error("No web links available.");
    }
  }
}
