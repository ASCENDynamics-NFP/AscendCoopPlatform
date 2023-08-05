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
import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {User} from "firebase/auth";
import {DocumentData} from "firebase/firestore";

import {RouterModule} from "@angular/router";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AppUser} from "../../../../models/user.model";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../core/services/auth-store.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.page.html",
  styleUrls: ["./users.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class UsersPage {
  private usersSubscription: Subscription;
  user: User | null = null; // define your user here
  userList: Partial<AppUser>[] | null = []; // define your user list here

  constructor(
    private authStoreService: AuthStoreService,
    private relationshipsCollectionService: RelationshipsCollectionService,
    private storeService: StoreService,
  ) {
    this.user = this.authStoreService.getCurrentUser();

    this.usersSubscription = this.storeService.users$.subscribe((users) => {
      if (users) {
        this.userList = users;
      }
    });
  } // inject your Firebase service

  ionViewWillEnter() {}

  ionViewWillLeave() {
    this.usersSubscription.unsubscribe();
  }

  sendFriendRequest(user: DocumentData) {
    this.relationshipsCollectionService
      .sendRequest({
        id: null,
        senderId: this.user?.uid ? this.user.uid : "",
        receiverId: user["id"],
        type: "friend",
        status: "pending",
        membershipRole: "",
        receiverRelationship: "friend",
        senderRelationship: "friend",
        receiverName: user["displayName"],
        receiverImage: user["profilePicture"],
        receiverTagline: user["bio"],
        senderName: this.user?.displayName ? this.user.displayName : "",
        senderImage: this.user?.photoURL ? this.user.photoURL : "",
        senderTagline: "",
      })
      .then(() => {
        // updated friends list on userList item to include receiverId in friends list so that the button doesn't show
        this.userList =
          this.userList?.map((userListItem: Partial<AppUser>) => {
            if (userListItem.id === user["id"]) {
              if (!userListItem.pendingFriends) {
                userListItem.pendingFriends = [];
              }
              return {
                ...userListItem,
                pendingFriends: this.user?.uid
                  ? [...userListItem.pendingFriends, this.user.uid]
                  : [...userListItem.pendingFriends],
              };
            } else {
              return userListItem;
            }
          }) ?? [];
      });
  }

  searchUsers(event: any) {
    const value = event.target.value;
    if (value) {
      this.storeService.searchDocsByName("users", value);
    }
  }
}
