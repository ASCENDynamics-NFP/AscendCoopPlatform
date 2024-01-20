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
import {Component} from "@angular/core";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AlertController, IonicModule} from "@ionic/angular";
import {User} from "firebase/auth";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../../../core/services/auth-store.service";
import {StoreService} from "../../../../../../core/services/store.service";
import {Account, RelatedAccount} from "../../../../../../models/account.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class MembersComponent {
  private accountsSubscription?: Subscription;
  account?: Partial<Account>;
  accountId: string | null = null;
  currentUser: User | null = null;
  currentMembersList: Partial<RelatedAccount>[] = [];
  pendingMembersList: Partial<RelatedAccount>[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
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
  }

  updateAdminStatus(member: Partial<RelatedAccount>) {
    if (!this.isAdmin || !this.account?.groupDetails) return;
    const updatedAdmins =
      member.relationship === "admin"
        ? this.account.groupDetails.admins?.filter((id) => id !== member.id)
        : [...(this.account.groupDetails.admins || []), member.id];

    this.account.groupDetails.admins = updatedAdmins as string[];
    this.storeService.updateDoc("accounts", this.account);
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

  isCurrentUserLastAdmin(member: Partial<RelatedAccount>): boolean {
    return (
      this.account?.groupDetails?.admins?.length === 1 &&
      this.account.groupDetails.admins.includes(member.id!)
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
