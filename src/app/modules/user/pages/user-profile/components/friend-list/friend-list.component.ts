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
import {AppUser} from "../../../../../../models/user.model";
import {AppRelationship} from "../../../../../../models/relationship.model";

@Component({
  selector: "app-friend-list",
  templateUrl: "./friend-list.component.html",
  styleUrls: ["./friend-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class FriendListComponent implements OnInit {
  @Input() user: Partial<AppUser> | null = null; // define your user here
  @Input() friendList: Partial<AppRelationship>[] = [];
  constructor(private router: Router) {}

  ngOnInit() {}

  get allFriends() {
    let allFriends = [];
    for (let friend of this.friendList) {
      if (friend.status !== "accepted") continue;
      if (friend.senderId === this.user?.id) {
        allFriends.push({
          id: friend.receiverId,
          name: friend.receiverName,
          image: friend.receiverImage,
          tagline: friend.receiverTagline,
        });
      } else {
        allFriends.push({
          id: friend.senderId,
          name: friend.senderName,
          image: friend.senderImage,
          tagline: friend.senderTagline,
        });
      }
    }
    return allFriends;
  }

  get userName() {
    return this.user?.displayName ? this.user.displayName : "";
  }

  get userTagline() {
    return this.user?.email ? this.user.email : "";
  }

  goToUserProfile(id: string | undefined) {
    this.router.navigate([`/user-profile/${id}`]);
  }

  goToFriendList() {
    if (this.user?.id) {
      this.router.navigate([`/user-profile/${this.user.id}/friends`]);
    }
  }
}
