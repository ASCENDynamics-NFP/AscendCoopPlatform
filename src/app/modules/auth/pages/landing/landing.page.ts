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
// landing.page.ts
import {Component, ViewChild} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";
import {SwiperOptions} from "swiper/types";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.page.html",
  styleUrls: ["./landing.page.scss"],
})
export class LandingPage {
  @ViewChild('swiperElement') swiperElement: any;
  swiperConfig: SwiperOptions = {
    init: true,
    slidesPerView: 1,
    autoplay: true,
    spaceBetween: 10,
    mousewheel: { forceToAxis: true },
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
      }
    },
  };
  currentYear: number = new Date().getFullYear();

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  initSwiper() {
    Object.assign(this.swiperElement.nativeElement, this.swiperConfig);
    this.swiperElement.nativeElement.initialize();
  }

  constructor(private modalController: ModalController) {}

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
}
