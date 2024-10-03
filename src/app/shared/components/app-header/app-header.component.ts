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
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {PopoverController} from "@ionic/angular";
import {Subscription, combineLatest} from "rxjs";
import {Account} from "../../../models/account.model";
import {UserMenuComponent} from "../user-menu/user-menu.component";
import {Store} from "@ngrx/store";
import {AppState} from "../../../state/reducers";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";
import {selectAccounts} from "../../../state/selectors/account.selectors";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  @Input() title?: string;
  private account?: Account;
  private subscriptions = new Subscription();
  public popoverEvent: any;

  constructor(
    private popoverController: PopoverController,
    private store: Store<AppState>,
  ) {}

  get image() {
    return this.account?.iconImage || "assets/avatar/male2.png";
  }

  ngOnInit() {
    this.initiateSubscribers();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initiateSubscribers() {
    this.subscriptions.add(
      combineLatest([
        this.store.select(selectAuthUser),
        this.store.select(selectAccounts),
      ]).subscribe(([authUser, accounts]) => {
        if (authUser) {
          this.account = accounts.find(
            (account) => account.id === authUser.uid,
          );
        } else {
          this.account = undefined;
        }
      }),
    );
  }

  async presentPopover(ev: any) {
    this.popoverEvent = ev;
    const popover = await this.popoverController.create({
      component: UserMenuComponent,
      event: ev,
      translucent: true,
    });
    return popover.present();
  }

  onPopoverDismiss(event: any) {
    // Handle popover dismiss if needed
  }
}
