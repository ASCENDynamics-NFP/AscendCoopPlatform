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
import {CommonModule} from "@angular/common";
import {Component} from "@angular/core";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AlertController, IonicModule} from "@ionic/angular";
import {User} from "firebase/auth";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../../../core/services/auth-store.service";
import {StoreService} from "../../../../../../core/services/store.service";
import {Account} from "../../../../../../models/account.model";
import {AppRelationship} from "../../../../../../models/relationship.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class MembersComponent {
  private accountSubscription?: Subscription;
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
    private alertController: AlertController,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");

    this.accountSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account =
          accounts.find(
            (account) =>
              account.id === this.groupId && account.type === "group",
          ) ?? undefined;
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
    this.accountSubscription?.unsubscribe();
    this.relationshipsSubscription?.unsubscribe();
  }

  /**
   * Checks if the current user is an admin of the group.
   * @returns {boolean} - True if the user is an admin, otherwise false.
   */
  get isAdmin() {
    if (!this.account || !this.currentUser) return false;
    return this.account.groupDetails?.admins?.includes(this.currentUser.uid);
  }

  isCurrentUserLastAdmin(member: any): boolean {
    // 'admins' are part of the 'groupDetails' in the Account model
    return (
      this.account?.groupDetails?.admins?.length === 1 &&
      this.account.groupDetails.admins.includes(member.memberId)
    );
  }

  /**
   * Accepts a member request to join the group.
   * @param {any} request - The member request to accept.
   */
  acceptMemberRequest(request: any) {
    const relationship = this.relationships.find(
      (rel) => rel.id === request.relationshipId,
    );
    if (relationship) {
      relationship.status = "accepted";
      this.storeService.updateDoc("relationships", relationship);
      this.addMemberToGroup(request.receiverId);
    }
  }

  /**
   * Rejects a member request to join the group.
   * @param {any} request - The member request to reject.
   */
  rejectMemberRequest(request: any) {
    const relationship = this.relationships.find(
      (rel) => rel.id === request.relationshipId,
    );
    if (relationship) {
      relationship.status = "rejected";
      this.storeService.updateDoc("relationships", relationship);
    }
  }

  /**
   * Adds a member to the group's associations.
   * @param {string} memberId - The ID of the member to add.
   */
  addMemberToGroup(memberId: string) {
    if (this.account?.associations?.accounts) {
      this.account.associations.accounts = [
        ...this.account.associations.accounts,
        memberId,
      ];
      this.storeService.updateDoc("accounts", this.account);
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
    if (this.account?.associations?.accounts) {
      this.account.associations.accounts =
        this.account.associations.accounts.filter(
          (id) => id !== request.memberId,
        );
      this.storeService.updateDoc("accounts", this.account);
    }
  }

  updateAdminStatus(member: any) {
    if (member.isAdmin) {
      this.changeAdminStatus(
        member,
        true,
        this.account?.groupDetails?.admins?.length || 0,
      );
    } else {
      this.changeAdminStatus(
        member,
        false,
        this.account?.groupDetails?.admins?.length || 0,
      );
    }
  }

  async changeAdminStatus(
    member: any,
    makeAdmin: boolean,
    currentAdminCount: number,
  ) {
    if (!makeAdmin && currentAdminCount <= 1) {
      // Show alert here as in your existing code
      // Consider returning early or updating the UI after the Firestore update
      return;
    }

    if (makeAdmin) {
      // Confirm making a user an admin
      const confirmAdminAlert = await this.alertController.create({
        header: "Confirm Action",
        message: "Are you sure you want to make this user an admin?",
        buttons: [
          {text: "Cancel", role: "cancel"},
          {
            text: "Yes",
            handler: async () => {
              await this.updateAdminList(member.memberId, true);
            },
          },
        ],
      });
      await confirmAdminAlert.present();
    } else {
      // Confirm removing a user from admin
      const confirmRemoveAlert = await this.alertController.create({
        header: "Confirm Action",
        message: "Are you sure you want to remove this user from admin?",
        buttons: [
          {text: "Cancel", role: "cancel"},
          {
            text: "Yes",
            handler: async () => {
              await this.updateAdminList(member.memberId, false);
            },
          },
        ],
      });
      await confirmRemoveAlert.present();
    }
  }

  async updateAdminList(memberId: string, add: boolean) {
    const updatedAdmins = add
      ? [...(this.account?.groupDetails?.admins || []), memberId]
      : this.account?.groupDetails?.admins?.filter(
          (adminId) => adminId !== memberId,
        );

    if (this.account && this.account.groupDetails) {
      this.account.groupDetails.admins = updatedAdmins as string[];
      try {
        await this.storeService.updateDoc("accounts", this.account);
        // Optionally update the UI here to reflect the change
      } catch (error) {
        console.error("Failed to update admin status", error);
        // Handle error (e.g., show an alert to the user)
      }
    }
  }

  /**
   * Converts a relationship object to a member object.
   * @param {Partial<AppRelationship>} relationship - The relationship to convert.
   * @returns {any} - The converted member object.
   */
  relationshipToMember(relationship: Partial<AppRelationship>) {
    if (!this.account || !this.account.groupDetails || !this.currentUser)
      return;
    if (!this.account.groupDetails?.admins)
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
        isAdmin:
          relationship.receiverId && relationship.status === "accepted"
            ? this.account.groupDetails?.admins.includes(
                relationship.receiverId,
              )
            : false,
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
        isAdmin:
          relationship.senderId && relationship.status === "accepted"
            ? this.account.groupDetails?.admins.includes(relationship.senderId)
            : false,
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

    relationships.forEach((relationship) => {
      if (
        relationship.senderId === this.groupId ||
        relationship.receiverId === this.groupId
      ) {
        const memberObject = this.relationshipToMember(relationship);
        if (relationship.status === "accepted") {
          this.currentMembersList.push(memberObject);
        } else if (relationship.status === "pending") {
          this.pendingMembersList.push(memberObject);
        }
      }
    });
  }

  setMemberRole(relationshipId: string, role: string) {
    // Update the membership role in the relationship
    this.storeService.updateDoc("relationships", {
      id: relationshipId,
      membershipRole: role,
    });
  }
}
