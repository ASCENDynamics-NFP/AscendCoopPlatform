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
import {IonicModule} from "@ionic/angular";
import {AuthService} from "../../../../core/services/auth.service";

import {ActivatedRoute, RouterModule} from "@angular/router";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";

@Component({
  selector: "app-user-groups",
  templateUrl: "./user-groups.page.html",
  styleUrls: ["./user-groups.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class UserGroupsPage implements OnInit {
  currentGroupsList: any[] = [];
  pendingGroupsList: any[] = [];
  userId: string | null = null;
  currentUser: any;
  constructor(
    private authService: AuthService,

    private activatedRoute: ActivatedRoute,
    private relationshipsCollectionService: RelationshipsCollectionService,
  ) {}

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get("uid");
    this.relationshipsCollectionService
      .getRelationships(this.userId)
      .then((relationships) => {
        this.currentUser = this.authService.getCurrentUser();
        for (let relationship of relationships) {
          if (
            relationship.type === "member" &&
            relationship.status === "accepted"
          ) {
            this.currentGroupsList.push(this.relationshipToGroup(relationship));
          } else if (
            relationship.type === "member" &&
            relationship.status === "pending" &&
            this.currentUser?.uid === this.userId
          ) {
            this.pendingGroupsList.push(this.relationshipToGroup(relationship));
          }
        }
      });
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  acceptGroupRequest(group: any) {
    this.relationshipsCollectionService
      .updateRelationship(group.id, {
        status: "accepted",
      })
      .then(() => {
        group.showRemoveButton = true;
        this.currentGroupsList.push(group);
        this.pendingGroupsList = this.pendingGroupsList.filter(
          (pendingGroup) => pendingGroup.id !== group.id,
        );
      });
  }

  rejectGroupRequest(group: any) {
    this.relationshipsCollectionService
      .updateRelationship(group.id, {
        status: "rejected",
      })
      .then(() => {
        this.pendingGroupsList = this.pendingGroupsList.filter(
          (pendingGroup) => pendingGroup.id !== group.id,
        );
      });
  }

  removeGroupRequest(group: any) {
    this.relationshipsCollectionService
      .deleteRelationship(group.id)
      .then(() => {
        this.currentGroupsList = this.currentGroupsList.filter(
          (currentGroup) => currentGroup.id !== group.id,
        );
        this.pendingGroupsList = this.pendingGroupsList.filter(
          (pendingGroup) => pendingGroup.id !== group.id,
        );
      });
  }

  relationshipToGroup(relationship: any) {
    this.userId = this.userId ? this.userId : "";
    const isCurrentUser = this.currentUser?.uid === this.userId;
    if (relationship.senderId === this.userId) {
      // my requests
      return {
        id: relationship.id,
        userId: relationship.receiverId,
        name: relationship.receiverName,
        image: relationship.receiverImage,
        tagline: relationship.receiverTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: isCurrentUser,
        showAcceptRejectButtons: false,
      };
    } else {
      // other's requests
      return {
        id: relationship.id,
        userId: relationship.senderId,
        name: relationship.senderName,
        image: relationship.senderImage,
        tagline: relationship.senderTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: relationship.status === "accepted" && isCurrentUser,
        showAcceptRejectButtons: isCurrentUser,
      };
    }
  }
}
