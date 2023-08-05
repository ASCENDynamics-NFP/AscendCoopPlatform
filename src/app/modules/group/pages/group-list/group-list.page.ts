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
import {AppGroup} from "../../../../models/group.model";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {User} from "firebase/auth";
import {RouterModule} from "@angular/router";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.page.html",
  styleUrls: ["./group-list.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class GroupListPage {
  private groupsSubscription: Subscription;
  user: User | null = null; // define your user here
  groups: Partial<AppGroup>[] | null = [];

  constructor(
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
    private relationshipsCollectionService: RelationshipsCollectionService,
  ) {
    this.user = this.authStoreService.getCurrentUser();
    this.groupsSubscription = this.storeService.groups$.subscribe((groups) => {
      this.groups = groups;
    });
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {
    this.groupsSubscription.unsubscribe();
  }

  searchGroups(event: any) {
    const value = event.target.value;
    this.storeService.searchDocsByName("groups", value);
  }

  sendRequest(group: Partial<AppGroup>) {
    this.relationshipsCollectionService
      .sendRequest({
        id: null,
        senderId: this.user?.uid ? this.user.uid : "",
        receiverId: group.id,
        type: "member",
        status: "pending",
        membershipRole: "member",
        receiverRelationship: "group",
        senderRelationship: "user",
        receiverName: group.name,
        receiverImage: group.logoImage
          ? group.logoImage
          : "assets/icon/favicon.png",
        receiverTagline: group.tagline,
        senderName: this.user?.displayName ? this.user.displayName : "",
        senderImage: this.user?.photoURL ? this.user.photoURL : "",
        senderTagline: "",
      })
      .then(() => {
        // updated group list on userList item to include receiverId in group list so that the button doesn't show
        this.groups =
          this.groups?.map((item: Partial<AppGroup>) => {
            if (item.id === group["id"]) {
              if (!item.pendingMembers) {
                item.pendingMembers = [];
              }
              return {
                ...item,
                pendingMembers: this.user?.uid
                  ? [...item.pendingMembers, this.user.uid]
                  : [...item.pendingMembers],
              };
            } else {
              return item;
            }
          }) ?? [];
      });
  }
}
