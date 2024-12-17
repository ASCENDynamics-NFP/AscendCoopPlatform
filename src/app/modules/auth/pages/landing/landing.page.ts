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
// src/app/modules/auth/pages/landing/landing.page.ts

import {Component, ElementRef, ViewChild} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";
import {SwiperOptions} from "swiper/types";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.page.html",
  styleUrls: ["./landing.page.scss"],
})
export class LandingPage {
  @ViewChild("swiperElement") swiperElement: ElementRef | undefined;

  swiperConfig: SwiperOptions = {
    init: true,
    slidesPerView: 1,
    autoplay: true,
    spaceBetween: 10,
    mousewheel: {forceToAxis: true},
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: false,
      },
    },
  };

  currentYear: number = new Date().getFullYear();

  constructor(
    private metaService: MetaService,
    private modalController: ModalController,
  ) {}

  // Runs when the page is about to enter the view
  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "ASCENDynamics NFP | Volunteer Opportunities",
      "Join ASCENDynamics NFP to connect with nonprofits, find volunteer opportunities, and make an impact in your community.",
      "volunteer, nonprofits, community, opportunities",
      {
        title: "ASCENDynamics NFP | Volunteer Opportunities",
        description:
          "Find local nonprofits and volunteer opportunities with ASCENDynamics NFP.",
        url: "https://app.ASCENDynamics.org/",
        image: "https://app.ASCENDynamics.org/assets/icon/logo.png",
      },
      {
        card: "summary_large_image",
        title: "ASCENDynamics NFP | Volunteer Opportunities",
        description:
          "Explore meaningful ways to contribute to your community with ASCENDynamics NFP.",
        image: "https://app.ASCENDynamics.org/assets/icon/logo.png",
      },
    );
  }

  // Open the legal modal (Privacy Policy or Terms of Use)
  async openLegalModal(contentType: "privacyPolicy" | "termsOfUse") {
    const modal = await this.modalController.create({
      component: LegalModalComponent,
      componentProps: {content: contentType},
    });
    await modal.present();
  }

  features = [
    {
      icon: "people-outline",
      title: "User Profiles",
      description:
        "Create personalized profiles to showcase your skills and volunteer history.",
    },
    {
      icon: "briefcase-outline",
      title: "Volunteer Opportunities",
      description:
        "Discover and apply for volunteer positions that match your interests and skills.",
    },
    {
      icon: "analytics-outline",
      title: "Analytics & Tracking",
      description:
        "Track your volunteer hours and impact with our analytics tools.",
    },
    // Add more features as needed
  ];

  roadmap = [
    {
      id: "phase1",
      title: "Phase 1: Platform Development",
      subtitle: "User Sign-Up, Profiles, Volunteer Listings",
      status: "Active",
      statusColor: "success",
      items: [
        {
          name: "User Sign-Up and Authentication",
          status: "Finished",
          statusColor: "success",
        },
        {
          name: "User Profile Pages",
          status: "Finished",
          statusColor: "success",
        },
        {
          name: "Nonprofit Profile Pages",
          status: "Finished",
          statusColor: "success",
        },
        {
          name: "Volunteer Position Listings",
          status: "New",
          statusColor: "primary",
        },
        // Add more items as needed
      ],
    },
    // Add more phases as needed
  ];

  testimonials = [
    {
      message: "This platform has connected me with amazing opportunities!",
      author: "Jane Doe",
    },
    // Add more testimonials as needed
  ];

  testimonialOptions = {
    autoplay: {
      delay: 5000,
    },
    loop: true,
  };

  constructor(private modalController: ModalController) {}

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  initSwiper() {
    Object.assign(this.swiperElement?.nativeElement, this.swiperConfig);
    this.swiperElement?.nativeElement.initialize();
  }

  // Open the legal modal (Privacy Policy or Terms of Use)
  async openLegalModal(contentType: "privacyPolicy" | "termsOfUse") {
    try {
      const modal = await this.modalController.create({
        component: LegalModalComponent,
        componentProps: {content: contentType},
      });
      await modal.present();
    } catch (error) {
      console.error("Error opening legal modal:", error);
    }
  }
}
