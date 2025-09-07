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
import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";
import {PopoverController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import * as AuthActions from "../../../state/actions/auth.actions";
import {firstValueFrom, Observable} from "rxjs";
import {AuthUser} from "@shared/models/auth-user.model";

@Component({
  selector: "app-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"],
})
export class UserMenuComponent {
  @Input() authUser$!: Observable<AuthUser | null>;

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private store: Store,
  ) {}

  async logout() {
    await this.popoverCtrl.dismiss(); // Await the popover dismissal
    this.router.navigate([`/`]);
    this.store.dispatch(AuthActions.signOut());
  }

  async goToProfile() {
    try {
      await this.popoverCtrl.dismiss();
      const user = await firstValueFrom(this.authUser$);
      if (user?.uid) {
        this.router.navigate([`/account/${user.uid}`]);
      }
    } catch (error) {
      console.error("Error navigating to profile:", error);
    }
  }

  async goToSettings() {
    await this.popoverCtrl.dismiss();
    try {
      const user = await firstValueFrom(this.authUser$);
      if (user?.uid) {
        this.router.navigate([`/account/${user.uid}/settings`]);
      }
    } catch (error) {
      console.error("Error navigating to settings:", error);
    }
  }
}
