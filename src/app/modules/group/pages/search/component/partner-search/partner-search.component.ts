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
import {Subscription} from "rxjs";
import {StoreService} from "../../../../../../core/services/store.service";
import {AppGroup} from "../../../../../../models/group.model";
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
  @Input() currentGroup: Partial<AppGroup> | undefined;
  private groupsSubscription: Subscription | undefined;
  private groups: Partial<AppGroup>[] | null = [];
  private searchTerm: string = "";
  searchResults: Partial<AppGroup>[] | null = [];

  constructor(private storeService: StoreService) {}

  ionViewWillEnter() {
    this.groupsSubscription = this.storeService.groups$.subscribe((groups) => {
      if (groups) {
        this.groups = groups;
        this.searchResults = this.groups;
        if (this.searchTerm) {
          this.searchResults = groups.filter((group) =>
            group.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
          );
        }
      }
    });
  }

  ionViewWillLeave() {
    // Unsubscribe from the groups$ observable when the component is destroyed
    this.groupsSubscription?.unsubscribe();
  }

  searchGroups(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      this.storeService.searchDocsByName("groups", this.searchTerm);
    } else {
      this.searchResults = this.storeService.getCollection("groups");
      this.searchResults = this.searchResults.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }
  }

  sendPartnerGroupRequest(group: Partial<AppGroup>) {
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
      receiverImage: group.logoImage,
      receiverTagline: group.tagline,
      senderName: this.currentGroup?.name ? this.currentGroup.name : "",
      senderImage: this.currentGroup?.logoImage
        ? this.currentGroup.logoImage
        : "",
      senderTagline: this.currentGroup?.tagline
        ? this.currentGroup.tagline
        : "",
    };

    this.storeService.createDoc("relationships", relationship).then(() => {
      // Update the group's pendingRelatedGroups in the state
      if (!group.pendingRelatedGroups) {
        group.pendingRelatedGroups = [];
      }
      group.pendingRelatedGroups = this.currentGroup?.id
        ? [...group.pendingRelatedGroups, this.currentGroup.id]
        : [...group.pendingRelatedGroups];
      this.storeService.updateDocInState("groups", group);
    });
  }
}
