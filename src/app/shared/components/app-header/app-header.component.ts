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
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {IonicModule, PopoverController} from "@ionic/angular";
import {UserMenuComponent} from "../user-menu/user-menu.component";
import {Subscription} from "rxjs";
import {StoreService} from "../../../core/services/store.service";
import {Account} from "../../../models/account.model"; // Updated import
import {AuthStoreService} from "../../../core/services/auth-store.service";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, UserMenuComponent],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  @Input() title?: string;
  private account?: Partial<Account>; // Using Account model
  private accountsSubscription?: Subscription;
  public popoverEvent: any;

  constructor(
    private authStoreService: AuthStoreService,
    private popoverController: PopoverController,
    private storeService: StoreService,
  ) {}

  get image() {
    // Assuming the Account model has a profile picture field
    return this.account?.iconImage || "assets/avatar/male2.png";
  }

  ngOnInit() {
    this.initiateSubscribers();
  }

  ngOnDestroy() {
    this.accountsSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    // Subscribe to accounts$ observable
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find(
          (account) =>
            account.id === this.authStoreService.getCurrentUser()?.uid,
        );
      },
    );
  }

  async presentPopover(ev: any) {
    this.popoverEvent = ev;
    const popover = await this.popoverController.create({
      component: UserMenuComponent, // Passing the component to the popover
      event: ev,
      translucent: true,
    });
    return popover.present();
  }

  onPopoverDismiss(event: any) {
    // Handle popover dismiss if needed
  }
}
