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
// src/app/shared/components/menu/menu.component.ts

import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {AuthUser} from "@shared/models/auth-user.model";
import {TranslateService} from "@ngx-translate/core";
import {Subscription, combineLatest} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {FeedbackModalComponent} from "../feedback-modal/feedback-modal.component";

import {MenuItem} from "../../../shared/interfaces/menu-item.interface";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  user: AuthUser | null = null;
  menuPages: MenuItem[] = [];
  project: MenuItem[] = [];
  infoPages: MenuItem[] = [];

  constructor(
    private store: Store,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private router: Router,
  ) {}

  ngOnInit() {
    // Initialize project links
    this.project = [
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

    // Initialize informational page links
    this.infoPages = [
      {title: "Home", url: "", icon: "globe-outline"},
      {title: "About Us", url: "/info/about-us", icon: "information-circle"},
      {title: "Services", url: "/info/services", icon: "construct"},
      {title: "Startups", url: "/info/startups", icon: "rocket"},
      {title: "Event Calendar", url: "/info/event-calendar", icon: "calendar"},
      {title: "Our Team", url: "/info/team", icon: "people"},
      {title: "Think Tank", url: "/info/think-tank", icon: "bulb"},
    ];

    // Combine authUser and language change observables
    const authUser$ = this.store.select(selectAuthUser);
    const langChange$ = this.translate.onLangChange;

    const menuPages$ = combineLatest([authUser$, langChange$]).subscribe(
      ([authUser, langChange]) => {
        this.user = authUser;
        if (authUser) {
          this.setUserMenuItems();
        } else {
          this.setGuestMenuItems();
        }
      },
    );

    this.subscriptions.add(menuPages$);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setGuestMenuItems() {
    this.menuPages = [
      {
        title: this.translate.instant("menu.login"),
        url: "/auth/login",
        icon: "log-in",
      },
      {
        title: this.translate.instant("menu.signup"),
        url: "/auth/signup",
        icon: "person-add",
      },
      // {
      //   title: this.translate.instant("menu.groups"),
      //   url: "/account/group-list",
      //   icon: "business",
      // },
    ];
  }

  private setUserMenuItems() {
    this.menuPages = [
      {
        title: this.translate.instant("menu.profile"),
        url: `/account/${this.user?.uid}`,
        icon: "person",
      },
      {
        title: this.translate.instant("menu.listings"),
        url: "/listings",
        icon: "list",
        hasButton: true,
        buttonLink: "/listings/create",
        buttonText: this.translate.instant("menu.create"),
        buttonIcon: "add",
      },
      {
        title: this.translate.instant("menu.groups"),
        url: "/account/group-list",
        icon: "business",
        // hasButton: true,
        // buttonIcon: "add",
      },
      {
        title: this.translate.instant("menu.users"),
        url: "/account/users",
        icon: "people",
      },
      {
        title: this.translate.instant("menu.settings"),
        url: "/account/settings",
        icon: "settings",
      },
      {
        title: this.translate.instant("menu.manage_projects"),
        url: `/account/${this.user?.uid}/projects`,
        icon: "folder-open",
      },
      // {
      //   title: this.translate.instant("menu.dashboard"),
      //   url: `user-dashboard/${this.user?.uid}`,
      //   icon: "newspaper",
      // },
    ];
  }

  // Show feedback modal
  async showFeedbackModal() {
    const modal = await this.modalCtrl.create({
      component: FeedbackModalComponent,
      componentProps: {
        user: this.user,
      },
    });
    return await modal.present();
  }
}
