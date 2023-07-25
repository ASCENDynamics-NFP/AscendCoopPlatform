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
import {Router} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {AppRelationship} from "../../../../../../models/relationship.model";
import {User} from "firebase/auth";

@Component({
  selector: "app-group-membership-list",
  templateUrl: "./group-membership-list.component.html",
  styleUrls: ["./group-membership-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class GroupMembershipListComponent implements OnInit {
  @Input() user: User | null = null; // define your user here
  @Input() groupList: AppRelationship[] = []; // define your user here

  constructor(private router: Router) {}

  ngOnInit() {}

  get allGroups() {
    let allGroups = [];
    for (let group of this.groupList) {
      if (group.status !== "accepted") continue;
      if (group.senderId === this.user?.uid) {
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

  goToGroupPage(id: string) {
    this.router.navigate([`/group-profile/${id}`]);
  }

  goToGroupList() {
    this.router.navigate([`/group-list`]);
  }
}
