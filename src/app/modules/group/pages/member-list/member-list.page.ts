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
import {Account, RelatedAccount} from "../../../../models/account.model";
import {User} from "firebase/auth";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.page.html",
  styleUrls: ["./member-list.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
/**
 * Represents a page where group admins can manage their group members.
 */
export class MemberListPage {
  private accountsSubscription?: Subscription;
  currentMembersList: Partial<RelatedAccount>[] = [];
  pendingMembersList: Partial<RelatedAccount>[] = [];
  accountId: string | null = null;
  account?: Partial<Account>;
  currentUser: User | null = null;

  /**
   * Constructs the MemberListPage.
   * @param {ActivatedRoute} activatedRoute - The activated route.
   * @param {AuthStoreService} authStoreService - The authentication store service.
   * @param {StoreService} storeService - The store service.
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
    this.currentUser = this.authStoreService.getCurrentUser();
  }

  /**
   * Lifecycle hook that is called when the page is about to enter.
   */
  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find((acc) => acc.id === this.accountId);
        if (this.account) {
          this.sortRelatedAccounts(this.account.relatedAccounts || []);
        }
      },
    );
  }

  /**
   * Lifecycle hook that is called when the page is about to leave.
   */
  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  sortRelatedAccounts(relatedAccounts: Partial<RelatedAccount>[]) {
    this.currentMembersList = relatedAccounts.filter(
      (ra) => ra.type === "user" && ra.status === "accepted",
    );
    this.pendingMembersList = relatedAccounts.filter(
      (ra) => ra.type === "user" && ra.status === "pending",
    );
    console.log(this.currentMembersList, this.pendingMembersList);
  }

  /**
   * Checks if the current user is an admin of the group.
   * @returns {boolean} - True if the user is an admin, otherwise false.
   */
  get isAdmin() {
    if (!this.account?.groupDetails || !this.currentUser) return false;
    return (
      this.isOwner() ||
      this.account.groupDetails.admins?.includes(this.currentUser.uid)
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

  /**
   * Adds a member to the group.
   * @param {any} request - The member request to process.
   */
  acceptRequest(request: Partial<RelatedAccount>) {
    this.updateStatus(request, "accepted");
  }

  /**
   * Rejects a member request to join the group.
   * @param {any} request - The member request to reject.
   */
  rejectRequest(request: Partial<RelatedAccount>) {
    this.updateStatus(request, "rejected");
  }

  /**
   * Removes a member from the group.
   * @param {any} request - The member request to process.
   */
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
      request.targetId === this.currentUser?.uid
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
