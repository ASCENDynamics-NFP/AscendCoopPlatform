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
export class UserGroupsPage {
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

  acceptGroupRequest(request: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === request.relationshipId,
    );
    if (!relationship) {
      console.log("No relationship found");
      return;
    }
    relationship.status = "accepted";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // update the group in state to add the user to the members list
    let storedGroup = this.storeService
      .getCollection("groups")
      .find((g) => g["id"] === request.groupId);
    if (storedGroup) {
      storedGroup["members"] = storedGroup["members"].push(this.userId);
      storedGroup["pendingMembers"] = storedGroup["pendingMembers"].filter(
        (pendingMember: string) => pendingMember !== this.userId,
      );
      this.storeService.addDocToState("groups", storedGroup);
    }
  }

  rejectGroupRequest(request: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === request.relationshipId,
    );
    if (!relationship) {
      console.log("No relationship found");
      return;
    }
    relationship.status = "rejected";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // update the group in state to remove the user from the admin, members and pendingMembers list
    let storedGroup = this.storeService
      .getCollection("groups")
      .find((g) => g["id"] === request.groupId);
    if (storedGroup) {
      storedGroup["admins"] = storedGroup["admins"].filter(
        (admin: string) => admin !== this.userId,
      );
      storedGroup["members"] = storedGroup["members"].filter(
        (member: string) => member !== this.userId,
      );
      storedGroup["pendingMembers"] = storedGroup["pendingMembers"].filter(
        (pendingMember: string) => pendingMember !== this.userId,
      );
      this.storeService.addDocToState("groups", storedGroup);
    }
  }

  /**
   * Removes a group request by deleting the associated relationship.
   * After deleting the relationship, it updates the group to remove the user from the admin, pendingMembers, and members lists.
   *
   * @param {any} request - The request object which contains the relationshipId and other relationship details.
   */
  removeGroupRequest(request: any) {
    if (request.relationshipId) {
      this.storeService.deleteDoc("relationships", request.relationshipId);
      this.storeService.removeDocFromState(
        "relationships",
        request.relationshipId,
      );
      // After deleting the relationship, update the group in state to remove the user from the admin, pendingMembers and members list
      const updatedGroup = this.storeService
        .getCollection("groups")
        .find((g) => g["id"] === request.groupId);
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
      }
    }
  }

  relationshipToGroup(relationship: any) {
    const isCurrentUser = this.currentUser?.uid === this.userId;
    if (relationship.senderId === this.userId) {
      // my requests
      return {
        relationshipId: relationship.id,
        groupId: relationship.receiverId,
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
        groupId: relationship.senderId,
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
          relationship.type?.includes("member") &&
          relationship.status === "accepted"
        ) {
          this.currentGroupsList.push(this.relationshipToGroup(relationship));
        } else if (
          relationship.type?.includes("member") &&
          relationship.status === "pending" &&
          this.currentUser?.uid === this.userId
        ) {
          this.pendingGroupsList.push(this.relationshipToGroup(relationship));
        }
      }
    }
  }
}
