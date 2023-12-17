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
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {StoreService} from "../../../../core/services/store.service";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {Account} from "../../../../models/account.model";

@Component({
  selector: "app-group",
  templateUrl: "./group.page.html",
  styleUrls: ["./group.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, AppHeaderComponent],
})
export class GroupPage {
  private accountSubscription?: Subscription;
  group?: Partial<Account>;
  groupId: string | null = null;
  public currentUserAccount?: Partial<Account>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");

    if (this.groupId) {
      this.storeService.getDocsWithSenderOrReceiverId(
        "relationships",
        this.groupId,
      );
    }
  }

  get currentUser() {
    return this.authStoreService.getCurrentUser();
  }

  ionViewWillEnter() {
    this.initiateSubscribers();
  }

  ionViewWillLeave() {
    this.accountSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    this.accountSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        // Find the group by groupId
        this.group = accounts.find(
          (account) => account.id === this.groupId && account.type === "group",
        );

        // Find the current user account
        this.currentUserAccount = accounts.find(
          (account) =>
            account.id === this.currentUser?.uid && account.type === "user",
        );
      },
    );
  }
}
