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
// src/app/modules/info/pages/think-tank/think-tank.page.ts

import {Component, OnInit} from "@angular/core";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-think-tank",
  templateUrl: "./think-tank.page.html",
  styleUrls: ["./think-tank.page.scss"],
})
export class ThinkTankPage implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor(private metaService: MetaService) {}

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Think Tank | ASCENDynamics NFP",
      "Explore research and SEO strategies from the ASCENDynamics NFP think tank.",
      "think tank, research, SEO, ASCENDynamics",
      {
        title: "Think Tank | ASCENDynamics NFP",
        description:
          "Join our think tank to collaborate on cooperative research and SEO outreach.",
        url: "https://app.ASCENDynamics.org/info/think-tank",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "ASCENDynamics Think Tank",
        description:
          "Researching better futures and effective SEO for community projects.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
    );
  }

  ngOnInit() {}
}
