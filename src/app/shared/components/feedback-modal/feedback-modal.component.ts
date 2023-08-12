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
import {FormsModule} from "@angular/forms";
import {IonicModule, ModalController} from "@ionic/angular";
import {User} from "firebase/auth";
import {StoreService} from "../../../core/services/store.service";
import {AppFeedback} from "../../../models/feedback.model";

@Component({
  selector: "app-feedback-modal",
  templateUrl: "./feedback-modal.component.html",
  styleUrls: ["./feedback-modal.component.scss"],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class FeedbackModalComponent {
  @Input() user?: User; // You can replace 'any' with your user type if you have one
  public feedbackText: string = "";

  constructor(
    private modalCtrl: ModalController,
    private storeService: StoreService,
  ) {}

  submitFeedback() {
    // Here you can send the feedback to your server or handle it as you wish
    this.storeService.createDoc("feedback", {
      email: this.user?.email,
      ame: this.user?.displayName,
      emailVerified: this.user?.emailVerified,
      feedback: this.feedbackText,
      type: "feedback",
      isRead: false,
      isResolved: false,
    } as Partial<AppFeedback>);
    // Close the modal after submitting
    this.modalCtrl.dismiss();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
