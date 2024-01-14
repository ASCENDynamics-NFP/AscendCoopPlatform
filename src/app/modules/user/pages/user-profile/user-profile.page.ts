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
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {FriendListComponent} from "./components/friend-list/friend-list.component";
import {GroupMembershipListComponent} from "./components/group-membership-list/group-membership-list.component";
import {HeroComponent} from "./components/hero/hero.component";
import {DetailsComponent} from "./components/details/details.component";
import {Account, RelatedAccount} from "../../../../models/account.model";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {User} from "firebase/auth";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.page.html",
  styleUrls: ["./user-profile.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FriendListComponent,
    GroupMembershipListComponent,
    HeroComponent,
    DetailsComponent,
    AppHeaderComponent,
  ],
})
export class UserProfilePage {
  public accountId: string | null;
  private accountsSubscription?: Subscription;
  authUser: User | null = null;
  account?: Partial<Account>;
  friendList: Partial<RelatedAccount>[] = [];
  groupList: Partial<RelatedAccount>[] = [];

  constructor(
    private authStoreService: AuthStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
  ) {
    this.accountId = this.route.snapshot.paramMap.get("accountId");
    this.authUser = this.authStoreService.getCurrentUser();
  }

  get isProfileOwner(): boolean {
    return this.accountId === this.authUser?.uid;
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
        if (!this.accountId) return;
        this.account = accounts.find(
          (account) => account.id === this.accountId,
        );
        if (!this.account) {
          this.storeService.getDocById("accounts", this.accountId); // get and add doc to store
        } else {
          if (this.account?.type === "group") {
            this.router.navigate([
              `/group/${this.accountId}/${this.accountId}/details`,
            ]); // Navigate to group-profile
          }
          if (!this.account?.relatedAccounts) {
            this.storeService.getAndSortRelatedAccounts(this.accountId);
          } else {
            this.sortRelationships(this.account.relatedAccounts);
          }
        }
      },
    );
  }

  sortRelationships(relatedAccounts: Partial<RelatedAccount>[]) {
    this.friendList = relatedAccounts.filter(
      (ra) => ra.type === "user" && ra.status === "accepted",
    );
    this.groupList = relatedAccounts.filter(
      (ra) => ra.type === "group" && ra.status === "accepted",
    );
  }
}
