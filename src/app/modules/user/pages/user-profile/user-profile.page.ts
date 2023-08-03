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
import {Component, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";

import {FriendListComponent} from "./components/friend-list/friend-list.component";
import {GroupMembershipListComponent} from "./components/group-membership-list/group-membership-list.component";
import {HeroComponent} from "./components/hero/hero.component";
import {DetailsComponent} from "./components/details/details.component";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AppRelationship} from "../../../../models/relationship.model";
import {AppUser} from "../../../../models/user.model";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";
import {AuthStoreService} from "../../../../core/services/auth-store.service";

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
  ],
})
export class UserProfilePage implements OnInit, OnDestroy {
  private uid: string | null = null;
  private usersSubscription: Subscription;
  user: Partial<AppUser> | null = null;
  friendList: AppRelationship[] = [];
  groupList: AppRelationship[] = [];
  isProfileOwner: boolean = false;
  constructor(
    private authStoreService: AuthStoreService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private relationshipsCollectionService: RelationshipsCollectionService,
  ) {
    this.uid = this.route.snapshot.paramMap.get("uid");
    this.usersSubscription = this.storeService.users$.subscribe((users) => {
      // console.log(uid, users);
      this.user = users.find((user) => user.id === this.uid) ?? null;
    });
  }

  ngOnInit() {
    if (!this.user) {
      // console.log("User not found in store, fetching from server");
      this.storeService.getUserById(this.uid);
    }

    this.relationshipsCollectionService
      .getRelationships(this.uid)
      .then((relationships) => {
        for (let relationship of relationships) {
          if (
            relationship.type === "friend" &&
            relationship.status === "accepted"
          ) {
            this.friendList.push(relationship);
          } else if (
            relationship.type === "member" &&
            relationship.status === "accepted"
          ) {
            this.groupList.push(relationship);
          }
        }
        this.isProfileOwner =
          this.uid === this.authStoreService.getCurrentUser()?.uid;
      });
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }
}
