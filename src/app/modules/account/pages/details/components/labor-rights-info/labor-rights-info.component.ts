/***********************************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 ***********************************************************************************************/
import {Component, Input} from "@angular/core";
import {PrivacyService} from "../../../../../../core/services/privacy.service";

@Component({
  selector: "app-labor-rights-info",
  templateUrl: "./labor-rights-info.component.html",
  styleUrls: ["./labor-rights-info.component.scss"],
})
export class LaborRightsInfoComponent {
  @Input() laborRights: any | null | undefined;
  @Input() privacySettings: any = null;
  @Input() isOwnerOrAdmin: boolean = false;

  constructor(private privacy: PrivacyService) {}

  get privacyData(): {visibility: string; color: string; label: string} {
    const visibility = this.privacy.getSectionVisibility(
      this.privacySettings,
      "laborRights",
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
