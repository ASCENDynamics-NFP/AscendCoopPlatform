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
import {CommonModule} from "@angular/common";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {IonicModule, PopoverController} from "@ionic/angular";
import {AuthStoreService} from "../../../core/services/auth-store.service";

@Component({
  selector: "user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class UserMenuComponent {
  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private authStoreService: AuthStoreService,
  ) {}

  logout() {
    this.popoverCtrl.dismiss();
    this.authStoreService.signOut();
  }

  goToProfile() {
    this.popoverCtrl.dismiss();
    this.router.navigate([`/${this.authStoreService.getCurrentUser()?.uid}`]);
  }

  goToSettings() {
    this.popoverCtrl.dismiss();
    this.router.navigate(["/settings"]);
  }
}
