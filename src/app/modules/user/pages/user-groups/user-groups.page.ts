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

import {ActivatedRoute, RouterModule} from "@angular/router";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {User} from "firebase/auth";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {AppRelationship} from "../../../../models/relationship.model";

@Component({
  selector: "app-user-groups",
  templateUrl: "./user-groups.page.html",
  styleUrls: ["./user-groups.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class UserGroupsPage implements OnInit {
  private relationshipsSubscription: Subscription | undefined;
  private relationships: Partial<AppRelationship>[] = [];
  currentGroupsList: any[] = [];
  pendingGroupsList: any[] = [];
  userId: string;
  currentUser: User | null = this.authStoreService.getCurrentUser();
  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get("uid") ?? "";
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.relationshipsSubscription = this.storeService.relationships$.subscribe(
      (relationships) => {
        this.relationships = relationships;
        this.sortRelationships(relationships);
      },
    );
  }

  ionViewWillLeave() {
    this.relationshipsSubscription?.unsubscribe();
  }

  acceptGroupRequest(group: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === group.id,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "accepted";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);

    group.showRemoveButton = true;
    this.currentGroupsList.push(group);
    this.pendingGroupsList = this.pendingGroupsList.filter(
      (pendingGroup) => pendingGroup.id !== group.id,
    );
  }

  rejectGroupRequest(group: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === group.id,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "rejected";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);

    this.pendingGroupsList = this.pendingGroupsList.filter(
      (pendingGroup) => pendingGroup.id !== group.id,
    );
  }

  /**
   * Removes a group request by deleting the associated relationship.
   * After deleting the relationship, it updates the group to remove the user from the admin, pendingMembers, and members lists.
   *
   * @param {any} group - The group object which contains the relationshipId and other group details.
   */
  removeGroupRequest(group: any) {
    if (group.relationshipId) {
      this.storeService.deleteDoc("relationships", group.relationshipId);
      // After deleting the relationship, update the group to remove the user from the admin, pendingMembers and members list
      const updatedGroup = this.storeService
        .getCollection("groups")
        .find((g) => g["id"] !== group.id);
      if (updatedGroup) {
        updatedGroup["admins"] = updatedGroup["admins"].filter(
          (admin: string) => admin !== this.userId,
        );
        updatedGroup["members"] = updatedGroup["members"].filter(
          (member: string) => member !== this.userId,
        );
        updatedGroup["pendingMembers"] = updatedGroup["pendingMembers"].filter(
          (pendingMember: string) => pendingMember !== this.userId,
        );
        this.storeService.addDocToState("groups", updatedGroup);
        this.storeService.removeDocFromState(
          "relationships",
          group.relationshipId,
        );
      }
    }
  }

  relationshipToGroup(relationship: any) {
    const isCurrentUser = this.currentUser?.uid === this.userId;
    if (relationship.senderId === this.userId) {
      // my requests
      return {
        relationshipId: relationship.id,
        id: relationship.receiverId,
        userId: this.userId,
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
        relationshipId: relationship.id,
        id: relationship.senderId,
        userId: this.userId,
        name: relationship.senderName,
        image: relationship.senderImage,
        tagline: relationship.senderTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: relationship.status === "accepted" && isCurrentUser,
        showAcceptRejectButtons: isCurrentUser,
      };
    }
  }

  sortRelationships(relationships: Partial<AppRelationship>[]) {
    this.currentGroupsList = [];
    this.pendingGroupsList = [];

    this.currentUser = this.authStoreService.getCurrentUser();
    for (let relationship of relationships) {
      if (
        relationship.senderId === this.userId ||
        relationship.receiverId === this.userId
      ) {
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
    }
  }
}
