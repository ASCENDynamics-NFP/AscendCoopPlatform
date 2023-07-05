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
    console.log(this.user);
    if (this.user?.uid) {
      console.log(this.user.uid);
      this.requestService
        .getRequestsByReceiverId(this.user.uid)
        .then((requests) => {
          console.log("requests", requests);
          this.friendRequestList = requests;
        });
    }

    this.usersService
      .getUsersWithCondition("name", "!=", null, "name", 5)
      .then((users) => {
        console.log("userList", users);
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
