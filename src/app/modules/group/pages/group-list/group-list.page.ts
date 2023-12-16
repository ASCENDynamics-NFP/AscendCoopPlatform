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
import {Account} from "../../../../models/account.model";
import {User} from "firebase/auth";
import {RouterModule} from "@angular/router";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {AppRelationship} from "../../../../models/relationship.model";

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
      },
    );
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
    const relationship: Partial<AppRelationship> = {
      relatedIds: [this.authUser?.uid, group.id],
      senderId: this.authUser?.uid,
      receiverId: group.id,
      type: "member",
      status: "pending",
      membershipRole: "member",
      receiverRelationship: "group",
      senderRelationship: "user",
      receiverName: group.name,
      receiverImage: group.iconImage
        ? group.iconImage
        : "assets/icon/favicon.png",
      receiverTagline: group.tagline,
      senderName: this.authUser?.displayName ? this.authUser.displayName : "",
      senderImage: this.authUser?.photoURL ? this.authUser.photoURL : "",
      senderTagline: "",
    };

    this.storeService.createDoc("relationships", relationship).then(() => {
      // Update the group's pendingMembers in the state
      // if (!group.pendingMembers) {
      //   group.pendingMembers = [];
      // }
      // group.pendingMembers = this.authUser?.uid
      //   ? [...group.pendingMembers, this.authUser.uid]
      //   : [...group.pendingMembers];
      this.storeService.updateDocInState("accounts", group);
    });
  }
}
