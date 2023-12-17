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
import {StoreService} from "../../../../../../core/services/store.service";
import {AppRelationship} from "../../../../../../models/relationship.model";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../../../models/account.model";

@Component({
  selector: "app-member-search",
  templateUrl: "./member-search.component.html",
  styleUrls: ["./member-search.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class MemberSearchComponent {
  @Input() isAdmin: boolean = false;
  @Input() user: User | null = null; // define your user here
  @Input() currentGroup?: Partial<Account>;
  @Input() users: Partial<Account>[] | null = [];
  searchTerm: string = "";

  constructor(private storeService: StoreService) {}

  ionViewWillEnter() {}

  ionViewWillLeave() {}

  get searchResults() {
    if (!this.users) {
      return [];
    }
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter((user) =>
      user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  searchGroups(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      this.storeService.searchDocsByName("users", this.searchTerm);
    }
  }

  inviteUser(user: Partial<Account>) {
    if (!this.currentGroup?.id || !user.id) {
      return;
    }
    const relationship: Partial<AppRelationship> = {
      relatedIds: [this.currentGroup.id, user.id],
      senderId: this.currentGroup?.id,
      receiverId: user.id,
      type: "member-invite",
      status: "pending",
      membershipRole: "member",
      receiverRelationship: "user",
      senderRelationship: "group",
      receiverName: user.name,
      receiverImage: user.iconImage,
      receiverTagline: user.tagline,
      senderName: this.currentGroup.name,
      senderImage: this.currentGroup.iconImage,
      senderTagline: this.currentGroup.tagline,
    };

    this.storeService.createDoc("relationships", relationship).then(() => {
      // Update the user's pendingGroups in the state
      // if (!user.pendingGroups) {
      //   user.pendingGroups = [];
      // }
      // user.pendingGroups = this.user?.uid
      //   ? [...user.pendingGroups, this.user.uid]
      //   : [...user.pendingGroups];
      this.storeService.updateDocInState("accounts", user);
    });
  }
}
