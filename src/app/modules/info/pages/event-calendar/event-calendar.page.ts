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
// src/app/modules/info/pages/event-calendar/event-calendar.page.ts

import {Component, OnInit} from "@angular/core";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-event-calendar",
  templateUrl: "./event-calendar.page.html",
  styleUrls: ["./event-calendar.page.scss"],
})
export class EventCalendarPage implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor(private metaService: MetaService) {}

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Upcoming Events | ASCENDynamics NFP",
      "Explore events and SEO workshops hosted by ASCENDynamics NFP.",
      "events, workshops, SEO, ASCENDynamics",
      {
        title: "Upcoming Events | ASCENDynamics NFP",
        description:
          "Join ASCENDynamics NFP for community events and SEO training sessions.",
        url: "https://app.ASCENDynamics.org/info/event-calendar",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "ASCENDynamics Events",
        description:
          "Learn and collaborate with us at upcoming events and SEO workshops.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
    );
  }

  ngOnInit() {}
}
