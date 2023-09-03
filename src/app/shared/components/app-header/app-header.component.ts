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
import {Component, Input} from "@angular/core";
import {IonicModule, PopoverController} from "@ionic/angular";
import {UserMenuComponent} from "../user-menu/user-menu.component";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, UserMenuComponent],
})
export class AppHeaderComponent {
  @Input() title?: string;
  @Input() image?: string;
  public popoverEvent: any;

  constructor(private popoverController: PopoverController) {}

  async presentPopover(ev: any) {
    this.popoverEvent = ev;
    const popover = await this.popoverController.create({
      component: UserMenuComponent, // This is where you pass the component to the popover
      event: ev,
      translucent: true,
    });
    return popover.present();
  }

  onPopoverDismiss(event: any) {
    // Handle popover dismiss if needed
  }
}
