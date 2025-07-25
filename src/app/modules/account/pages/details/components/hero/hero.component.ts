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
// src/app/modules/account/pages/details/components/hero/hero.component.ts

import {Component, Input} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {Account} from "@shared/models/account.model";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent {
  @Input() account!: Account; // Changed from Partial<Account> to Account to ensure properties are defined
  @Input() isProfileOwner: boolean = false;
  @Input() isGroupAdmin = false;

  constructor(private modalController: ModalController) {}

  get hasDonationURL(): boolean {
    return (
      this.account.webLinks?.some(
        (webLink) => webLink?.category?.toLowerCase() === "donation",
      ) || false
    );
  }

  get getLocation(): string {
    if (this.account?.contactInformation?.addresses?.length) {
      const address = this.account.contactInformation.addresses[0];
      return `${address?.city} / ${address?.country}`;
    }
    return "";
  }

  async openImageUploadModal(): Promise<void> {
    if (!this.account.id || !this.isProfileOwner) return;
    const modal = await this.modalController.create({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "accounts",
        docId: this.account.id,
        firestoreLocation: `accounts/${this.account.id}/profile`,
        maxHeight: 300,
        maxWidth: 900,
        fieldName: "heroImage",
      },
    });

    await modal.present();
  }

  onLink(category: string): void {
    const webLink = this.account.webLinks?.find(
      (link) => link.category?.toLowerCase() === category.toLowerCase(),
    );
    if (webLink?.url) {
      window.open(webLink.url, "_blank");
    } else {
      console.error(`No URL found for category: ${category}`);
    }
  }
}
