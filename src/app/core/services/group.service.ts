import {Injectable, OnDestroy} from "@angular/core";
import {AppGroup} from "../../models/group.model";
import {StoreService} from "./store.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthStoreService} from "./auth-store.service";
import {User} from "firebase/auth";
import {AppUser} from "../../models/user.model";
import {AppRelationship} from "../../models/relationship.model";

@Injectable({
  providedIn: "root",
})
export class GroupService implements OnDestroy {
  private groupsSubscription: Subscription | undefined;
  private relationshipsSubscription: Subscription | undefined;
  private usersSubscription: Subscription | undefined;
  private groupId: string | null = null;
  private group: Partial<AppGroup> | undefined;
  private relationships: Partial<AppRelationship> | undefined;
  private authUser: User | null = null;
  private user: Partial<AppUser> | undefined;
  constructor(
    private authStoreService: AuthStoreService,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
    this.authUser = this.authStoreService.getCurrentUser();

    if (this.groupId) {
      this.storeService.getDocsWithSenderOrRecieverId(
        "relationships",
        this.groupId,
      );
      this.relationshipsSubscription =
        this.storeService.relationships$.subscribe((relationships) => {
          this.relationships = relationships.find(
            (relationship) =>
              relationship["senderId"] === this.groupId ||
              relationship["receiverId"] === this.groupId,
          );
        });
      this.groupsSubscription = this.storeService.groups$.subscribe(
        (groups) => {
          this.group = groups.find((group) => group["id"] === this.groupId);
        },
      );
      if (!this.group) {
        this.storeService.getDocById("groups", this.groupId);
      }
    }
    this.usersSubscription = this.storeService.users$.subscribe((users) => {
      this.user = users.find((user) => user["id"] === this.authUser?.uid);
    });
    if (!this.user && this.authUser?.uid) {
      this.storeService.getDocById("users", this.authUser?.uid);
    }
  }

  ngOnDestroy() {
    this.groupsSubscription?.unsubscribe();
    this.relationshipsSubscription?.unsubscribe();
    this.usersSubscription?.unsubscribe();
  }

  getGroup() {
    return this.group;
  }

  getUser() {
    return this.user;
  }

  getRelationships() {
    return this.relationships;
  }

  setMemberRole(relationshipId: string, role: string) {
    this.storeService.updateDoc("relationships", {
      id: relationshipId,
      membershipRole: role,
    });
  }
}
