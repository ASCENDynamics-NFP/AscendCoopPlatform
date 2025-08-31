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
// src/app/modules/info/pages/team/team.page.ts

import {Component, OnInit} from "@angular/core";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-team",
  templateUrl: "./team.page.html",
  styleUrls: ["./team.page.scss"],
})
export class TeamPage implements OnInit {
  currentYear: number = new Date().getFullYear();

  // Team data used to render members
  boardMembers = [
    {
      name: "Marcin Ufniarz",
      role: "Board Member · Software Engineer",
      initials: "MU",
    },
    {
      name: "Tim Watson",
      role: "Board Member · Software Engineer",
      initials: "TW",
    },
    {name: "Matt Washington", role: "Board Member · Manager", initials: "MW"},
    {name: "Ewa Mankowski", role: "Board Member · Manager", initials: "EM"},
  ];

  coreMembers = [
    {name: "Nyero Eseurhobo", role: "Product Manager", initials: "NE"},
  ];

  constructor(private metaService: MetaService) {}

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Our Team | ASCENDynamics NFP",
      "Meet the volunteers, developers, and SEO experts behind ASCENDynamics NFP.",
      "team, volunteers, SEO, ASCENDynamics",
      {
        title: "Our Team | ASCENDynamics NFP",
        description:
          "Learn about the passionate team working to grow cooperatives and enhance SEO outreach.",
        url: "https://app.ASCENDynamics.org/info/team",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "ASCENDynamics Team",
        description: "Volunteers and SEO specialists supporting our mission.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
    );

    // Add structured data for team page
    this.metaService.addStructuredData({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "Our Team | ASCENDynamics NFP",
      description:
        "Meet the volunteers, developers, and SEO experts behind ASCENDynamics NFP.",
      url: "https://app.ASCENDynamics.org/info/team",
      mainEntity: {
        "@type": "Organization",
        name: "ASCENDynamics NFP",
        url: "https://app.ASCENDynamics.org",
        description:
          "Team of volunteers and SEO specialists supporting cooperative development",
      },
    });
  }

  ngOnInit() {}
}
