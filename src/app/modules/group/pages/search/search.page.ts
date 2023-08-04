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
import {User} from "firebase/auth";

import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AppGroup} from "../../../../models/group.model";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class SearchPage implements OnInit {
  private groupsSubscription: Subscription | undefined;
  user: User | null = null; // define your user here
  groups: Partial<AppGroup>[] | null = [];
  groupId: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private relationshipsCollectionService: RelationshipsCollectionService,
    private storeService: StoreService,
  ) {
    this.user = this.authStoreService.getCurrentUser();
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
  }

  ngOnInit() {
    this.groupsSubscription = this.storeService.groups$.subscribe((groups) => {
      this.groups = groups;
    });
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {
    // Unsubscribe from the groups$ observable when the component is destroyed
    this.groupsSubscription?.unsubscribe();
  }

  searchGroups(event: any) {
    const value = event.target.value;
    this.storeService.searchGroups(value);
  }

  sendRequest(group: Partial<AppGroup>) {
    this.relationshipsCollectionService
      .sendRequest({
        id: null,
        senderId: this.user?.uid ? this.user.uid : "",
        receiverId: group.id,
        type: "member",
        status: "pending",
        membershipRole: "",
        receiverRelationship: "group",
        senderRelationship: "user",
        receiverName: group.name,
        receiverImage: group.groupPicture,
        receiverTagline: group.tagline,
        senderName: this.user?.displayName ? this.user.displayName : "",
        senderImage: this.user?.photoURL ? this.user.photoURL : "",
        senderTagline: "",
      })
      .then(() => {
        // updated friends list on userList item to include receiverId in friends list so that the button doesn't show
        this.groups =
          this.groups?.map((group: Partial<AppGroup>) => {
            if (group.id === group["id"]) {
              if (!group.pendingMembers) {
                group.pendingMembers = [];
              }
              return {
                ...group,
                pendingFriends: this.user?.uid
                  ? [...group.pendingMembers, this.user.uid]
                  : [...group.pendingMembers],
              };
            } else {
              return group;
            }
          }) ?? [];
      });
  }
}
