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
// src/app/modules/info/pages/about-us/about-us.page.ts

import {Component, OnInit} from "@angular/core";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.page.html",
  styleUrls: ["./about-us.page.scss"],
})
export class AboutUsPage implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor(private metaService: MetaService) {}

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "About ASCENDynamics NFP | Cooperative Incubator",
      "Learn about ASCENDynamics NFP and how our SEO-focused strategies empower worker-owned cooperatives.",
      "ASCENDynamics, about, cooperative incubator, nonprofit, SEO",
      {
        title: "About ASCENDynamics NFP | Cooperative Incubator",
        description:
          "Discover the mission and values of ASCENDynamics NFP and our dedication to SEO for social impact.",
        url: "https://ascendynamics.org/info/about-us",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "About ASCENDynamics NFP",
        description:
          "ASCENDynamics NFP provides resources and SEO guidance for cooperatives and nonprofits.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
    );

    // Add structured data for the organization
    this.metaService.addStructuredData({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ASCENDynamics NFP",
      url: "https://ascendynamics.org",
      logo: "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      description:
        "ASCENDynamics NFP is a cooperative incubator that empowers worker-owned cooperatives through SEO-focused strategies and community resources.",
      foundingDate: "2023",
      sameAs: ["https://ascendynamics.org/info/about-us"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: "https://ascendynamics.org",
      },
    });
  }

  ngOnInit() {}
}
