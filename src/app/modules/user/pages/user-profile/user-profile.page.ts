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
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";

import {FriendListComponent} from "./components/friend-list/friend-list.component";
import {GroupMembershipListComponent} from "./components/group-membership-list/group-membership-list.component";
import {HeroComponent} from "./components/hero/hero.component";
import {DetailsComponent} from "./components/details/details.component";
import {Account} from "../../../../models/account.model"; // Updated model import
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {User} from "firebase/auth";
import {AppRelationship} from "../../../../models/relationship.model";

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
export class UserProfilePage implements OnInit {
  private uid: string | null = null;
  private accountsSubscription?: Subscription;
  private relationshipsSubscription?: Subscription;
  authUser: User | null = null;
  account: Partial<Account> | null = null;
  friendList: Partial<AppRelationship>[] = [];
  groupList: Partial<AppRelationship>[] = [];

  constructor(
    private authStoreService: AuthStoreService,
    private route: ActivatedRoute,
    private storeService: StoreService,
  ) {
    this.uid = this.route.snapshot.paramMap.get("uid");
    this.authUser = this.authStoreService.getCurrentUser();
  }

  ngOnInit() {
    if (this.uid) {
      this.storeService.getDocsWithSenderOrReceiverId(
        "relationships",
        this.uid,
      );
    }
  }

  get isProfileOwner(): boolean {
    return this.uid === this.authUser?.uid;
  }

  ionViewWillEnter() {
    this.initiateSubscribers();
  }

  ionViewWillLeave() {
    this.relationshipsSubscription?.unsubscribe();
    this.accountsSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account =
          accounts.find((account) => account.id === this.uid) ?? null;
        if (!this.account) {
          console.log("Account not found in store, fetching from server");
          this.storeService.getDocById("accounts", this.uid);
        }
      },
    );

    this.relationshipsSubscription = this.storeService.relationships$.subscribe(
      (relationships) => {
        this.sortRelationships(relationships);
      },
    );
  }

  sortRelationships(relationships: Partial<AppRelationship>[]) {
    this.friendList = [];
    this.groupList = [];
    for (let relationship of relationships) {
      if (this.uid && relationship.relatedIds?.includes(this.uid)) {
        if (
          relationship.type === "friend" &&
          relationship.status === "accepted"
        ) {
          this.friendList.push(relationship);
        } else if (
          relationship.type?.includes("member") &&
          relationship.status === "accepted"
        ) {
          this.groupList.push(relationship);
        }
      }
    }
  }
}
