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
import {StoreService} from "../../../../../../core/services/store.service";
import {Account} from "../../../../../../models/account.model";
import {AppRelationship} from "../../../../../../models/relationship.model";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-partner-search",
  templateUrl: "./partner-search.component.html",
  styleUrls: ["./partner-search.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class PartnerSearchComponent {
  @Input() isAdmin: boolean = false;
  @Input() currentGroup?: Partial<Account>;
  @Input() groups: Partial<Account>[] | null = [];
  private searchTerm: string = "";

  constructor(private storeService: StoreService) {}

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  get searchResults() {
    if (!this.groups) {
      return [];
    }
    if (!this.searchTerm) {
      return this.groups;
    }
    return this.groups.filter((group) =>
      group.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  searchGroups(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      this.storeService.searchDocsByName("groups", this.searchTerm);
    }
  }

  sendPartnerGroupRequest(group: Partial<Account>) {
    if (!this.currentGroup?.id || !group.id) {
      console.log("No current group or group ID");
      return;
    }
    const relationship: Partial<AppRelationship> = {
      relatedIds: [this.currentGroup.id, group.id],
      senderId: this.currentGroup.id,
      receiverId: group.id,
      type: "group",
      status: "pending",
      membershipRole: "partner",
      receiverRelationship: "group",
      senderRelationship: "group",
      receiverName: group.name,
      receiverImage: group.iconImage,
      receiverTagline: group.tagline,
      senderName: this.currentGroup?.name ? this.currentGroup.name : "",
      senderImage: this.currentGroup?.iconImage
        ? this.currentGroup.iconImage
        : "",
      senderTagline: this.currentGroup?.tagline
        ? this.currentGroup.tagline
        : "",
    };

    this.storeService.createDoc("relationships", relationship).then(() => {
      // Update the group's pendingRelatedGroups in the state
      // if (!group.pendingRelatedGroups) {
      //   group.pendingRelatedGroups = [];
      // }
      // group.pendingRelatedGroups = this.currentGroup?.id
      //   ? [...group.pendingRelatedGroups, this.currentGroup.id]
      //   : [...group.pendingRelatedGroups];
      this.storeService.updateDocInState("accounts", group);
    });
  }
}
