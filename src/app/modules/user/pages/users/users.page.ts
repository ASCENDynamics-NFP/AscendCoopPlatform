import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestService } from '../../../../core/services/request.service';
import { UsersService } from '../../../../core/services/users.service';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { AuthService } from '../../../../core/services/auth.service';
import { MenuService } from '../../../../core/services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsersPage implements OnInit {
  user: User | null = null; // define your user here
  userList: DocumentData[] | null = []; // define your user list here

  constructor(
    private requestService: RequestService,
    private usersService: UsersService,
    private menuService: MenuService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = this.authService.getCurrentUser();} // inject your Firebase service

  ngOnInit(): void {
    // console.log(this.user);
    // if (this.user?.uid) {
    //   console.log(this.user.uid);
    //   this.requestService
    //     .getRequestsByReceiverId(this.user.uid)
    //     .then((requests) => {
    //       console.log("requests", requests);
    //       this.friendRequestList = requests;
    //     });
    // }

    this.usersService
      .getUsersWithCondition("displayName", "!=", null, "displayName", 100)
      .then((users) => {
        console.log("userList", users);
        this.userList = users;
      });
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  sendFriendRequest(user: DocumentData) {
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

  goToProfile(uid: String) {
    if (uid) {
      this.router.navigate([`/user-profile/${uid}`]);
    }
  }
}