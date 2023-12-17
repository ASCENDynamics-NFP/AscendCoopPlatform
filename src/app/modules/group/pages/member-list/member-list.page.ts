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
import {Account} from "../../../../models/account.model";
import {User} from "firebase/auth";
import {AppRelationship} from "../../../../models/relationship.model";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.page.html",
  styleUrls: ["./member-list.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
/**
 * Represents a page where group admins can manage their group members.
 */
export class MemberListPage {
  private accountsSubscription?: Subscription;
  private relationshipsSubscription?: Subscription;
  relationships: Partial<AppRelationship>[] = [];
  currentMembersList: any[] = [];
  pendingMembersList: any[] = [];
  groupId: string | null = null;
  account?: Partial<Account>;
  currentUser: User | null = this.authStoreService.getCurrentUser();

  /**
   * Constructs the MemberListPage.
   * @param {ActivatedRoute} activatedRoute - The activated route.
   * @param {AuthStoreService} authStoreService - The authentication store service.
   * @param {StoreService} storeService - The store service.
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");

    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account =
          accounts.find((account) => account.id === this.groupId) ?? null;
      },
    );
  }

  /**
   * Lifecycle hook that is called when the page is about to enter.
   */
  ionViewWillEnter() {
    this.relationshipsSubscription = this.storeService.relationships$.subscribe(
      (relationships) => {
        this.relationships = relationships;
        this.sortRelationships(relationships);
      },
    );
  }

  /**
   * Lifecycle hook that is called when the page is about to leave.
   */
  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
    this.relationshipsSubscription?.unsubscribe();
  }

  /**
   * Checks if the current user is an admin of the group.
   * @returns {boolean} - True if the user is an admin, otherwise false.
   */
  get isAdmin() {
    if (!this.account?.groupDetails || !this.currentUser) return false;
    return this.account.groupDetails.admins?.includes(this.currentUser.uid);
  }

  /**
   * Accepts a member request to join the group.
   * @param {any} request - The member request to accept.
   */
  acceptMemberRequest(request: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === request.relationshipId,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "accepted";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    this.addMember(request);
  }

  /**
   * Rejects a member request to join the group.
   * @param {any} request - The member request to reject.
   */
  rejectMemberRequest(request: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === request.relationshipId,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "rejected";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    this.removeMember(request);
  }

  /**
   * Adds a member to the group.
   * @param {any} request - The member request to process.
   */
  addMember(request: any) {
    // Add the member to the group's members lists
    const updatedGroupDoc = this.storeService
      .getCollection("accounts")
      .find((g) => g["id"] === request.groupId);
    if (updatedGroupDoc) {
      updatedGroupDoc["members"] = updatedGroupDoc["members"].push(
        request.memberId,
      );
      // updatedGroupDoc["pendingMembers"] = updatedGroupDoc[
      //   "pendingMembers"
      // ].filter((pendingMember: string) => pendingMember !== request.memberId);
      // Use addDocToState to update the state
      this.storeService.addDocToState("accounts", updatedGroupDoc);
    }
    // Add the group to the member's groups lists
    const updatedMemberDoc = this.storeService
      .getCollection("users")
      .find((u) => u["id"] === request.memberId);
    if (updatedMemberDoc) {
      updatedMemberDoc["groups"] = updatedMemberDoc["groups"].push(
        request.groupId,
      );
      // updatedMemberDoc["pendingGroups"] = updatedMemberDoc[
      //   "pendingGroups"
      // ].filter((pendingGroup: string) => pendingGroup !== request.groupId);
      // Use addDocToState to update the state
      this.storeService.addDocToState("accounts", updatedMemberDoc);
    }
  }

  /**
   * Removes a member request.
   * @param {any} request - The member request to remove.
   */
  removeMemberRequest(request: any) {
    if (request.relationshipId) {
      this.storeService.deleteDoc("relationships", request.relationshipId);
      // After deleting the relationship, execute the following logic
      this.removeMember(request);
    }
  }

  /**
   * Removes a member from the group.
   * @param {any} request - The member request to process.
   */
  removeMember(request: any) {
    // Remove the group from the member's groups lists
    const updatedMemberDoc = this.storeService
      .getCollection("accounts")
      .find((u) => u["id"] === request.friendId);
    if (updatedMemberDoc) {
      updatedMemberDoc["groups"] = updatedMemberDoc["groups"].filter(
        (group: string) => group !== this.groupId,
      );
      updatedMemberDoc["pendingGroups"] = updatedMemberDoc[
        "pendingGroups"
      ].filter((pendingGroup: string) => pendingGroup !== this.groupId);
      // Use addDocToState to update the state
      this.storeService.addDocToState("accounts", updatedMemberDoc);
    }
    // Remove the member from the group's members lists
    const updatedGroupDoc = this.storeService
      .getCollection("accounts")
      .find((g) => g["id"] === request.groupId);
    if (updatedGroupDoc) {
      updatedGroupDoc["members"] = updatedGroupDoc["members"].filter(
        (member: string) => member !== request.friendId,
      );
      updatedGroupDoc["pendingMembers"] = updatedGroupDoc[
        "pendingMembers"
      ].filter((pendingMember: string) => pendingMember !== request.friendId);
      // Use addDocToState to update the state
      this.storeService.addDocToState("accounts", updatedGroupDoc);
    }
  }

  /**
   * Converts a relationship object to a member object.
   * @param {Partial<AppRelationship>} relationship - The relationship to convert.
   * @returns {any} - The converted member object.
   */
  relationshipToMember(relationship: Partial<AppRelationship>) {
    if (!this.account?.groupDetails || !this.currentUser) return;
    if (!this.account.groupDetails.admins)
      this.account.groupDetails.admins = [];
    if (relationship.senderId === this.groupId) {
      // my requests
      return {
        relationshipId: relationship.id,
        groupId: relationship.senderId,
        memberId: relationship.receiverId,
        name: relationship.receiverName,
        image: relationship.receiverImage,
        tagline: relationship.receiverTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: this.isAdmin,
        showAcceptRejectButtons: false,
      };
    } else {
      // other's requests
      return {
        relationshipId: relationship.id,
        groupId: relationship.receiverId,
        memberId: relationship.senderId,
        name: relationship.senderName,
        image: relationship.senderImage,
        tagline: relationship.senderTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: relationship.status === "accepted" && this.isAdmin,
        showAcceptRejectButtons: this.isAdmin,
      };
    }
  }

  /**
   * Sorts relationships into current members and pending members lists.
   * @param {Partial<AppRelationship>[]} relationships - The relationships to sort.
   */
  sortRelationships(relationships: Partial<AppRelationship>[]) {
    this.currentMembersList = [];
    this.pendingMembersList = [];

    this.currentUser = this.authStoreService.getCurrentUser();
    for (let relationship of relationships) {
      if (
        relationship.senderId === this.groupId ||
        relationship.receiverId === this.groupId
      ) {
        if (
          relationship.type?.includes("member") && // Needs to be type member which is a member of a group
          relationship.status === "accepted" // Needs to be status accepted which is a current member
        ) {
          this.currentMembersList.push(this.relationshipToMember(relationship));
        } else if (
          relationship.type?.includes("member") && // Needs to be type member which is a member of a group
          relationship.status === "pending" // Needs to be status pending which is a pending request
        ) {
          this.pendingMembersList.push(this.relationshipToMember(relationship));
        }
      }
    }
  }
}
