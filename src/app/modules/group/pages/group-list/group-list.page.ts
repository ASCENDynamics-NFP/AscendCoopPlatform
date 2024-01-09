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
import {Account, RelatedAccount} from "../../../../models/account.model";
import {User} from "firebase/auth";
import {RouterModule} from "@angular/router";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.page.html",
  styleUrls: ["./group-list.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AppHeaderComponent,
  ],
})
export class GroupListPage {
  private accountsSubscription?: Subscription;
  authUser: User | null = null;
  groups: Partial<Account>[] | null = [];
  private searchTerm: any;
  searchResults: Partial<Account>[] | null = [];
  user?: Partial<Account>;

  constructor(
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.authUser = this.authStoreService.getCurrentUser();
  }

  ionViewWillEnter() {
    // Subscribe to accounts and fetch related accounts
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.groups = accounts.filter((account) => account.type === "group");
        this.searchResults = this.groups;
        if (this.searchTerm) {
          this.searchResults = this.groups.filter((group) =>
            group.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
          );
        }
        this.user = accounts.find(
          (account) =>
            account.type === "user" && account.id === this.authUser?.uid,
        );

        // Fetch related accounts for the current user
        if (this.authUser?.uid) {
          this.storeService.getAndSortRelatedAccounts(this.authUser.uid);
          this.storeService.getCollection(
            `accounts/${this.authUser.uid}/relatedAccounts`,
          );
        }
      },
    );

    // Subscribe to relatedAccounts$ to update group request status
    this.storeService.relatedAccounts$.subscribe((relatedAccounts) => {
      // Logic to handle related accounts, e.g., update group request status
      // ...
    });
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }

  get image() {
    return this.user?.iconImage ? this.user.iconImage : "default-image-path";
  }

  searchGroups(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      this.storeService.searchDocsByName("accounts", this.searchTerm);
    } else {
      this.searchResults = this.storeService.getCollection("accounts");
      this.searchResults = this.searchResults.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }
  }

  sendRequest(group: Partial<Account>) {
    if (!this.authUser?.uid || !group.id) {
      return;
    }

    // Construct the path to the 'relatedAccounts' sub-collection
    const relatedAccountsPath = `accounts/${this.authUser.uid}/relatedAccounts/${group.id}`;

    // Create a related account request
    const relatedAccount: Partial<RelatedAccount> = {
      id: group.id, // ID of the group
      initiatorId: this.authUser.uid,
      targetId: group.id,
      type: "group",
      status: "pending",
      relationship: "member",
      tagline: group.tagline,
      name: group.name,
      iconImage: group.iconImage,
    };

    // Use createDocAtPath method to create the new related account document
    this.storeService
      .updateDocAtPath(relatedAccountsPath, relatedAccount)
      .then(() => {
        // Handle successful request creation
        // Update UI or state as needed
        console.log("Related account request sent successfully.");
      })
      .catch((error) => {
        console.error("Error sending related account request:", error);
        // Handle the error appropriately
      });
  }

  // Inside GroupListPage class
  isMemberOrPending(group: Partial<Account>): boolean {
    // Check if the current user's related accounts include the group with a status of 'accepted' or 'pending'
    return (
      this.user?.relatedAccounts?.some(
        (relatedAccount) =>
          relatedAccount.id === group.id &&
          (relatedAccount.status === "accepted" ||
            relatedAccount.status === "pending"),
      ) ?? false
    );
  }
}
