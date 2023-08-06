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
import {RouterModule} from "@angular/router";
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
  private usersSubscription: Subscription | undefined;
  user: User | null = null; // define your user here
  userList: Partial<AppUser>[] | null = []; // define your user list here
  searchedValue: string = "";

  constructor(
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.user = this.authStoreService.getCurrentUser();
  } // inject your Firebase service

  ionViewWillEnter() {
    this.usersSubscription = this.storeService.users$.subscribe((users) => {
      if (users) {
        this.userList = users.filter((user) =>
          user.displayName
            ?.toLowerCase()
            .includes(this.searchedValue.toLowerCase()),
        );
      }
    });
  }

  ionViewWillLeave() {
    this.usersSubscription?.unsubscribe();
  }

  sendFriendRequest(user: Partial<AppUser>) {
    this.storeService
      .createDoc("relationships", {
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
        if (this.user) {
          // updated friends list on userList item to include receiverId in friends list so that the button doesn't show
          const updatedUserListItem = this.userList?.find(
            (userListItem: Partial<AppUser>) => userListItem.id === user["id"],
          );

          if (updatedUserListItem) {
            if (!updatedUserListItem.pendingFriends) {
              updatedUserListItem.pendingFriends = [];
            }
            updatedUserListItem.pendingFriends.push(this.user?.uid);

            // Use addDocToState to update the state
            this.storeService.addDocToState("users", updatedUserListItem);
          }
        }
      });
  }

  searchUsers(event: any) {
    const value = event.target.value;
    this.searchedValue = value;
    if (value) {
      this.storeService.searchDocsByName("users", value);
    } else {
      this.userList = this.storeService.getCollection("users").sort((a, b) => {
        if (a["displayName"] && b["displayName"]) {
          return a["displayName"].localeCompare(b["displayName"]);
        } else {
          return 0;
        }
      });
    }
  }
}
