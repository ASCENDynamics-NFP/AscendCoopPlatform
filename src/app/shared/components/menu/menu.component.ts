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
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {AuthUser} from "../../../models/auth-user.model";
import {TranslateService, LangChangeEvent} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {AppState} from "../../../state/reducers";
import {FeedbackModalComponent} from "../feedback-modal/feedback-modal.component";
import {CreateGroupModalComponent} from "../../../modules/account/components/create-group-modal/create-group-modal.component";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription = new Subscription();
  user: AuthUser | null = null;
  public project: any = [];
  public guestPages: any = {user: [], group: []};
  public userPages: any = {user: [], group: []};
  message =
    "This modal example uses the modalController to present and dismiss modals.";

  constructor(
    private store: Store<AppState>,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private router: Router,
  ) {
    this.authSubscription.add(
      this.store.select(selectAuthUser).subscribe((authUser) => {
        this.user = authUser;
        if (authUser) {
          this.translateUserItems();
        } else {
          this.translateGuestItems();
        }
      }),
    );

    this.authSubscription.add(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        if (this.user) {
          this.translateUserItems();
        } else {
          this.translateGuestItems();
        }
      }),
    );
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
        url: "https://buy.stripe.com/bIY5mC9sY1ob4TufYY",
        icon: "heart-sharp",
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
      {title: "Login", url: "login", icon: "log-in"},
      {title: "Sign Up", url: "signup", icon: "person-add"},
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
        url: `/${this.user?.uid}`,
        icon: "person",
        onclick: null,
      },
      {
        buttonIcon: "add",
        buttonLink: "create-group",
        buttonText: "Group",
        hasButton: true,
        title: "Groups",
        url: `group-list`,
        icon: "business",
        onclick: null,
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Users",
        url: `users`,
        icon: "people",
        onclick: null,
      },
      {
        buttonIcon: "",
        buttonLink: "",
        buttonText: "",
        hasButton: false,
        title: "Settings",
        url: `settings`,
        icon: "settings",
        onclick: null,
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

  // signOut() {
  //   this.authStoreService.signOut();
  // }

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
        this.router.navigate([`/${data.groupId}`]);
      }
    }
  }

  async showFeedbackModal() {
    const modal = await this.modalCtrl.create({
      component: FeedbackModalComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
