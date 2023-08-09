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
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {AppGroup} from "../../../../../../models/group.model";
import {AppRelationship} from "../../../../../../models/relationship.model";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class GroupListComponent {
  @Input() group: Partial<AppGroup> | null = null; // define your group here
  @Input() groupList: Partial<AppRelationship>[] = [];

  constructor(private router: Router) {}

  get allGroups() {
    let allGroups = [];
    for (let relationship of this.groupList) {
      if (relationship.status !== "accepted") continue;
      if (relationship.senderId === this.group?.id) {
        allGroups.push({
          id: relationship.receiverId,
          name: relationship.receiverName,
          image: relationship.receiverImage,
          tagline: relationship.receiverTagline,
        });
      } else {
        allGroups.push({
          id: relationship.senderId,
          name: relationship.senderName,
          image: relationship.senderImage,
          tagline: relationship.senderTagline,
        });
      }
    }
    return allGroups;
  }

  goToUserProfile(id: string | undefined) {
    this.router.navigate([`/group-profile/${id}`]);
  }

  goToPartnersList() {
    if (this.group?.id) {
      this.router.navigate([
        `/group/${this.group.id}/partners/${this.group.id}/groups`,
      ]);
    }
  }
}
