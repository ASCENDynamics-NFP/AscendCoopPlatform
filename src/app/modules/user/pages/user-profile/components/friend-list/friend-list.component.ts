import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {UsersService} from "../../../../../../core/services/users.service";
import {Router} from "@angular/router";
import {User} from "firebase/auth";
import {AppRelationship} from "../../../../../../models/relationship.model";

@Component({
  selector: "app-friend-list",
  templateUrl: "./friend-list.component.html",
  styleUrls: ["./friend-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class FriendListComponent implements OnInit {
  @Input() user: User | null = null; // define your user here
  @Input() friendList: Partial<AppRelationship>[] = [];
  constructor(private router: Router, private usersService: UsersService) {}

  ngOnInit() {
    // this.usersService
    //   .getUsersWithCondition("name", "!=", null, "name", 5)
    //   .then((users) => {
    //     console.log("userList", users);
    //     this.friendList = users;
    //   });
  }

  get allFriends() {
    let allFriends = [];
    for (let friend of this.friendList) {
      if (friend.senderId === this.user?.uid) {
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
    console.log(this.user);
    if (this.user?.uid) {
      console.log(this.user.uid);
      this.router.navigate([`/user-profile/${this.user.uid}/friends`]);
    }
  }
}
