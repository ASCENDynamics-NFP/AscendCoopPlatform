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
import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AuthStoreService} from "../../../../../core/services/auth-store.service";
import {StoreService} from "../../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {AppHeaderComponent} from "../../../../../shared/components/app-header/app-header.component";
import {Account, RelatedAccount} from "../../../../../models/account.model";
import {User} from "firebase/auth";

@Component({
  selector: "app-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AppHeaderComponent,
  ],
})
export class ListPage implements OnInit {
  private accountsSubscription?: Subscription;
  currentRelatedAccountsList: Partial<RelatedAccount>[] = [];
  pendingRelatedAccountsList: Partial<RelatedAccount>[] = [];
  accountId: string | null = null;
  listType: string | null = null;
  currentUser: User | null = null;
  account?: Partial<Account>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
    this.listType = this.activatedRoute.snapshot.paramMap.get("listType");
  }

  get getTitle() {
    if (this.listType === "user" && this.account?.type === "user") {
      return "Friends";
    } else if (this.listType === "user" && this.account?.type === "group") {
      return "Members";
    } else if (this.listType === "group" && this.account?.type === "group") {
      return "Partners";
    } else if (this.listType === "group" && this.account?.type === "user") {
      return "Organizations";
    }
    return "";
  }

  ngOnInit() {
    this.currentUser = this.authStoreService.getCurrentUser();
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        const account = accounts.find((acc) => acc.id === this.accountId);
        if (account) {
          this.account = account;
          this.sortRelatedAccounts(account.relatedAccounts || []);
        }
      },
    );
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  sortRelatedAccounts(relatedAccounts: Partial<RelatedAccount>[]) {
    this.currentRelatedAccountsList = relatedAccounts.filter(
      (ra) => ra.type === this.listType && ra.status === "accepted",
    );
    this.pendingRelatedAccountsList = relatedAccounts.filter(
      (ra) => ra.type === this.listType && ra.status === "pending",
    );
  }

  updateStatus(request: Partial<RelatedAccount>, status: string) {
    const docPath = `accounts/${this.accountId}/relatedAccounts/${request.id}`;
    const updatedData = {status: status};
    this.storeService.updateDocAtPath(docPath, updatedData).then(() => {
      if (!this.accountId) return;
      this.storeService.getAndSortRelatedAccounts(this.accountId);
    });
  }

  acceptRequest(request: Partial<RelatedAccount>) {
    this.updateStatus(request, "accepted");
  }

  rejectRequest(request: Partial<RelatedAccount>) {
    this.updateStatus(request, "rejected");
  }

  removeRequest(request: Partial<RelatedAccount>) {
    if (!this.accountId) return;
    const docPath = `accounts/${this.accountId}/relatedAccounts/${request.id}`;
    this.storeService.deleteDocAtPath(docPath);
    this.storeService.getAndSortRelatedAccounts(this.accountId);
  }

  showAcceptRejectButtons(request: Partial<RelatedAccount>) {
    return (
      this.isOwner() &&
      request.status === "pending" &&
      request.initiatorId !== this.currentUser?.uid
    );
  }

  showRemoveButton(request: Partial<RelatedAccount>) {
    return (
      this.isOwner() &&
      (request.status === "accepted" ||
        (request.status === "pending" &&
          request.initiatorId === this.currentUser?.uid))
    );
  }

  isOwner() {
    return this.currentUser?.uid === this.accountId;
  }
}
