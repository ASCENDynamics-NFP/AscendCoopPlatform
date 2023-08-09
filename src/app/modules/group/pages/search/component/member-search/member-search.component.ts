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
import {Component, Input} from "@angular/core";
import {RouterModule} from "@angular/router";
import {User} from "firebase/auth";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../../../core/services/store.service";
import {AppRelationship} from "../../../../../../models/relationship.model";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {AppGroup} from "../../../../../../models/group.model";
import {AppUser} from "../../../../../../models/user.model";

@Component({
  selector: "app-member-search",
  templateUrl: "./member-search.component.html",
  styleUrls: ["./member-search.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class MemberSearchComponent {
  private usersSubscription: Subscription | undefined;
  @Input() isAdmin: boolean = false;
  @Input() user: User | null = null; // define your user here
  @Input() currentGroup: Partial<AppGroup> | null = null;
  private users: Partial<AppUser>[] | null = [];
  searchResults: Partial<AppUser>[] | null = [];
  searchTerm: string = "";

  constructor(private storeService: StoreService) {}

  ionViewWillEnter() {
    this.usersSubscription = this.storeService.users$.subscribe((users) => {
      if (users) {
        this.users = users;
        this.searchResults = this.users;
        if (this.searchTerm) {
          this.searchResults = users.filter((user) =>
            user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
          );
        }
      }
    });
  }

  ionViewWillLeave() {
    // Unsubscribe from the users$ observable when the component is destroyed
    this.usersSubscription?.unsubscribe();
  }

  searchGroups(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      this.storeService.searchDocsByName("users", this.searchTerm);
    } else {
      this.searchResults = this.storeService.getCollection("users");
      this.searchResults = this.searchResults.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }
  }

  inviteUser(user: Partial<AppUser>) {
    if (!this.currentGroup?.id || !user.id) {
      return;
    }
    const relationship: Partial<AppRelationship> = {
      relatedIds: [this.currentGroup.id, user.id],
      senderId: this.currentGroup?.id,
      receiverId: user.id,
      type: "member",
      status: "pending",
      membershipRole: "member",
      receiverRelationship: "user",
      senderRelationship: "group",
      receiverName: user.name,
      receiverImage: user.profilePicture,
      receiverTagline: user.tagline,
      senderName: this.currentGroup.name,
      senderImage: this.currentGroup.logoImage,
      senderTagline: this.currentGroup.tagline,
    };

    this.storeService.createDoc("relationships", relationship).then(() => {
      // Update the user's pendingGroups in the state
      if (!user.pendingGroups) {
        user.pendingGroups = [];
      }
      user.pendingGroups = this.user?.uid
        ? [...user.pendingGroups, this.user.uid]
        : [...user.pendingGroups];
      this.storeService.updateDocInState("users", user);
    });
  }
}
