import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {UsersService} from "../../../../../../core/services/users.service";
import {DocumentData} from "firebase/firestore";
import {Router} from "@angular/router";
import {User} from "firebase/auth";

@Component({
  selector: "app-friend-list",
  templateUrl: "./friend-list.component.html",
  styleUrls: ["./friend-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class FriendListComponent implements OnInit {
  @Input() user: User | null = null; // define your user here
  friendList: DocumentData[] | null = [];
  constructor(private router: Router, private usersService: UsersService) {}

  ngOnInit() {
    this.usersService
      .getUsersWithCondition("name", "!=", null, "name", 5)
      .then((users) => {
        console.log("userList", users);
        this.friendList = users;
      });
  }

  goToUserProfile(uid: string) {
    this.router.navigate([`/user-profile/${uid}`]);
  }

  goToFriendList() {
    console.log(this.user);
    if (this.user?.uid) {
      console.log(this.user.uid);
      this.router.navigate([`/user-profile/${this.user.uid}/friends`]);
    }
  }
}
