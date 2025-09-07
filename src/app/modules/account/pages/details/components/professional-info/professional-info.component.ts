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
import {ProfessionalInformation} from "@shared/models/account.model";
import {PrivacyService} from "../../../../../../core/services/privacy.service";

@Component({
  selector: "app-professional-info",
  templateUrl: "./professional-info.component.html",
  styleUrls: ["./professional-info.component.scss"],
})
export class ProfessionalInfoComponent {
  @Input() professionalInfo?: ProfessionalInformation | null;
  @Input() privacySettings: any = null;
  @Input() isOwnerOrAdmin: boolean = false;
  constructor(private privacy: PrivacyService) {}

  get privacyData(): {visibility: string; color: string; label: string} {
    const visibility = this.privacy.getSectionVisibility(
      this.privacySettings,
      "professionalInformation",
    );
    const {text, color} = this.mapVisibility(visibility);
    return {visibility, color, label: text};
  }

  private mapVisibility(v: string): {text: string; color: string} {
    switch (v) {
      case "public":
        return {text: "Public", color: "success"};
      case "authenticated":
        return {text: "Authorized", color: "medium"};
      case "related":
        return {text: "Related", color: "primary"};
      case "private":
      default:
        return {text: "Private", color: "danger"};
    }
  }
}
