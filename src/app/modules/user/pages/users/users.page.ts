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
import {Account, RelatedAccount} from "../../../../models/account.model";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";

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
          this.accountList = accounts
            .filter(
              (acc) =>
                acc.name
                  ?.toLowerCase()
                  .includes(this.searchedValue.toLowerCase()) &&
                acc.type === "user",
            )
            .sort((a, b) => {
              if (a["name"] && b["name"]) {
                return a["name"].localeCompare(b["name"]);
              } else {
                return 0;
              }
            });
        }
      },
    );
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  async sendFriendRequest(account: Partial<Account>) {
    if (!this.authUser?.uid || !account.id) {
      console.error("User ID or Account ID is missing");
      return;
    }

    const newRelatedAccount: Partial<RelatedAccount> = {
      id: account.id,
      initiatorId: this.authUser.uid,
      targetId: account.id,
      type: account.type,
      status: "pending",
      relationship: "friend",
      tagline: account.tagline,
      name: account.name,
      iconImage: account.iconImage,
    };

    // Add the new related account to Firestore
    await this.storeService.updateDocAtPath(
      `accounts/${this.authUser.uid}/relatedAccounts/${account.id}`,
      newRelatedAccount,
    );

    // Fetch the current user's account to update the relatedAccounts array
    this.updateRelatedAccounts(newRelatedAccount);
  }

  private updateRelatedAccounts(relatedAccount: Partial<RelatedAccount>) {
    if (this.account) {
      this.account.relatedAccounts = [
        ...(this?.account?.relatedAccounts || []),
        relatedAccount,
      ];
      this.storeService.updateDocInState("accounts", this.account);
    }
  }

  searchUsers(event: any) {
    const value = event.target.value;
    this.searchedValue = value;

    if (value) {
      // Perform search
      this.storeService.searchDocsByName("accounts", value);
    }
  }

  /**
   * Determines whether a request button should be displayed for a given account.
   *
   * @param {Partial<Account>} item - The account for which to determine whether a request button should be displayed.
   * @returns {boolean} - Returns true if the authenticated user is different from the item and there is no non-rejected related account with the same id as the item. Otherwise, it returns false.
   */
  displayRequestButton(item: Partial<Account>): boolean {
    const authUserId = this.authUser?.uid;
    if (!authUserId || authUserId === item.id) {
      return false;
    }

    return this.account?.relatedAccounts?.find(
      (ra) => ra.id === item.id && ra.status !== "rejected",
    )
      ? false
      : true;
  }
}
