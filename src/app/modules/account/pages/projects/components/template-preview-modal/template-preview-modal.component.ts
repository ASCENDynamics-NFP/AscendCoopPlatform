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
import {StandardProjectTemplate} from "../../../../../../../../shared/models/standard-project-template.model";

@Component({
  selector: "app-template-preview-modal",
  templateUrl: "./template-preview-modal.component.html",
  styleUrls: ["./template-preview-modal.component.scss"],
})
export class TemplatePreviewModalComponent {
  @Input() template!: StandardProjectTemplate;

  constructor(private modalController: ModalController) {}

  dismiss(): void {
    this.modalController.dismiss();
  }

  getComplexityColor(): string {
    switch (this.template.complexity) {
      case "Simple":
        return "success";
      case "Moderate":
        return "warning";
      case "Complex":
        return "danger";
      default:
        return "medium";
    }
  }

  getTimeframeIcon(): string {
    switch (this.template.estimatedTimeframe) {
      case "Short-term":
        return "time-outline";
      case "Medium-term":
        return "calendar-outline";
      case "Long-term":
        return "calendar-number-outline";
      case "Ongoing":
        return "infinite-outline";
      default:
        return "time-outline";
    }
  }
}
