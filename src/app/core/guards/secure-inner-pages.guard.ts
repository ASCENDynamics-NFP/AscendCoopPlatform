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
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {AuthStoreService} from "../services/auth-store.service";
import {NavController} from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class SecureInnerPagesGuard {
  constructor(
    public authStoreService: AuthStoreService,
    private navCtrl: NavController,
    private router: Router,
  ) {}

  // Used to restrict pages to users when they are logged in
  async canActivate(): Promise<boolean> {
    const isLoggedIn = await firstValueFrom(this.authStoreService.isLoggedIn$);
    if (isLoggedIn) {
      // window.alert("Access denied!");
      if (this.router.getCurrentNavigation()?.previousNavigation) {
        this.navCtrl.back();
      } else {
        this.navCtrl.navigateForward(
          `/${this.authStoreService.getCurrentUser()?.uid}`,
        );
      }
      return false;
    }
    return true;
  }
}
