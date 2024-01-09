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
  groupId: string | null = null;
  account?: Partial<Account>;
  currentUser: User | null = this.authStoreService.getCurrentUser();
  currentMembersList: Partial<RelatedAccount>[] = [];
  pendingMembersList: Partial<RelatedAccount>[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account =
          accounts.find(
            (account) =>
              account.id === this.groupId && account.type === "group",
          ) ?? undefined;
        if (this.account) {
          this.sortRelatedAccounts(this.account.relatedAccounts || []);
        }
      },
    );
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  get isAdmin() {
    return (
      this.currentUser &&
      this.account?.groupDetails?.admins?.includes(this.currentUser.uid)
    );
  }

  isCurrentUserLastAdmin(member: Partial<RelatedAccount>): boolean {
    return (
      this.account?.groupDetails?.admins?.length === 1 &&
      this.account.groupDetails.admins.includes(member.id!)
    );
  }

  acceptMemberRequest(member: Partial<RelatedAccount>) {
    this.updateRelatedAccountStatus(member, "accepted");
  }

  rejectMemberRequest(member: Partial<RelatedAccount>) {
    this.updateRelatedAccountStatus(member, "rejected");
  }

  removeMemberRequest(member: Partial<RelatedAccount>) {
    const docPath = `accounts/${this.groupId}/relatedAccounts/${member.id}`;
    this.storeService.deleteDocAtPath(docPath);
  }

  private updateRelatedAccountStatus(
    member: Partial<RelatedAccount>,
    status: "accepted" | "rejected",
  ) {
    const docPath = `accounts/${this.groupId}/relatedAccounts/${member.id}`;
    const updatedData = {status: status};
    this.storeService.updateDocAtPath(docPath, updatedData);
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
}
