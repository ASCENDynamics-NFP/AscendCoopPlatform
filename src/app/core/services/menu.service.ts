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
import {Injectable, OnDestroy} from "@angular/core";
import {MenuController} from "@ionic/angular";
import {AuthStoreService} from "./auth-store.service";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MenuService implements OnDestroy {
  private authSubscription: Subscription;

  constructor(
    public authStoreService: AuthStoreService,
    public menuCtrl: MenuController,
  ) {
    this.authSubscription = this.authStoreService.isLoggedIn$.subscribe(
      async (isLoggedIn) => {
        if (isLoggedIn) {
          await this.menuCtrl.enable(false, "guest");
          await this.menuCtrl.enable(true, "user");
        } else {
          await this.menuCtrl.enable(false, "user");
          await this.menuCtrl.enable(true, "guest");
        }
      },
    );
  }

  // Remember to unsubscribe when the service is destroyed to prevent memory leaks
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
