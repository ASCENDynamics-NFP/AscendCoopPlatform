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
// src/app/modules/listing/relatedAccount/pages/applicants/components/applicant-details-modal/applicant-details-modal.component.ts

import {Component, Input} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../../../state/app.state";
import {
  ListingRelatedAccount,
  ApplicationStatus,
} from "@shared/models/listing-related-account.model";
import * as ListingsActions from "../../../../../../../state/actions/listings.actions";

@Component({
  selector: "app-applicant-details-modal",
  templateUrl: "./applicant-details-modal.component.html",
  styleUrls: ["./applicant-details-modal.component.scss"],
})
export class ApplicantDetailsModalComponent {
  @Input() relatedAccount!: ListingRelatedAccount;
  @Input() isOwner: boolean = false;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private store: Store<AppState>,
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  copyEmail() {
    navigator.clipboard.writeText(this.relatedAccount.email);
    this.showToast("Email copied to clipboard!");
  }

  rejectApplication() {
    this.updateApplicationStatus("declined", "Application declined!");
  }

  acceptApplication() {
    this.updateApplicationStatus("accepted", "Application accepted!");
  }

  viewProfile() {
    this.router.navigate(["/account", this.relatedAccount.id]);
    this.closeModal();
  }

  messageApplicant() {
    // Navigate to new chat with pre-selected recipient
    this.router.navigate(["/messaging/new-chat"], {
      queryParams: {recipientId: this.relatedAccount.id},
    });
    this.closeModal();
  }

  // Update status to reviewing
  markAsReviewing() {
    this.updateApplicationStatus("reviewing", "Marked as reviewing!");
  }

  // Update status to interviewed
  markAsInterviewed() {
    this.updateApplicationStatus("interviewed", "Marked as interviewed!");
  }

  private updateApplicationStatus(
    status: ApplicationStatus,
    successMessage: string,
  ) {
    const updatedAccount = {
      ...this.relatedAccount,
      status,
    };

    // Dispatch an action to update the status in the store
    this.store.dispatch(
      ListingsActions.updateRelatedAccount({
        listingId: this.relatedAccount.listingId,
        relatedAccount: updatedAccount,
      }),
    );

    this.showToast(successMessage);
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
