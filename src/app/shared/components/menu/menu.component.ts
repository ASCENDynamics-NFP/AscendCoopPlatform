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
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {AuthService} from "../../../core/services/auth.service";
import {User} from "firebase/auth";
import {TranslateModule} from "@ngx-translate/core";
import {TranslateService, LangChangeEvent} from "@ngx-translate/core";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TranslateModule,
  ],
})
export class MenuComponent implements OnInit {
  user: User | null = null;
  public guestPages: any = {user: [], group: []};
  public userPages: any = {user: [], group: []};
  // public labels: Array<string> = [];

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON MENU");
        this.user = user;
        this.translateUserItems();
      } else {
        this.translateGuestItems();
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      // Do something with the updated translations
      if (this.user) {
        this.translateUserItems();
      } else {
        this.translateGuestItems();
      }
    });
  }

  ngOnInit() {
    // this.labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];
  }

  translateGuestItems() {
    const userItems = [
      {title: "Login", url: "user-login", icon: "mail"},
      {title: "Signup", url: "user-signup", icon: "paper-plane"},
      {title: "Groups", url: "group-list", icon: "business"},
    ];
    // const groupItems = [
    //   {title: "Group List", url: "group-list", icon: "warning"},
    //   {title: "Group Profile", url: "group-profile", icon: "warning"},
    //   {title: "Group Detail", url: "group-detail", icon: "heart"},
    //   {title: "Group Members", url: "group-members", icon: "warning"},
    // ];

    this.guestPages = {
      user: userItems.map((item) => ({
        ...item,
        title: this.translate.instant(item.title),
      })),
      // group: groupItems.map((item) => ({
      //   ...item,
      //   title: this.translate.instant(item.title),
      // })),
    };
  }

  translateUserItems() {
    const userItems = [
      {
        title: "Profile",
        url: `user-profile/${this.user?.uid}`,
        icon: "person",
      },
      {
        title: "Groups",
        url: `group-list`,
        icon: "business",
      },
      {
        title: "Users",
        url: `users`,
        icon: "people",
      },
      {
        title: "Settings",
        url: `user-settings/${this.user?.uid}`,
        icon: "settings",
      },
      {
        title: "Feedback",
        url: `user-settings/${this.user?.uid}`,
        icon: "ear",
      },
      // {
      //   title: "Dashboard",
      //   url: `user-dashboard/${this.user?.uid}`,
      //   icon: "newspaper",
      // },
    ];
    // const groupItems = [
    //   {title: "Group Create", url: "group-create", icon: "archive"},
    //   {title: "Group Profile", url: "group-profile", icon: "warning"},
    //   {title: "Group Detail", url: "group-detail", icon: "heart"},
    //   {title: "Group Edit", url: "group-edit", icon: "trash"},
    //   {title: "Group Members", url: "group-members", icon: "warning"},
    // ];

    this.userPages = {
      user: userItems.map((item) => ({
        ...item,
        title: this.translate.instant(item.title),
      })),
      // group: groupItems.map((item) => ({
      //   ...item,
      //   title: this.translate.instant(item.title),
      // })),
    };
  }

  signOut() {
    this.authService.signOut();
  }
}
