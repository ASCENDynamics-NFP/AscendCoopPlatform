import {Component, Input, OnInit} from "@angular/core";
import {RequestService} from "../../../../core/services/request.service";
import {AppRequest} from "../../../../models/request.model";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {User} from "firebase/auth";

@Component({
  selector: "app-friend-request",
  templateUrl: "./friend-request.component.html",
  styleUrls: ["./friend-request.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FriendRequestComponent implements OnInit {
  @Input() user: User | null = null; // define your user here
  friendRequestList: AppRequest[] = [
    {
      createdAt: null,
      createdBy: null,
      id: null,
      senderId: "",
      receiverId: "",
      type: "",
      status: "",
      name: "",
      image: "",
      description: "",
      lastModifiedAt: null,
      lastModifiedBy: null,
    },
  ]; // define your request body here
  constructor(private requestService: RequestService) {} // inject your Firebase service

  ngOnInit(): void {
    console.log(this.user);
    if (this.user?.uid) {
      console.log(this.user.uid);
      this.requestService
        .getRequestsByReceiverId(this.user.uid)
        .then((requests) => {
          console.log(requests);
          this.friendRequestList = requests;
        });
    }
  }

  sendFriendRequest() {
    let friendRequest: AppRequest = {
      id: null,
      senderId: this.user?.uid ? this.user.uid : "",
      receiverId: "user",
      type: "friend",
      status: "pending",
      name: "n/a",
      image: "n/a",
      description: "n/a",
      createdAt: null,
      createdBy: null,
      lastModifiedAt: null,
      lastModifiedBy: null,
    };
    // this is a simplification, you'll likely have more complex logic here
    this.requestService.sendRequest(friendRequest);
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
