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
import {PopoverController} from "@ionic/angular";
import {UserMenuComponent} from "../user-menu/user-menu.component";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {map, Observable} from "rxjs";
import {AuthUser} from "@shared/models/auth-user.model";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
})
export class AppHeaderComponent {
  @Input() title?: string = "ASCENDynamics NFP";
  @Input() defaultHref?: string;
  @Input() showLogo?: boolean = false;
  @Input() hideMenu?: boolean = false;

  authUser$: Observable<AuthUser | null>; // Declare type for clarity
  public popoverEvent: any;

  constructor(
    private popoverController: PopoverController,
    private store: Store,
  ) {
    // Initialize authUser$ after store is available
    this.authUser$ = this.store.select(selectAuthUser);
  }

  get image() {
    return this.authUser$?.pipe(map((user) => user?.iconImage));
  }

  async presentPopover(ev: any) {
    this.popoverEvent = ev;
    const popover = await this.popoverController.create({
      component: UserMenuComponent,
      componentProps: {
        authUser$: this.authUser$, // Pass authUser$ as before
      },
      event: ev,
      translucent: true,
    });
    return popover.present();
  }

  onPopoverDismiss(_event: any) {
    // Handle popover dismiss if needed
  }
}
