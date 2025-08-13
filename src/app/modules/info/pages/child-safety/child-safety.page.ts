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
import {Component, OnInit} from "@angular/core";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-child-safety",
  templateUrl: "./child-safety.page.html",
  styleUrls: ["./child-safety.page.scss"],
})
export class ChildSafetyPage implements OnInit {
  currentDate = new Date();

  constructor(private metaService: MetaService) {}

  ngOnInit() {
    this.setMetaTags();
  }

  private setMetaTags() {
    const title = "Child Safety Standards - ASCENDynamics NFP";
    const description =
      "ASCENDynamics NFP Platform's commitment to child safety, including our standards against child sexual abuse and exploitation (CSAE) and prevention measures.";

    this.metaService.updateMetaTags(
      title,
      description,
      "child safety, CSAE prevention, CSAM prevention, online safety, community standards",
      {
        title,
        description,
        url: "https://app.ASCENDynamics.org/info/child-safety",
      },
      {
        card: "summary",
        title,
        description:
          "Learn about our commitment to child safety and prevention of CSAE/CSAM.",
      },
    );
  }
}
