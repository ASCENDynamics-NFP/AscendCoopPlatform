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
  public project: any = [];
  public guestPages: any = {user: [], group: []};
  public userPages: any = {user: [], group: []};

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
    this.project = [
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "ASCENDynamics NFP",
        url: "https://ascendynamics.org",
        icon: "globe-outline",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "LinkedIn",
        url: "https://www.linkedin.com/company/ascendynamics-nfp",
        icon: "logo-linkedin",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Facebook",
        url: "https://www.facebook.com/ASCENDynamicsNFP",
        icon: "logo-facebook",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Slack Community",
        url: "https://join.slack.com/t/ascendynamicsnfp/shared_invite/zt-1yqcw1hqa-slT2gWkBEkLOTRnN8zEqdQ",
        icon: "logo-slack",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "YouTube Channel",
        url: "https://www.youtube.com/channel/UCkR2Cgrjyi0QPeIKIXzxOvg",
        icon: "logo-youtube",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Donate",
        url: "https://www.paypal.com/donate/?hosted_button_id=NZNUBUCTZA75S",
        icon: "logo-paypal",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Project Repository",
        url: "https://github.com/ASCENDynamics-NFP/AscendCoopPlatform",
        icon: "code-slash",
      },
    ];
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
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Profile",
        url: `user-profile/${this.user?.uid}`,
        icon: "person",
      },
      {
        buttonIcon: "add",
        buttonLink: "",
        buttonText: "Create Group",
        hasButton: true,
        title: "Groups",
        url: `group-list`,
        icon: "business",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Users",
        url: `users`,
        icon: "people",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Settings",
        url: `user-settings/${this.user?.uid}`,
        icon: "settings",
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
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
