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
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule, NavController} from "@ionic/angular";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.page.html",
  styleUrls: ["./user-dashboard.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserDashboardPage implements OnInit {
  // user = this.authService.getCurrentUser();

  constructor(
    private authService: AuthService,
    private navContoller: NavController,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  signOut() {
    // this.authService.signOut();
  }

  openLogin() {
    this.navContoller.navigateBack("/user-login");
  }
}
