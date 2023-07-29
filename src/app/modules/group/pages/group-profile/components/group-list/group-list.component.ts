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
import {Component, Input, OnInit} from "@angular/core";
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
export class GroupListComponent implements OnInit {
  @Input() group: Partial<AppGroup> | null = null; // define your group here
  @Input() groupList: Partial<AppRelationship>[] = [];

  constructor(private router: Router) {}

  ngOnInit() {}

  get allGroups() {
    let allGroups = [];
    for (let group of this.groupList) {
      if (group.status !== "accepted") continue;
      if (group.senderId === this.group?.id) {
        allGroups.push({
          id: group.receiverId,
          name: group.receiverName,
          image: group.receiverImage,
          tagline: group.receiverTagline,
        });
      } else {
        allGroups.push({
          id: group.senderId,
          name: group.senderName,
          image: group.senderImage,
          tagline: group.senderTagline,
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
      this.router.navigate([`/group/${this.group.id}/partners`]);
    }
  }
}
