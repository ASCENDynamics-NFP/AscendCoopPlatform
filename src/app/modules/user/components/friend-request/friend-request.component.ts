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
import {RequestService} from "../../../../core/services/request.service";
import {AppRequest} from "../../../../models/request.model";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {User} from "firebase/auth";
import {UsersService} from "../../../../core/services/users.service";
import {DocumentData} from "firebase/firestore";

@Component({
  selector: "app-friend-request",
  templateUrl: "./friend-request.component.html",
  styleUrls: ["./friend-request.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FriendRequestComponent implements OnInit {
  @Input() user: User | null = null; // define your user here
  userList: DocumentData[] | null = []; // define your user list here
  friendRequestList: AppRequest[] = []; // define your request body here
  constructor(
    private requestService: RequestService,
    private usersService: UsersService,
  ) {} // inject your Firebase service

  ngOnInit(): void {
    if (this.user?.uid) {
      this.requestService
        .getRequestsByReceiverId(this.user.uid)
        .then((requests) => {
          this.friendRequestList = requests;
        });
    }

    this.usersService
      .getUsersWithCondition("name", "!=", null, "name", 5)
      .then((users) => {
        this.userList = users;
      });
  }

  sendFriendRequest(user: DocumentData) {
    // this is a simplification, you'll likely have more complex logic here
    this.requestService.sendRequest({
      id: null,
      senderId: this.user?.uid ? this.user.uid : "",
      receiverId: user["uid"],
      type: "friend",
      status: "pending",
      name: user["displayName"],
      image: user["profilePicture"],
      description: user["bio"],
    });
  }

  acceptFriendRequest(index: number) {
    // this is a simplification, you'll likely have more complex logic here
    this.requestService.updateRequestStatus(
      this.friendRequestList[index].id,
      "accepted",
    );
  }

  rejectFriendRequest(index: number) {
    // this is a simplification, you'll likely have more complex logic here
    this.requestService.updateRequestStatus(
      this.friendRequestList[index].id,
      "rejected",
    );
  }

  viewFriendProfile(index: number) {
    // this is a simplification, you'll likely have more complex logic here
    this.requestService.getProfile(this.friendRequestList[index].senderId);
  }
}
