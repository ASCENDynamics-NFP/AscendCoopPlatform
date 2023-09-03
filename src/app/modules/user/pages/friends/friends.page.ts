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
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {AppRelationship} from "../../../../models/relationship.model";
import {AppUser} from "../../../../models/user.model";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AppHeaderComponent,
  ],
})
/**
 * Represents a page where users can manage their friends.
 */
export class FriendsPage implements OnInit {
  private relationshipsSubscription?: Subscription;
  private usersSubscription?: Subscription;
  relationships: Partial<AppRelationship>[] = [];
  currentFriendsList: any[] = [];
  pendingFriendsList: any[] = [];
  userId: string | null = null;
  currentUser: any;
  user?: Partial<AppUser>;

  /**
   * Constructs the FriendsPage.
   * @param {ActivatedRoute} activatedRoute - The activated route.
   * @param {AuthStoreService} authStoreService - The authentication store service.
   * @param {StoreService} storeService - The store service.
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get("uid");
  }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized. Ran once per per page load.
   */
  ngOnInit() {
    if (this.userId) {
      this.storeService.getDocsWithSenderOrRecieverId(
        "relationships",
        this.userId,
      );
    }
  }

  /**
   * Lifecycle hook that is called when the page is about to enter.
   */
  ionViewWillEnter() {
    this.relationshipsSubscription = this.storeService.relationships$.subscribe(
      (relationships) => {
        this.relationships = relationships;
        this.sortRelationships(relationships);
      },
    );
    this.usersSubscription = this.storeService.users$.subscribe((users) => {
      this.user = users.find((u) => u.id === this.userId);
    });
  }

  /**
   * Lifecycle hook that is called when the page is about to leave.
   */
  ionViewWillLeave() {
    this.relationshipsSubscription?.unsubscribe();
    this.usersSubscription?.unsubscribe();
  }

  /**
   * Accepts a friend request.
   * @param {any} request - The friend request to accept.
   */
  acceptFriendRequest(request: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === request.relationshipId,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "accepted";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    this.addFriend(request);
  }

  /**
   * Rejects a friend request.
   * @param {any} request - The friend request to reject.
   */
  rejectFriendRequest(request: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === request.relationshipId,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "rejected";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, remove the friend from the pendingFriends list
    this.removeFriend(request);
  }

  /**
   * Removes a friend request.
   * @param {any} request - The friend request to remove.
   */
  removeFriendRequest(request: any) {
    if (request.friendId) {
      this.storeService.deleteDoc("relationships", request.relationshipId);
      // After deleting the relationship, update the user to remove the user from the friends and pendingFriends list
      this.removeFriend(request);
    }
  }

  /**
   * Adds a friend to the user's friend list and removes the friend from the pendingFriends list.
   * @param {any} request - The friend request to process.
   */
  addFriend(request: any) {
    const updatedDoc = this.storeService
      .getCollection("users")
      .find((u) => u["id"] === request.friendId);
    if (updatedDoc) {
      updatedDoc["friends"] = updatedDoc["friends"].push(this.userId);
      updatedDoc["pendingFriends"] = updatedDoc["pendingFriends"].filter(
        (pendingFriends: string) => pendingFriends !== this.userId,
      );
      // Use addDocToState to update the state
      this.storeService.addDocToState("users", updatedDoc);
    }
  }

  /**
   * Removes a friend from the user's friend list and removes the friend from the pendingFriends list.
   * @param {any} request - The friend request to process.
   */
  removeFriend(request: any) {
    const updatedDoc = this.storeService
      .getCollection("users")
      .find((u) => u["id"] === request.friendId);
    if (updatedDoc) {
      updatedDoc["friends"] = updatedDoc["friends"].filter(
        (friend: string) => friend !== this.userId,
      );
      updatedDoc["pendingFriends"] = updatedDoc["pendingFriends"].filter(
        (pendingFriends: string) => pendingFriends !== this.userId,
      );
      // Use addDocToState to update the state
      this.storeService.addDocToState("users", updatedDoc);
    }
  }

  /**
   * Converts a relationship object to a friend object.
   * @param {any} relationship - The relationship to convert.
   * @returns {any} - The converted friend object.
   */
  relationshipToFriend(relationship: any) {
    this.userId = this.userId ? this.userId : "";
    const isCurrentUser = this.currentUser?.uid === this.userId;
    if (relationship.senderId === this.userId) {
      // my requests
      return {
        relationshipId: relationship.id,
        friendId: relationship.receiverId,
        userId: relationship.senderId,
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
        relationshipId: relationship.id,
        friendId: relationship.senderId,
        userId: relationship.receiverId,
        name: relationship.senderName,
        image: relationship.senderImage,
        tagline: relationship.senderTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: relationship.status === "accepted" && isCurrentUser,
        showAcceptRejectButtons: isCurrentUser,
      };
    }
  }

  /**
   * Sorts relationships into current friends and pending friends lists.
   * @param {Partial<AppRelationship>[]} relationships - The relationships to sort.
   */
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
