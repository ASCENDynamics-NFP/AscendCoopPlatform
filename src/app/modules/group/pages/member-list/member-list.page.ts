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
  currentMembersList: any[] = [];
  pendingMembersList: any[] = [];
  groupId: string | null = null;
  account?: Partial<Account>;
  currentUser: User | null = this.authStoreService.getCurrentUser();

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
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");

    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find((account) => account.id === this.groupId);
      },
    );
  }

  /**
   * Lifecycle hook that is called when the page is about to enter.
   */
  ionViewWillEnter() {
    if (this.groupId) {
      this.storeService.getDocById("accounts", this.groupId);
      this.storeService.accounts$.subscribe((accounts) => {
        const groupAccount = accounts.find((acc) => acc.id === this.groupId);
        if (groupAccount) {
          const relatedAccounts = groupAccount.relatedAccounts ?? [];
          this.currentMembersList = relatedAccounts.filter(
            (ra) => ra.status === "accepted",
          );
          this.pendingMembersList = relatedAccounts.filter(
            (ra) => ra.status === "pending",
          );
        }
      });
    }
  }

  /**
   * Lifecycle hook that is called when the page is about to leave.
   */
  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  /**
   * Checks if the current user is an admin of the group.
   * @returns {boolean} - True if the user is an admin, otherwise false.
   */
  get isAdmin() {
    if (!this.account?.groupDetails || !this.currentUser) return false;
    return this.account.groupDetails.admins?.includes(this.currentUser.uid);
  }

  /**
   * Accepts a member request to join the group.
   * @param {any} request - The member request to accept.
   */
  acceptMemberRequest(member: Partial<RelatedAccount>) {
    if (!this.groupId || !member.id) return;
    const update = {status: "accepted"};
    this.storeService.updateDocAtPath(
      `accounts/${this.groupId}/relatedAccounts/${member.id}`,
      update,
    );
  }

  /**
   * Rejects a member request to join the group.
   * @param {any} request - The member request to reject.
   */
  rejectMemberRequest(member: Partial<RelatedAccount>) {
    if (!this.groupId || !member.id) return;
    this.storeService.deleteDocAtPath(
      `accounts/${this.groupId}/relatedAccounts/${member.id}`,
    );
  }

  /**
   * Adds a member to the group.
   * @param {any} request - The member request to process.
   */
  addMember(request: any) {
    const groupId = this.groupId;
    const memberId = request.id;

    if (!groupId || !memberId) return;

    // Add the member to the group's related accounts with status "accepted"
    this.storeService.updateDocAtPath(
      `accounts/${groupId}/relatedAccounts/${memberId}`,
      {status: "accepted"},
    );
  }

  /**
   * Removes a member request.
   * @param {any} request - The member request to remove.
   */
  removeMemberRequest(request: any) {
    const groupId = this.groupId;
    const memberId = request.id;

    if (!groupId || !memberId) return;

    // Delete the relationship document
    this.storeService.deleteDocAtPath(
      `accounts/${groupId}/relatedAccounts/${memberId}`,
    );
  }

  /**
   * Removes a member from the group.
   * @param {any} request - The member request to process.
   */
  removeMember(request: any) {
    const groupId = this.groupId;
    const memberId = request.id;

    if (!groupId || !memberId) return;

    // Remove the member from the group's related accounts
    this.storeService.deleteDocAtPath(
      `accounts/${groupId}/relatedAccounts/${memberId}`,
    );
  }
}
