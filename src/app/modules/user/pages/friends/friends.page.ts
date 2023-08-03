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
import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

import {ActivatedRoute, RouterModule} from "@angular/router";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class FriendsPage implements OnInit {
  currentFriendsList: any[] = [];
  pendingFriendsList: any[] = [];
  userId: string | null = null;
  currentUser: any;
  constructor(
    private authService: AuthService,

    private activatedRoute: ActivatedRoute,
    private relationshipsCollectionService: RelationshipsCollectionService,
  ) {}

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get("uid");
    this.relationshipsCollectionService
      .getRelationships(this.userId)
      .then((relationships) => {
        this.currentUser = this.authService.getCurrentUser();
        for (let relationship of relationships) {
          if (
            relationship.type === "friend" &&
            relationship.status === "accepted"
          ) {
            this.currentFriendsList.push(
              this.relationshipToFriend(relationship),
            );
          } else if (
            relationship.type === "friend" &&
            relationship.status === "pending" &&
            this.currentUser?.uid === this.userId
          ) {
            this.pendingFriendsList.push(
              this.relationshipToFriend(relationship),
            );
          }
        }
      });
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  acceptFriendRequest(friend: any) {
    this.relationshipsCollectionService
      .updateRelationship(friend.id, {
        status: "accepted",
      })
      .then(() => {
        friend.showRemoveButton = true;
        this.currentFriendsList.push(friend);
        this.pendingFriendsList = this.pendingFriendsList.filter(
          (pendingFriend) => pendingFriend.id !== friend.id,
        );
      });
  }

  rejectFriendRequest(friend: any) {
    this.relationshipsCollectionService
      .updateRelationship(friend.id, {
        status: "rejected",
      })
      .then(() => {
        this.pendingFriendsList = this.pendingFriendsList.filter(
          (pendingFriend) => pendingFriend.id !== friend.id,
        );
      });
  }

  removeFriendRequest(friend: any) {
    this.relationshipsCollectionService
      .deleteRelationship(friend.id)
      .then(() => {
        this.currentFriendsList = this.currentFriendsList.filter(
          (currentFriend) => currentFriend.id !== friend.id,
        );
        this.pendingFriendsList = this.pendingFriendsList.filter(
          (pendingFriend) => pendingFriend.id !== friend.id,
        );
      });
  }

  relationshipToFriend(relationship: any) {
    this.userId = this.userId ? this.userId : "";
    const isCurrentUser = this.currentUser?.uid === this.userId;
    if (relationship.senderId === this.userId) {
      // my requests
      return {
        id: relationship.id,
        userId: relationship.receiverId,
        name: relationship.receiverName,
        image: relationship.receiverImage,
        tagline: relationship.receiverTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: isCurrentUser,
        showAcceptRejectButtons: false,
      };
    } else {
      // other's requests
      return {
        id: relationship.id,
        userId: relationship.senderId,
        name: relationship.senderName,
        image: relationship.senderImage,
        tagline: relationship.senderTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: relationship.status === "accepted" && isCurrentUser,
        showAcceptRejectButtons: isCurrentUser,
      };
    }
  }
}
