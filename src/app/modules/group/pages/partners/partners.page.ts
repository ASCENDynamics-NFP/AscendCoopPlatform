import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AppGroup} from "../../../../models/group.model";
import {AppRelationship} from "../../../../models/relationship.model";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AuthService} from "../../../../core/services/auth.service";
import {GroupsService} from "../../../../core/services/groups.service";
import {User} from "firebase/auth";

@Component({
  selector: "app-partners",
  templateUrl: "./partners.page.html",
  styleUrls: ["./partners.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PartnersPage implements OnInit {
  currentGroupsList: any[] = [];
  pendingGroupsList: any[] = [];
  groupId: string | null = null;
  group: Partial<AppGroup> | null = null;
  currentUser: User | null = this.authService.getCurrentUser();
  constructor(
    private authService: AuthService,

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
}
