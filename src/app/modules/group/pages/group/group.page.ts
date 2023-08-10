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
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {StoreService} from "../../../../core/services/store.service";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {User} from "firebase/auth";
import {Subscription} from "rxjs";
import {AppGroup} from "../../../../models/group.model";

@Component({
  selector: "app-group",
  templateUrl: "./group.page.html",
  styleUrls: ["./group.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class GroupPage {
  private groupsSubscription: Subscription | undefined;
  group: Partial<AppGroup> | null = null;
  groupId: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");

    if (this.groupId) {
      this.storeService.getDocsWithSenderOrRecieverId(
        "relationships",
        this.groupId,
      );
    }
  }

  get currentUser() {
    return this.authStoreService.getCurrentUser();
  }

  ionViewWillEnter() {
    this.initiateSubscribers();
  }

  ionViewWillLeave() {
    // Unsubscribe from the groups$ observable when the component is destroyed
    this.groupsSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    this.groupsSubscription = this.storeService.groups$.subscribe((groups) => {
      this.group = groups.find((group) => group.id === this.groupId) || null;
    });
  }
}
