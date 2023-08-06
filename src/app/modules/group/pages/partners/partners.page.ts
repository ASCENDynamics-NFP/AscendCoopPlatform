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

  acceptGroupRequest(group: any) {
    const relationship = this.relationships.find(
      (relationship) => relationship.id === group.id,
    );
    if (!relationship) {
      return;
    }
    relationship.status = "accepted";
    this.storeService.updateDoc("relationships", relationship as Partial<any>);
    // After updating the relationship status, execute the following logic
    group.showRemoveButton = true;
    this.currentGroupsList.push(relationship);
    this.pendingGroupsList = this.pendingGroupsList.filter(
      (pendingFriend) => pendingFriend.id !== group.id,
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
    // After updating the relationship status, execute the following logic
    this.pendingGroupsList = this.pendingGroupsList.filter(
      (pendingFriend) => pendingFriend.id !== group.id,
    );
  }

  removeGroupRequest(group: any) {
    if (group.id) {
      this.storeService.deleteDoc("relationships", group.id);
      // After deleting the relationship, execute the following logic
      this.currentGroupsList = this.currentGroupsList.filter(
        (currentFriend) => currentFriend.id !== group.id,
      );
      this.pendingGroupsList = this.pendingGroupsList.filter(
        (pendingFriend) => pendingFriend.id !== group.id,
      );
    }
  }

  relationshipToGroup(relationship: Partial<AppRelationship>) {
    if (!this.group || !this.currentUser) return;
    if (!this.group.admins) this.group.admins = [];
    const isAdmin = this.group.admins.includes(this.currentUser.uid);
    if (relationship.senderId === this.groupId) {
      // my requests
      return {
        id: relationship.id,
        userId: relationship.receiverId,
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
        id: relationship.id,
        userId: relationship.senderId,
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
