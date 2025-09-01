/********************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************/
// src/app/modules/info/pages/services/services.page.ts

import {Component, OnInit} from "@angular/core";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-services",
  templateUrl: "./services.page.html",
  styleUrls: ["./services.page.scss"],
})
export class ServicesPage implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor(private metaService: MetaService) {}

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Our Services | ASCENDynamics NFP",
      "Discover technical assistance, development, and SEO-driven marketing at ASCENDynamics NFP.",
      "services, development, SEO, marketing, ASCENDynamics",
      {
        title: "Our Services | ASCENDynamics NFP",
        description:
          "Learn how ASCENDynamics NFP supports cooperatives with funding, networking, and SEO expertise.",
        url: "https://ascendynamics.org/info/services",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "Services",
        description:
          "From technical assistance to SEO marketing, ASCENDynamics NFP helps your organization thrive.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
    );

    // Add structured data for services
    this.metaService.addStructuredData({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Business Consulting",
      provider: {
        "@type": "Organization",
        name: "ASCENDynamics NFP",
        url: "https://ascendynamics.org",
      },
      name: "Cooperative Development Services",
      description:
        "Technical assistance, development, and SEO-driven marketing services for cooperatives and nonprofits.",
      url: "https://ascendynamics.org/info/services",
      offers: {
        "@type": "Offer",
        description:
          "Comprehensive support including funding assistance, networking opportunities, and SEO expertise.",
      },
    });
  }

  ngOnInit() {}
}
