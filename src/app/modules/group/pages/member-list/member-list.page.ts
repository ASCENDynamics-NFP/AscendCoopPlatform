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
import {AppGroup} from "../../../../models/group.model";
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
export class MemberListPage {
  private groupsSubscription: Subscription;
  private relationshipsSubscription: Subscription | undefined;
  relationships: Partial<AppRelationship>[] = [];
  currentMembersList: any[] = [];
  pendingMembersList: any[] = [];
  groupId: string | null = null;
  group: Partial<AppGroup> | null = null;
  currentUser: User | null = this.authStoreService.getCurrentUser();
  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");

    this.groupsSubscription = this.storeService.groups$.subscribe((groups) => {
      this.group = groups.find((group) => group.id === this.groupId) ?? null;
    });
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
    this.groupsSubscription?.unsubscribe();
    this.relationshipsSubscription?.unsubscribe();
  }

  get isAdmin() {
    if (!this.group || !this.currentUser) return false;
    return this.group.admins?.includes(this.currentUser.uid);
  }

  acceptMemberRequest(member: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === member.id,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "accepted";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    member.showRemoveButton = true;
    this.currentMembersList.push(relationship);
    this.pendingMembersList = this.pendingMembersList.filter(
      (pendingFriend) => pendingFriend.id !== member.id,
    );
  }

  rejectMemberRequest(member: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === member.id,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "rejected";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    this.pendingMembersList = this.pendingMembersList.filter(
      (pendingFriend) => pendingFriend.id !== member.id,
    );
  }

  removeMemberRequest(member: any) {
    if (member.id) {
      this.storeService.deleteDoc("relationships", member.id);
      // After deleting the relationship, execute the following logic
      this.currentMembersList = this.currentMembersList.filter(
        (currentFriend) => currentFriend.id !== member.id,
      );
      this.pendingMembersList = this.pendingMembersList.filter(
        (pendingFriend) => pendingFriend.id !== member.id,
      );
    }
  }

  relationshipToMember(relationship: Partial<AppRelationship>) {
    if (!this.group || !this.currentUser) return;
    if (!this.group.admins) this.group.admins = [];
    if (relationship.senderId === this.groupId) {
      // my requests
      return {
        id: relationship.id,
        userId: relationship.receiverId,
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
        id: relationship.id,
        userId: relationship.senderId,
        name: relationship.senderName,
        image: relationship.senderImage,
        tagline: relationship.senderTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: relationship.status === "accepted" && this.isAdmin,
        showAcceptRejectButtons: this.isAdmin,
      };
    }
  }

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
          relationship.type === "member" && // Needs to be type member which is a member of a group
          relationship.status === "accepted" // Needs to be status accepted which is a current member
        ) {
          this.currentMembersList.push(this.relationshipToMember(relationship));
        } else if (
          relationship.type === "member" && // Needs to be type member which is a member of a group
          relationship.status === "pending" // Needs to be status pending which is a pending request
        ) {
          this.pendingMembersList.push(this.relationshipToMember(relationship));
        }
      }
    }
  }
}
