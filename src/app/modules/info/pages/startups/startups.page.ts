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
// src/app/modules/info/pages/startups/startups.page.ts

import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {MetaService} from "../../../../core/services/meta.service";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";

@Component({
  selector: "app-startups",
  templateUrl: "./startups.page.html",
  styleUrls: ["./startups.page.scss"],
})
export class StartupsPage implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor(
    private metaService: MetaService,
    private modalController: ModalController,
  ) {}

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Startup Resources | ASCENDynamics NFP",
      "Launch your cooperative with ASCENDynamics NFP and learn SEO fundamentals.",
      "startups, cooperatives, resources, SEO",
      {
        title: "Startup Resources | ASCENDynamics NFP",
        description:
          "Find tools and SEO advice for your worker-owned startup at ASCENDynamics NFP.",
        url: "https://app.ASCENDynamics.org/info/startups",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary",
        title: "Startups",
        description:
          "ASCENDynamics NFP helps cooperatives grow with funding, networking, and SEO training.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/ASCENDynamicsNFP%2Ficon-512x512.png?alt=media",
      },
    );
  }

  async openLegalModal(contentType: "privacyPolicy" | "termsOfUse") {
    const modal = await this.modalController.create({
      component: LegalModalComponent,
      componentProps: {content: contentType},
    });
    await modal.present();
  }

  ngOnInit() {}
}
