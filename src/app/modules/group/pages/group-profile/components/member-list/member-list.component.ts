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
import {AppRelationship} from "../../../../../../models/relationship.model";
import {AppGroup} from "../../../../../../models/group.model";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MemberListComponent {
  @Input() group: Partial<AppGroup> | null = null; // define your group here
  @Input() memberList: Partial<AppRelationship>[] = [];

  constructor(private router: Router) {}

  get allMembers() {
    let allMembers = [];
    for (let member of this.memberList) {
      if (member.status !== "accepted") continue;
      if (member.senderId === this.group?.id) {
        allMembers.push({
          id: member.receiverId,
          name: member.receiverName,
          image: member.receiverImage,
          tagline: member.receiverTagline,
        });
      } else {
        allMembers.push({
          id: member.senderId,
          name: member.senderName,
          image: member.senderImage,
          tagline: member.senderTagline,
        });
      }
    }
    return allMembers;
  }

  goToUserProfile(id: string | undefined) {
    this.router.navigate([`/user-profile/${id}`]);
  }

  goToMemberList() {
    if (this.group?.id) {
      this.router.navigate([
        `/group/${this.group.id}/${this.group.id}/members`,
      ]);
    }
  }
}
