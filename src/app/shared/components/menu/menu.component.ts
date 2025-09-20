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
    // Initialize project links and info pages
    this.updateProjectLinks();
    this.updateInfoPages();

    // Combine authUser and language change observables
    const authUser$ = this.store.select(selectAuthUser);
    const langChange$ = this.translate.onLangChange;

    // Handle auth user changes
    const authSubscription = authUser$.subscribe((authUser) => {
      this.user = authUser;
      if (authUser) {
        this.setUserMenuItems();
      } else {
        this.setGuestMenuItems();
      }
    });

    // Handle language changes separately
    const langSubscription = langChange$.subscribe(() => {
      this.updateProjectLinks();
      this.updateInfoPages();
      // Refresh menu items with new translations
      if (this.user) {
        this.setUserMenuItems();
      } else {
        this.setGuestMenuItems();
      }
    });

    this.subscriptions.add(authSubscription);
    this.subscriptions.add(langSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateProjectLinks() {
    this.project = [
      {
        title: this.translate.instant("info.donate"),
        url: "https://buy.stripe.com/bIY5mC9sY1ob4TufYY",
        icon: "heart-sharp",
      },
      {
        title: this.translate.instant("info.project_repository"),
        url: "https://github.com/ASCENDynamics-NFP/AscendCoopPlatform",
        icon: "code-slash",
      },
      {
        title: this.translate.instant("info.slack_community"),
        url: "https://join.slack.com/t/ascendynamicsnfp/shared_invite/zt-1yqcw1hqa-slT2gWkBEkLOTRnN8zEqdQ",
        icon: "logo-slack",
      },
      {
        title: this.translate.instant("info.youtube_channel"),
        url: "https://www.youtube.com/channel/UCkR2Cgrjyi0QPeIKIXzxOvg",
        icon: "logo-youtube",
      },
      {
        title: this.translate.instant("info.linkedin"),
        url: "https://www.linkedin.com/company/ascendynamics-nfp",
        icon: "logo-linkedin",
      },
      {
        title: this.translate.instant("info.facebook"),
        url: "https://www.facebook.com/ASCENDynamicsNFP",
        icon: "logo-facebook",
      },
    ];
  }

  private updateInfoPages() {
    this.infoPages = [
      {
        title: this.translate.instant("info.home"),
        url: "/info",
        icon: "globe-outline",
      },
      {
        title: this.translate.instant("info.about_us"),
        url: "/info/about-us",
        icon: "information-circle",
      },
      {
        title: this.translate.instant("info.services"),
        url: "/info/services",
        icon: "construct",
      },
      {
        title: this.translate.instant("info.startups"),
        url: "/info/startups",
        icon: "rocket",
      },
      {
        title: this.translate.instant("info.event_calendar"),
        url: "/info/event-calendar",
        icon: "calendar",
      },
      {
        title: this.translate.instant("info.our_team"),
        url: "/info/team",
        icon: "people",
      },
      {
        title: this.translate.instant("info.think_tank"),
        url: "/info/think-tank",
        icon: "bulb",
      },
    ];
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
        title: this.translate.instant("menu.messaging"),
        url: "/messaging",
        icon: "chatbubbles",
        hasButton: true,
        buttonLink: "/messaging/new-chat",
        buttonText: this.translate.instant("menu.create"),
        buttonIcon: "add",
      },
      {
        title: this.translate.instant("menu.directory") || "Directory",
        url: "/account/directory",
        icon: "search",
      },
      // Settings moved under Edit/Admin dashboards, remove from main menu
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
