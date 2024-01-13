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
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {User} from "firebase/auth";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";

@Component({
  selector: "app-user-groups",
  templateUrl: "./user-groups.page.html",
  styleUrls: ["./user-groups.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, AppHeaderComponent],
})
export class UserGroupsPage {
  private accountsSubscription?: Subscription;
  currentGroupsList: Partial<RelatedAccount>[] = [];
  pendingGroupsList: Partial<RelatedAccount>[] = [];
  currentUser: User | null = this.authStoreService.getCurrentUser();
  userId: string;
  account?: Partial<Account>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get("accountId") ?? "";
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find((acc) => acc.id === this.userId);
        if (this.account) {
          this.sortRelatedAccounts(this.account.relatedAccounts || []);
        }
      },
    );
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  sortRelatedAccounts(relatedAccounts: Partial<RelatedAccount>[]) {
    this.currentGroupsList = relatedAccounts.filter(
      (ra) => ra.type === "group" && ra.status === "accepted",
    );
    this.pendingGroupsList = relatedAccounts.filter(
      (ra) => ra.type === "group" && ra.status === "pending",
    );
  }

  acceptGroupRequest(request: Partial<RelatedAccount>) {
    this.updateRelatedAccountStatus(request, "accepted");
  }

  rejectGroupRequest(request: Partial<RelatedAccount>) {
    this.updateRelatedAccountStatus(request, "rejected");
  }

  removeGroupRequest(request: Partial<RelatedAccount>) {
    const docPath = `accounts/${this.userId}/relatedAccounts/${request.id}`;
    this.storeService.deleteDocAtPath(docPath);
  }

  private updateRelatedAccountStatus(
    request: Partial<RelatedAccount>,
    status: "accepted" | "rejected",
  ) {
    const docPath = `accounts/${this.userId}/relatedAccounts/${request.id}`;
    const updatedData = {status: status};
    this.storeService.updateDoc(docPath, updatedData);
  }
}
