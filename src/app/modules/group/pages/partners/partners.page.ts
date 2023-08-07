import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AppGroup} from "../../../../models/group.model";
import {AppRelationship} from "../../../../models/relationship.model";
import {User} from "firebase/auth";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-partners",
  templateUrl: "./partners.page.html",
  styleUrls: ["./partners.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PartnersPage {
  private groupsSubscription: Subscription | undefined;
  private relationshipsSubscription: Subscription | undefined;
  relationships: Partial<AppRelationship>[] = [];
  currentGroupsList: any[] = [];
  pendingGroupsList: any[] = [];
  groupId: string | null = null;
  group: Partial<AppGroup> | null = null;
  currentUser: User | null = this.authStoreService.getCurrentUser();
  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
  }

  ionViewWillEnter() {
    this.initiateSubscribers();
  }

  ionViewWillLeave() {
    // Unsubscribe from the groups$ observable when the component is destroyed
    this.groupsSubscription?.unsubscribe();
    this.relationshipsSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    this.groupsSubscription = this.storeService.groups$.subscribe((groups) => {
      this.group = groups.find((group) => group.id === this.groupId) || null;
    });
    this.relationshipsSubscription = this.storeService.relationships$.subscribe(
      (relationships) => {
        this.relationships = relationships;
        this.sortRelationships(relationships);
      },
    );
  }

  acceptPartnerRequest(request: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === request.relationshipId,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "accepted";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic

    this.addPartner(request);
  }

  rejectPartnerRequest(request: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === request.relationshipId,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "rejected";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    this.removePartner(request);
  }

  /**
   * Removes a partner request.
   * @param {any} request - The partner request to remove.
   */
  removePartnerRequest(request: any) {
    if (request.relationshipId) {
      this.storeService.deleteDoc("relationships", request.relationshipId);
      // After deleting the relationship, execute the following logic
      this.removePartner(request);
    }
  }

  addPartner(request: any) {
    // Add the partner to the group's groups lists
    const updatedGroupDoc = this.storeService
      .getCollection("groups")
      .find((g) => g["id"] === request.groupId);
    if (updatedGroupDoc) {
      updatedGroupDoc["groups"] = updatedGroupDoc["groups"].push(
        request.partnerGroupId,
      );
      updatedGroupDoc["pendingGroups"] = updatedGroupDoc[
        "pendingGroups"
      ].filter((pendingMember: string) => pendingMember !== request.memberId);
      // Use addDocToState to update the state
      this.storeService.addDocToState("groups", updatedGroupDoc);
    }
    // Add the group to the partner's groups lists
    const updatedPartnerDoc = this.storeService
      .getCollection("groups")
      .find((g) => g["id"] === request.partnerGroupId);
    if (updatedPartnerDoc) {
      updatedPartnerDoc["groups"] = updatedPartnerDoc["groups"].push(
        request.groupId,
      );
      updatedPartnerDoc["pendingGroups"] = updatedPartnerDoc[
        "pendingGroups"
      ].filter((pendingGroup: string) => pendingGroup !== request.groupId);
      // Use addDocToState to update the state
      this.storeService.addDocToState("groups", updatedPartnerDoc);
    }
  }

  /**
   * Removes a partner from the group.
   * @param {any} request - The partner request to process.
   */
  removePartner(request: any) {
    // Remove the group from the partner's groups lists
    const updatedPartnerDoc = this.storeService
      .getCollection("users")
      .find((pg) => pg["id"] === request.partnerGroupId);
    if (updatedPartnerDoc) {
      updatedPartnerDoc["groups"] = updatedPartnerDoc["groups"].filter(
        (group: string) => group !== this.groupId,
      );
      updatedPartnerDoc["pendingGroups"] = updatedPartnerDoc[
        "pendingGroups"
      ].filter((pendingGroup: string) => pendingGroup !== this.groupId);
      // Use addDocToState to update the state
      this.storeService.addDocToState("groups", updatedPartnerDoc);
    }
    // Remove the partner from the group's groups lists
    const updatedGroupDoc = this.storeService
      .getCollection("groups")
      .find((g) => g["id"] === request.groupId);
    if (updatedGroupDoc) {
      updatedGroupDoc["groups"] = updatedGroupDoc["groups"].filter(
        (member: string) => member !== request.friendId,
      );
      updatedGroupDoc["pendingGroups"] = updatedGroupDoc[
        "pendingGroups"
      ].filter((pendingMember: string) => pendingMember !== request.friendId);
      // Use addDocToState to update the state
      this.storeService.addDocToState("groups", updatedGroupDoc);
    }
  }

  relationshipToGroup(relationship: Partial<AppRelationship>) {
    if (!this.group || !this.currentUser) return;
    if (!this.group.admins) this.group.admins = [];
    const isAdmin = this.group.admins.includes(this.currentUser.uid);
    if (relationship.senderId === this.groupId) {
      // my requests
      return {
        relationshipId: relationship.id,
        groupId: relationship.senderId,
        partnerGroupId: relationship.receiverId,
        name: relationship.receiverName,
        image: relationship.receiverImage,
        tagline: relationship.receiverTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: isAdmin,
        showAcceptRejectButtons: false,
      };
    } else {
      // other's requests
      return {
        relationshipId: relationship.id,
        groupId: relationship.receiverId,
        partnerGroupId: relationship.senderId,
        name: relationship.senderName,
        image: relationship.senderImage,
        tagline: relationship.senderTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: relationship.status === "accepted" && isAdmin,
        showAcceptRejectButtons: isAdmin,
      };
    }
  }

  sortRelationships(relationships: Partial<AppRelationship>[]) {
    this.currentGroupsList = [];
    this.pendingGroupsList = [];

    this.currentUser = this.authStoreService.getCurrentUser();
    for (let relationship of relationships) {
      if (
        relationship.senderId === this.groupId ||
        relationship.receiverId === this.groupId
      ) {
        if (
          relationship.type === "group" &&
          relationship.status === "accepted"
        ) {
          this.currentGroupsList.push(this.relationshipToGroup(relationship));
        } else if (
          relationship.type === "group" &&
          relationship.status === "pending" &&
          this.currentUser?.uid === this.groupId
        ) {
          this.pendingGroupsList.push(this.relationshipToGroup(relationship));
        }
      }
    }
  }
}
