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
    breakpoints: {
      480: {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
      },
      600: {
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
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: "ASCENDynamics NFP | Volunteer Opportunities",
        description:
          "Explore meaningful ways to contribute to your community with ASCENDynamics NFP.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );

    // Add structured data for the main landing page (nonprofit organization)
    this.metaService.addStructuredData({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ASCENDynamics NFP",
      alternateName: "ASCENDynamics Nonprofit",
      url: "https://app.ASCENDynamics.org",
      logo: "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      description:
        "A nonprofit platform connecting volunteers with organizations to create positive community impact through collaborative volunteering opportunities.",
      foundingDate: "2023",
      organizationType: "Nonprofit",
      areaServed: "Global",
      knowsAbout: [
        "Volunteer Management",
        "Nonprofit Collaboration",
        "Community Impact",
        "Social Networking",
      ],
      sameAs: ["https://app.ASCENDynamics.org"],
    });
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
      icon: "git-branch-outline",
      title: "Open-Source Innovation",
      description:
        "Our community-driven platform is transparent and scalable, allowing nonprofits and cooperatives to share tools and ideas freely.",
    },
    {
      icon: "people-outline",
      title: "Volunteer Engagement",
      description:
        "Built-in volunteer management features help recruit, track volunteer involvement, and celebrate contributions, turning compassion into measurable impact.",
    },
    {
      icon: "flash-outline",
      title: "Real-Time Collaboration",
      description:
        "From project management to communication tools, we enable teams across organizations to coordinate instantly and achieve goals faster.",
    },
    {
      icon: "business-outline",
      title: "Cooperative Empowerment",
      description:
        "As an incubator for worker-owned cooperatives, we provide mentorship and resources, with a focus on uplifting entrepreneurs in underserved communities.",
    },
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

  ngAfterViewInit(): void {
    this.initSwiper();

    // Add custom passive event listener for the 'wheel' event
    this.swiperElement?.nativeElement.addEventListener(
      "wheel",
      (event: WheelEvent) => {
        if (event.deltaY > 0) {
          this.swiperElement?.nativeElement.swiper.slideNext();
        } else {
          this.swiperElement?.nativeElement.swiper.slidePrev();
        }
      },
      {passive: true},
    );
  }

  initSwiper() {
    Object.assign(this.swiperElement?.nativeElement, this.swiperConfig);
    this.swiperElement?.nativeElement.initialize();
  }
}
