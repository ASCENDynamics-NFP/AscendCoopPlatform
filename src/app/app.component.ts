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
import {IonicModule, MenuController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {MenuComponent} from "./shared/components/menu/menu.component";
import {TranslateService} from "@ngx-translate/core";
import {AuthStoreService} from "./core/services/auth-store.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, MenuComponent],
})
export class AppComponent implements OnInit {
  constructor(
    private authStoreService: AuthStoreService,
    private menuCtrl: MenuController,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang("en");
    this.translate.addLangs(["en", "fr"]);
    // You can use your AuthStoreService here
  }

  ngOnInit() {
    this.authStoreService.isLoggedIn$.subscribe(async (isLoggedIn) => {
      if (isLoggedIn) {
        await this.menuCtrl.enable(false, "guest");
        await this.menuCtrl.enable(true, "user");
      } else {
        await this.menuCtrl.enable(false, "user");
        await this.menuCtrl.enable(true, "guest");
      }
    });
  }
}
