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
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {User} from "firebase/auth";
import {AppGroup} from "../../../../models/group.model";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";
import {AppRelationship} from "../../../../models/relationship.model";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class SearchPage {
  private groupsSubscription: Subscription | undefined;
  user: User | null = null; // define your user here
  groups: Partial<AppGroup>[] | null = [];
  searchResults: Partial<AppGroup>[] | null = [];
  searchTerm: string = "";
  groupId: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.user = this.authStoreService.getCurrentUser();
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
  }

  ionViewWillEnter() {
    this.groupsSubscription = this.storeService.groups$.subscribe((groups) => {
      if (groups) {
        this.groups = groups;
        this.searchResults = this.groups;
        if (this.searchTerm) {
          this.searchResults = groups.filter((group) =>
            group.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
          );
        }
      }
    });
  }

  ionViewWillLeave() {
    // Unsubscribe from the groups$ observable when the component is destroyed
    this.groupsSubscription?.unsubscribe();
  }

  searchGroups(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      this.storeService.searchDocsByName("groups", this.searchTerm);
    } else {
      this.searchResults = this.storeService.getCollection("groups");
      this.searchResults = this.searchResults.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }
  }

  sendRequest(group: Partial<AppGroup>) {
    if (!this.user?.uid || !group.id) {
      return;
    }
    const relationship: Partial<AppRelationship> = {
      relatedIds: [this.user?.uid, group.id],
      senderId: this.user?.uid,
      receiverId: group.id,
      type: "member",
      status: "pending",
      membershipRole: "",
      receiverRelationship: "group",
      senderRelationship: "user",
      receiverName: group.name,
      receiverImage: group.groupPicture,
      receiverTagline: group.tagline,
      senderName: this.user?.displayName ? this.user.displayName : "",
      senderImage: this.user?.photoURL ? this.user.photoURL : "",
      senderTagline: "",
    };

    this.storeService.createDoc("relationships", relationship).then(() => {
      // Update the group's pendingMembers in the state
      if (!group.pendingMembers) {
        group.pendingMembers = [];
      }
      group.pendingMembers = this.user?.uid
        ? [...group.pendingMembers, this.user.uid]
        : [...group.pendingMembers];
      this.storeService.updateDocInState("groups", group);
    });
  }
}
