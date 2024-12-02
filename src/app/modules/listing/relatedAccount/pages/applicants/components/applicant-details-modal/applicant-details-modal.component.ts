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
import {Component, Input} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {ListingRelatedAccount} from "../../../../../../../models/listing-related-account.model";

@Component({
  selector: "app-applicant-details-modal",
  templateUrl: "./applicant-details-modal.component.html",
  styleUrls: ["./applicant-details-modal.component.scss"],
})
export class ApplicantDetailsModalComponent {
  @Input() relatedAccount!: ListingRelatedAccount; // Use the ListingRelatedAccount model

  constructor(
    private modalController: ModalController,
    private router: Router,
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  copyEmail() {
    navigator.clipboard.writeText(this.relatedAccount.email);
    this.showToast("Email copied to clipboard!");
  }

  rejectApplication() {
    this.relatedAccount.status = "rejected"; // Update the status for UI feedback
    this.showToast("Application rejected!");
    this.closeModal();
    // Add rejection logic here
  }

  acceptApplication() {
    this.relatedAccount.status = "accepted"; // Update the status for UI feedback
    this.showToast("Application accepted!");
    this.closeModal();
    // Add acceptance logic here
  }

  viewProfile() {
    this.router.navigate(["/account", this.relatedAccount.accountId]);
    this.closeModal();
  }

  async showToast(message: string) {
    const toast = document.createElement("ion-toast");
    toast.message = message;
    toast.duration = 2000;
    document.body.appendChild(toast);
    await toast.present();
  }
}
