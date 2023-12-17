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
import {ActivatedRoute, RouterModule} from "@angular/router";
import {User} from "firebase/auth";
import {Subscription} from "rxjs";
import {AuthStoreService} from "../../../../../../core/services/auth-store.service";
import {StoreService} from "../../../../../../core/services/store.service";
import {Account} from "../../../../../../models/account.model";
import {AppRelationship} from "../../../../../../models/relationship.model";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-partners",
  templateUrl: "./partners.component.html",
  styleUrls: ["./partners.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PartnersComponent {
  private accountsSubscription?: Subscription;
  private relationshipsSubscription?: Subscription;
  relationships: Partial<AppRelationship>[] = [];
  currentGroupsList: any[] = [];
  pendingGroupsList: any[] = [];
  groupId: string | null = null;
  account?: Partial<Account>;
  currentUser: User | null = this.authStoreService.getCurrentUser();
  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");

    // Update to fetch relationships for the current account
    if (this.groupId) {
      this.storeService.getDocsWithSenderOrReceiverId(
        "relationships",
        this.groupId,
      );
    }
  }

  ionViewWillEnter() {
    this.initiateSubscribers();
  }

  ionViewWillLeave() {
    // Unsubscribe from the accounts$ observable when the component is destroyed
    this.accountsSubscription?.unsubscribe();
    this.relationshipsSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find((account) => account.id === this.groupId);
      },
    );
    this.relationshipsSubscription = this.storeService.relationships$.subscribe(
      (relationships) => {
        this.relationships = relationships;
        this.sortRelationships(relationships);
      },
    );
  }

  acceptPartnerRequest(request: any) {
    const relationship = this.relationships.find(
      (rel) => rel.id === request.relationshipId,
    );
    if (relationship) {
      relationship.status = "accepted";
      this.storeService.updateDoc("relationships", relationship);

      // Logic to add partner to the current account's list of partners
      if (this.account?.associations?.accounts) {
        this.account["associations"].accounts.push(request.partnerGroupId);
        this.storeService.updateDoc("accounts", this.account);
      }
    }
  }

  rejectPartnerRequest(request: any) {
    const relationship = this.relationships.find(
      (rel) => rel.id === request.relationshipId,
    );
    if (relationship) {
      relationship.status = "rejected";
      this.storeService.updateDoc("relationships", relationship);
    }
  }

  /**
   * Removes a partner request.
   * @param {any} request - The partner request to remove.
   */
  removePartnerRequest(request: any) {
    if (request.relationshipId) {
      this.storeService.deleteDoc("relationships", request.relationshipId);
      this.removePartner(request.partnerGroupId);
    }
  }

  addPartner(request: any) {
    // Add the partner to the current account's list of partners
    if (this.account && this.account["associations"]?.accounts) {
      if (
        !this.account["associations"].accounts.includes(request.partnerGroupId)
      ) {
        this.account["associations"].accounts.push(request.partnerGroupId);
        this.storeService.updateDoc("accounts", this.account);
      }
    }

    // Retrieve the partner account and add the current account to its list
    const updatedPartnerDoc = this.storeService
      .getCollection("accounts")
      .find(request.partnerGroupId);
    if (updatedPartnerDoc) {
      if (updatedPartnerDoc && updatedPartnerDoc["associations"]?.accounts) {
        if (
          !updatedPartnerDoc["associations"].accounts.includes(this.account?.id)
        ) {
          updatedPartnerDoc["associations"].accounts.push(this.account?.id);
          this.storeService.addDocToState("accounts", updatedPartnerDoc);
        }
      }
    }
  }

  /**
   * Removes a partner from the group.
   * @param {any} request - The partner request to process.
   */
  removePartner(partnerGroupId: string) {
    // Remove the partner from the current account's list of partners
    if (this.account && this.account["associations"]?.accounts) {
      this.account["associations"].accounts = this.account[
        "associations"
      ].accounts.filter((id) => id !== partnerGroupId);
      this.storeService.updateDoc("accounts", this.account);
    }

    // Retrieve the partner account and remove the current account from its list
    const partnerAccount = this.storeService
      .getCollection("accounts")
      .find((pg) => pg["id"] === partnerGroupId);

    if (partnerAccount && partnerAccount["associations"]?.accounts) {
      partnerAccount["associations"].accounts = partnerAccount[
        "associations"
      ].accounts.filter((id: string) => id !== this.account?.id);
      this.storeService.updateDoc("accounts", partnerAccount);
    }
  }

  relationshipToGroup(relationship: Partial<AppRelationship>) {
    // Assuming you want to display partner details
    let isAdmin = this.currentUser
      ? this.account?.groupDetails?.admins.includes(this.currentUser?.uid)
      : false;
    return {
      relationshipId: relationship.id,
      partnerGroupId:
        relationship.senderId === this.groupId
          ? relationship.receiverId
          : relationship.senderId,
      name:
        relationship.senderId === this.groupId
          ? relationship.receiverName
          : relationship.senderName,
      image:
        relationship.senderId === this.groupId
          ? relationship.receiverImage
          : relationship.senderImage,
      tagline:
        relationship.senderId === this.groupId
          ? relationship.receiverTagline
          : relationship.senderTagline,
      isPending: relationship.status === "pending",
      showAcceptRejectButtons: isAdmin && relationship.status === "pending",
      showRemoveButton: isAdmin && relationship.status === "accepted",
    };
  }

  sortRelationships(relationships: Partial<AppRelationship>[]) {
    this.currentGroupsList = relationships
      .filter(
        (rel) =>
          (rel.senderId === this.groupId || rel.receiverId === this.groupId) &&
          rel.type === "group" &&
          rel.status === "accepted",
      )
      .map(this.relationshipToGroup);

    this.pendingGroupsList = relationships
      .filter(
        (rel) =>
          (rel.senderId === this.groupId || rel.receiverId === this.groupId) &&
          rel.type === "group" &&
          rel.status === "pending",
      )
      .map(this.relationshipToGroup);
  }
}
