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
import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MenuService} from "../../../../core/services/menu.service";
import {GroupsService} from "../../../../core/services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {AppGroup} from "../../../../models/group.model";
import {DetailsComponent} from "./components/details/details.component";
import {HeroComponent} from "./components/hero/hero.component";
import {AppRelationship} from "../../../../models/relationship.model";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AuthService} from "../../../../core/services/auth.service";

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
  ],
})
export class GroupProfilePage implements OnInit {
  groupId: string | null;
  group: Partial<AppGroup> | null = {};
  user: any;
  memberList: AppRelationship[] = [];
  groupList: AppRelationship[] = [];
  canEdit: boolean = false;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private groupsService: GroupsService,
    private relationshipsCollectionService: RelationshipsCollectionService,
  ) {
    this.groupId = this.route.snapshot.paramMap.get("groupId");
  }

  ngOnInit() {
    this.getGroup();
    this.relationshipsCollectionService
      .getRelationships(this.groupId)
      .then((relationships) => {
        for (let relationship of relationships) {
          if (
            relationship.type === "group-group" &&
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
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  getGroup() {
    this.groupsService
      .getGroupById(this.groupId)
      .then((group) => {
        this.group = group;
        let userId = this.authService?.getCurrentUser()?.uid;
        this.canEdit = userId
          ? this.group?.admins?.includes(userId) || false
          : false;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
