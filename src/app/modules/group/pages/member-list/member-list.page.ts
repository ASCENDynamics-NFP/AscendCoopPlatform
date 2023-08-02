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
import {MenuService} from "../../../../core/services/menu.service";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AuthService} from "../../../../core/services/auth.service";
import {AppGroup} from "../../../../models/group.model";
import {GroupsService} from "../../../../core/services/groups.service";
import {User} from "firebase/auth";
import {AppRelationship} from "../../../../models/relationship.model";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.page.html",
  styleUrls: ["./member-list.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class MemberListPage implements OnInit {
  currentMembersList: any[] = [];
  pendingMembersList: any[] = [];
  groupId: string | null = null;
  group: Partial<AppGroup> | null = null;
  currentUser: User | null = this.authService.getCurrentUser();
  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private activatedRoute: ActivatedRoute,
    private relationshipsCollectionService: RelationshipsCollectionService,
    private groupsService: GroupsService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
    this.groupsService.getGroupById(this.groupId).then((group) => {
      this.group = group;
    });
  }

  ngOnInit() {
    this.relationshipsCollectionService
      .getRelationships(this.groupId)
      .then((relationships) => {
        for (let relationship of relationships) {
          if (
            relationship.type === "member" && // Needs to be type member which is a member of a group
            relationship.status === "accepted" // Needs to be status accepted which is a current member
          ) {
            this.currentMembersList.push(
              this.relationshipToMember(relationship),
            );
          } else if (
            relationship.type === "member" && // Needs to be type member which is a member of a group
            relationship.status === "pending" // Needs to be status pending which is a pending request
          ) {
            this.pendingMembersList.push(
              this.relationshipToMember(relationship),
            );
          }
        }
      });
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  get isAdmin() {
    if (!this.group || !this.currentUser) return false;
    return this.group.admins?.includes(this.currentUser.uid);
  }

  acceptMemberRequest(member: any) {
    this.relationshipsCollectionService
      .updateRelationship(member.id, {
        status: "accepted",
      })
      .then(() => {
        member.showRemoveButton = true;
        this.currentMembersList.push(member);
        this.pendingMembersList = this.pendingMembersList.filter(
          (pendingMember) => pendingMember.id !== member.id,
        );
      });
  }

  rejectMemberRequest(member: any) {
    this.relationshipsCollectionService
      .updateRelationship(member.id, {
        status: "rejected",
      })
      .then(() => {
        this.pendingMembersList = this.pendingMembersList.filter(
          (pendingMember) => pendingMember.id !== member.id,
        );
      });
  }

  removeMemberRequest(member: any) {
    this.relationshipsCollectionService
      .deleteRelationship(member.id)
      .then(() => {
        this.currentMembersList = this.currentMembersList.filter(
          (currentMember) => currentMember.id !== member.id,
        );
        this.pendingMembersList = this.pendingMembersList.filter(
          (pendingMember) => pendingMember.id !== member.id,
        );
      });
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
}
