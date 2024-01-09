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
import {ActivatedRoute, RouterModule} from "@angular/router";
import {User} from "firebase/auth";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../../../core/services/auth-store.service";
import {StoreService} from "../../../../../../core/services/store.service";
import {Account, RelatedAccount} from "../../../../../../models/account.model";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-partners",
  templateUrl: "./partners.component.html",
  styleUrls: ["./partners.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PartnersComponent implements OnInit {
  private accountsSubscription?: Subscription;

  relatedAccounts: any[] = [];

  currentGroupsList: any[] = [];
  pendingGroupsList: any[] = [];
  groupId: string | null = null;
  account?: Partial<Account>;
  currentUser: User | null = this.authStoreService.getCurrentUser();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
  }

  ngOnInit() {
    if (this.groupId) {
      this.storeService.getAndSortRelatedAccounts(this.groupId);
    }

    this.storeService.relatedAccounts$.subscribe((accounts) => {
      this.relatedAccounts = accounts;
    });
  }

  sortRelatedAccounts() {
    // Sorting logic
    this.relatedAccounts.sort((a, b) => {
      // Replace 'name' with the field you want to sort by
      return a.name.localeCompare(b.name);
    });
  }

  ionViewWillEnter() {
    this.initiateSubscribers();
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find((account) => account.id === this.groupId);
      },
    );
  }

  acceptPartnerRequest(request: Partial<RelatedAccount>) {
    this.updateRelatedAccountStatus(request, "accepted");
  }

  rejectPartnerRequest(request: Partial<RelatedAccount>) {
    this.updateRelatedAccountStatus(request, "rejected");
  }

  removePartnerRequest(request: Partial<RelatedAccount>) {
    const docPath = `accounts/${this.groupId}/relatedAccounts/${request.id}`;
    this.storeService.deleteDocAtPath(docPath);
  }

  private updateRelatedAccountStatus(
    request: Partial<RelatedAccount>,
    status: "accepted" | "rejected",
  ) {
    const docPath = `accounts/${this.groupId}/relatedAccounts/${request.id}`;
    const updatedData = {status: status};
    this.storeService.updateDoc(docPath, updatedData);
  }
}
