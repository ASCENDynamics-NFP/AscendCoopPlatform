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
import {Router} from "@angular/router";
import {PrivacyService} from "../../../../../../core/services/privacy.service";
import {Account, RelatedAccount} from "@shared/models/account.model";

@Component({
  selector: "app-related-accounts",
  templateUrl: "./related-accounts.component.html",
  styleUrls: ["./related-accounts.component.scss"],
})
export class RelatedAccountsComponent {
  @Input() account: Account = {} as Account;
  @Input() relatedAccounts: RelatedAccount[] = [];
  @Input() type: "user" | "group" = "user";
  @Input() isProfileOwner: boolean = false;
  @Input() isGroupAdmin: boolean = false;
  @Input() privacySettings: any = null;
  // Viewer context for privacy evaluation
  @Input() isRelatedViewer: boolean = false;
  @Input() viewerId: string | null = null;

  constructor(
    private router: Router,
    private privacy: PrivacyService,
  ) {}

  get title() {
    if (this.type === "user") {
      return this.account?.type === "user" ? "Friends" : "Members";
    }
    return "Organizations";
  }

  private matchesList(ra: RelatedAccount): boolean {
    // Accept only current relationships and filter purely by related account entity type
    if (ra.status !== "accepted") return false;
    return ra.type === this.type;
  }

  get filteredRelatedAccounts() {
    return this.relatedAccounts.filter((ra) => this.matchesList(ra));
  }

  goToRelatedAccount(id: string | undefined) {
    if (id) {
      this.router.navigate(["/account", id]);
    }
  }

  get isOwnerOrAdmin(): boolean {
    return this.isProfileOwner || this.isGroupAdmin;
  }

  private get sectionKey(): string {
    // Unified keys based on related account entity type
    return this.type === "user" ? "userList" : "organizationList";
  }

  private canViewSection(): boolean {
    return this.privacy.canViewSection(this.privacySettings, this.sectionKey, {
      isOwnerOrAdmin: this.isOwnerOrAdmin,
      isRelated: this.isRelatedViewer,
      viewerId: this.viewerId,
    });
  }

  // Expose visibility to the template without leaking implementation
  get canView(): boolean {
    return this.canViewSection();
  }

  get visibleRelatedAccounts() {
    return this.canViewSection() ? this.filteredRelatedAccounts : [];
  }

  get privacyData(): {visibility: string; color: string; label: string} {
    if (!this.privacySettings) {
      return {visibility: "public", color: "success", label: "Public"};
    }

    const visibility = this.privacy.getSectionVisibility(
      this.privacySettings,
      this.sectionKey,
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
        return {text: "Private", color: "danger"};
      default:
        return {text: v, color: "medium"};
    }
  }

  viewAll() {
    if (this.account?.id) {
      this.router.navigate([
        `/account/${this.account.id}/related/${this.type}`,
      ]);
    }
  }
}
