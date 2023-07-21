import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MenuService} from "../../../../core/services/menu.service";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class FriendsPage implements OnInit {
  currentFriendsList: any[] = [];
  pendingFriendsList: any[] = [];
  userId: string | null = null;
  currentUser: any;
  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private activatedRoute: ActivatedRoute,
    private relationshipsCollectionService: RelationshipsCollectionService,
  ) {}

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get("uid");
    this.relationshipsCollectionService
      .getRelationships(this.userId)
      .then((relationships) => {
        this.currentUser = this.authService.getCurrentUser();
        for (let relationship of relationships) {
          if (
            relationship.type === "friend" &&
            relationship.status === "accepted"
          ) {
            this.currentFriendsList.push(
              this.relationshipToFriend(relationship),
            );
          } else if (
            relationship.type === "friend" &&
            relationship.status === "pending" &&
            this.currentUser?.uid === this.userId
          ) {
            this.pendingFriendsList.push(
              this.relationshipToFriend(relationship),
            );
          }
        }
      });
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  acceptFriendRequest(friend: any) {
    this.relationshipsCollectionService
      .updateRelationship(friend.id, {
        status: "accepted",
      })
      .then(() => {
        friend.showRemoveButton = true;
        this.currentFriendsList.push(friend);
        this.pendingFriendsList = this.pendingFriendsList.filter(
          (pendingFriend) => pendingFriend.id !== friend.id,
        );
      });
  }

  rejectFriendRequest(friend: any) {
    this.relationshipsCollectionService
      .updateRelationship(friend.id, {
        status: "rejected",
      })
      .then(() => {
        this.pendingFriendsList = this.pendingFriendsList.filter(
          (pendingFriend) => pendingFriend.id !== friend.id,
        );
      });
  }

  removeFriendRequest(friend: any) {
    this.relationshipsCollectionService
      .deleteRelationship(friend.id)
      .then(() => {
        this.currentFriendsList = this.currentFriendsList.filter(
          (currentFriend) => currentFriend.id !== friend.id,
        );
        this.pendingFriendsList = this.pendingFriendsList.filter(
          (pendingFriend) => pendingFriend.id !== friend.id,
        );
      });
  }

  relationshipToFriend(relationship: any) {
    this.userId = this.userId ? this.userId : "";
    const isCurrentUser = this.currentUser?.uid === this.userId;
    if (relationship.senderId === this.userId) {
      // my requests
      return {
        id: relationship.id,
        userId: relationship.receiverId,
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
        id: relationship.id,
        userId: relationship.senderId,
        name: relationship.senderName,
        image: relationship.senderImage,
        tagline: relationship.senderTagline,
        isPending: relationship.status === "pending",
        showRemoveButton: relationship.status === "accepted" && isCurrentUser,
        showAcceptRejectButtons: isCurrentUser,
      };
    }
  }
}
