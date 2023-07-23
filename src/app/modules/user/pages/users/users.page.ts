import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {UsersService} from "../../../../core/services/users.service";
import {User} from "firebase/auth";
import {DocumentData} from "firebase/firestore";
import {AuthService} from "../../../../core/services/auth.service";
import {MenuService} from "../../../../core/services/menu.service";
import {RouterModule} from "@angular/router";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AppUser} from "../../../../models/user.model";

@Component({
  selector: "app-users",
  templateUrl: "./users.page.html",
  styleUrls: ["./users.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class UsersPage implements OnInit {
  user: User | null = null; // define your user here
  userList: Partial<AppUser>[] | null = []; // define your user list here

  constructor(
    private relationshipsCollectionService: RelationshipsCollectionService,
    private usersService: UsersService,
    private menuService: MenuService,
    private authService: AuthService,
  ) {
    this.user = this.authService.getCurrentUser();
  } // inject your Firebase service

  ngOnInit(): void {
    this.usersService
      .getUsersWithCondition("displayName", "!=", null, "displayName", 100)
      .then((users) => {
        this.userList = users as Partial<AppUser>[];
      });
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

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
    this.usersService.searchUsersByName(value).then((users) => {
      this.userList = users;
    });
  }
}
