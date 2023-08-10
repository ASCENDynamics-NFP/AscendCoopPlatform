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
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {IonicModule, ModalController} from "@ionic/angular";
import {User} from "firebase/auth";
import {TranslateModule} from "@ngx-translate/core";
import {TranslateService, LangChangeEvent} from "@ngx-translate/core";
import {CreateGroupModalComponent} from "../../../modules/group/components/create-group-modal/create-group-modal.component";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../core/services/auth-store.service";

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
    CreateGroupModalComponent,
  ],
})
export class MenuComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  user: User | null = null;
  public project: any = [];
  public guestPages: any = {user: [], group: []};
  public userPages: any = {user: [], group: []};
  message =
    "This modal example uses the modalController to present and dismiss modals.";

  constructor(
    private authStoreService: AuthStoreService,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private router: Router,
  ) {
    this.authSubscription = this.authStoreService.user$.subscribe((user) => {
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
        title: "ASCENDynamics NFP",
        url: "https://ascendynamics.org",
        icon: "globe-outline",
      },
      {
        title: "LinkedIn",
        url: "https://www.linkedin.com/company/ascendynamics-nfp",
        icon: "logo-linkedin",
      },
      {
        title: "Facebook",
        url: "https://www.facebook.com/ASCENDynamicsNFP",
        icon: "logo-facebook",
      },
      {
        title: "Slack Community",
        url: "https://join.slack.com/t/ascendynamicsnfp/shared_invite/zt-1yqcw1hqa-slT2gWkBEkLOTRnN8zEqdQ",
        icon: "logo-slack",
      },
      {
        title: "YouTube Channel",
        url: "https://www.youtube.com/channel/UCkR2Cgrjyi0QPeIKIXzxOvg",
        icon: "logo-youtube",
      },
      {
        title: "Donate",
        url: "https://www.paypal.com/donate/?hosted_button_id=NZNUBUCTZA75S",
        icon: "logo-paypal",
      },
      {
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
        buttonLink: "create-group",
        buttonText: "Group",
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
    this.authStoreService.signOut();
  }

  async handleButtonClick(buttonLink: string) {
    console.log("Button Clicked");
    console.log(buttonLink);
    if (buttonLink === "") {
      return;
    } else if (buttonLink === "create-group") {
      console.log("Create Group Clicked");
      const modal = await this.modalCtrl.create({
        component: CreateGroupModalComponent,
      });
      modal.present();

      const {data, role} = await modal.onWillDismiss();
      if (role === "confirm" && data) {
        this.router.navigate([
          `/group/${data.groupId}/${data.groupId}/details`,
        ]);
      }
    }
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
