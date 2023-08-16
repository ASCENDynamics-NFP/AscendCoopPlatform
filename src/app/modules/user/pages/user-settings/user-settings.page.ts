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
import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

import {SettingsComponent} from "./components/settings/settings.component";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";
import {AppUser} from "../../../../models/user.model";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.page.html",
  styleUrls: ["./user-settings.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SettingsComponent],
})
export class UserSettingsPage {
  private userSubscription?: Subscription;
  authUser = this.authStoreService.getCurrentUser();
  user?: Partial<AppUser> | null;
  constructor(
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.authUser = this.authStoreService.getCurrentUser();
  }

  ionViewWillEnter() {
    this.userSubscription = this.storeService.users$.subscribe((users) => {
      this.user = users.find((u) => u.id === this.authUser?.uid);
    });
    if (!this.user) {
      this.user = this.storeService
        .getCollection("users")
        .find((u) => u["id"] === this.authUser?.uid);
    }
  }

  ionViewWillLeave() {
    this.userSubscription?.unsubscribe();
  }
}
