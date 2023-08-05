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
import {ActivatedRoute} from "@angular/router";
import {AppGroup} from "../../../../models/group.model";
import {DetailsComponent} from "./components/details/details.component";
import {HeroComponent} from "./components/hero/hero.component";
import {AppRelationship} from "../../../../models/relationship.model";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {MemberListComponent} from "./components/member-list/member-list.component";
import {GroupListComponent} from "./components/group-list/group-list.component";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../core/services/store.service";

@Component({
  selector: "app-group-profile",
  templateUrl: "./group-profile.page.html",
  styleUrls: ["./group-profile.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeroComponent,
    DetailsComponent,
    MemberListComponent,
    GroupListComponent,
  ],
})
export class GroupProfilePage {
  private groupsSubscription: Subscription | undefined;
  groupId: string | null = "";
  group: Partial<AppGroup> | null = {};
  memberList: AppRelationship[] = [];
  groupList: AppRelationship[] = [];
  isAdmin: boolean = false;
  isMember: boolean = false;
  isPendingMember: boolean = false;
  constructor(
    private authStoreService: AuthStoreService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private relationshipsCollectionService: RelationshipsCollectionService,
  ) {
    this.groupId = this.route.snapshot.paramMap.get("groupId");
    this.relationshipsCollectionService
      .getRelationships(this.groupId)
      .then((relationships) => {
        for (let relationship of relationships) {
          if (
            relationship.type === "group" &&
            relationship.status === "accepted"
          ) {
            this.groupList.push(relationship);
          } else if (
            relationship.type === "member" &&
            relationship.status === "accepted"
          ) {
            this.memberList.push(relationship);
          }
        }
      });
  }

  ionViewWillEnter() {
    this.getGroup();
  }

  ionViewWillLeave() {
    // Unsubscribe from the groups$ observable when the component is destroyed
    this.groupsSubscription?.unsubscribe();
  }

  getGroup() {
    this.groupsSubscription = this.storeService.groups$.subscribe((groups) => {
      this.group = groups.find((group) => group.id === this.groupId) || null;
      if (!this.group) {
        this.storeService.getDocById("groups", this.groupId);
      } else {
        let user = this.authStoreService.getCurrentUser();
        let userId = user?.uid ? user.uid : "";
        this.isAdmin = userId
          ? this.group?.admins?.includes(userId) || false
          : false;
        this.isMember = userId
          ? this.group?.members?.includes(userId) || false
          : false;
        this.isPendingMember = userId
          ? this.group?.pendingMembers?.includes(userId) || false
          : false;
      }
    });
  }
}
