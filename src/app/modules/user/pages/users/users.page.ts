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
import {User} from "firebase/auth";
import {RouterModule} from "@angular/router";
import {Account} from "../../../../models/account.model";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {RelatedAccount} from "../../../../models/related-account.model";

@Component({
  selector: "app-users",
  templateUrl: "./users.page.html",
  styleUrls: ["./users.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AppHeaderComponent,
  ],
})
export class UsersPage {
  private accountsSubscription?: Subscription;
  authUser: User | null = null;
  account?: Partial<Account>;
  accountList: Partial<Account>[] | null = [];
  searchedValue: string = "";

  constructor(
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.authUser = this.authStoreService.getCurrentUser();
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        if (accounts) {
          this.account = accounts.find((acc) => acc.id === this.authUser?.uid);
          this.accountList = accounts.filter((acc) =>
            acc.name?.toLowerCase().includes(this.searchedValue.toLowerCase()),
          );
        }
      },
    );
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  sendFriendRequest(account: Partial<Account>) {
    if (!this.authUser?.uid || !account.id) {
      return;
    }

    const newRelatedAccount: Partial<RelatedAccount> = {
      id: account.id,
      initiatorId: this.authUser.uid,
      targetId: account.id,
      type: "user",
      status: "pending",
      relationship: "friend",
      tagline: account.tagline,
      name: account.name,
      iconImage: account.iconImage,
    };

    this.storeService.setDoc(
      `accounts/${this.authUser.uid}/relatedAccounts`,
      newRelatedAccount,
    );
    // .then(() => {
    //   if (this.authUser) {
    //     // updated friends list on userList item to include receiverId in friends list so that the button doesn't show
    //     const updatedUserListItem = this.accountList?.find(
    //       (userListItem: Partial<Account>) => userListItem.id === account["id"],
    //     );

    //     // if (updatedUserListItem) {
    //     //   if (!updatedUserListItem.pendingFriends) {
    //     //     updatedUserListItem.pendingFriends = [];
    //     //   }
    //     //   updatedUserListItem.pendingFriends.push(this.authUser?.uid);

    //     //   // Use addDocToState to update the state
    //     //   this.storeService.addDocToState("accounts", updatedUserListItem);
    //     // }
    //   }
    // });
  }

  searchUsers(event: any) {
    const value = event.target.value;
    this.searchedValue = value;

    if (value) {
      // Perform search
      this.storeService.searchDocsByName("accounts", value);
    }

    // Get all accounts of type 'user' and sort them
    this.accountList = this.storeService
      .getCollection("accounts")
      .filter((account) => account["type"] === "user") // Filter for user type accounts
      .sort((a, b) => {
        if (a["name"]) {
          return a["name"].localeCompare(b["name"]);
        } else {
          return 0;
        }
      });
  }
}
