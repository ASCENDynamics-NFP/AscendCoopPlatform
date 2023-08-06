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
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {AppRelationship} from "../../../../models/relationship.model";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class FriendsPage implements OnInit {
  private relationshipsSubscription: Subscription | undefined;
  relationships: Partial<AppRelationship>[] = [];
  currentFriendsList: any[] = [];
  pendingFriendsList: any[] = [];
  userId: string | null = null;
  currentUser: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get("uid");
  }

  ngOnInit() {
    if (this.userId) {
      this.storeService.getDocsWithSenderOrRecieverId(
        "relationships",
        this.userId,
      );
    }
  }

  ionViewWillEnter() {
    this.relationshipsSubscription = this.storeService.relationships$.subscribe(
      (relationships) => {
        this.relationships = relationships;
        this.sortRelationships(relationships);
      },
    );
  }

  ionViewWillLeave() {
    this.relationshipsSubscription?.unsubscribe();
  }

  acceptFriendRequest(friend: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === friend.id,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "accepted";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    friend.showRemoveButton = true;
    this.currentFriendsList.push(relationship);
    this.pendingFriendsList = this.pendingFriendsList.filter(
      (pendingFriend) => pendingFriend.id !== friend.id,
    );
  }

  rejectFriendRequest(friend: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === friend.id,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "rejected";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    this.pendingFriendsList = this.pendingFriendsList.filter(
      (pendingFriend) => pendingFriend.id !== friend.id,
    );
  }

  removeFriendRequest(friend: any) {
    if (friend.id) {
      this.storeService.deleteDoc("relationships", friend.id);
      // After deleting the relationship, execute the following logic
      this.currentFriendsList = this.currentFriendsList.filter(
        (currentFriend) => currentFriend.id !== friend.id,
      );
      this.pendingFriendsList = this.pendingFriendsList.filter(
        (pendingFriend) => pendingFriend.id !== friend.id,
      );
    }
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

  sortRelationships(relationships: Partial<AppRelationship>[]) {
    this.currentFriendsList = [];
    this.pendingFriendsList = [];

    this.currentUser = this.authStoreService.getCurrentUser();
    for (let relationship of relationships) {
      if (
        relationship.senderId === this.userId ||
        relationship.receiverId === this.userId
      ) {
        if (
          relationship.type === "friend" &&
          relationship.status === "accepted"
        ) {
          this.currentFriendsList.push(this.relationshipToFriend(relationship));
        } else if (
          relationship.type === "friend" &&
          relationship.status === "pending" &&
          this.currentUser?.uid === this.userId
        ) {
          this.pendingFriendsList.push(this.relationshipToFriend(relationship));
        }
      }
    }
  }
}
