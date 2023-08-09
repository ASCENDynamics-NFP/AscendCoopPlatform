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
import {User} from "firebase/auth";
import {AppGroup} from "../../../../models/group.model";
import {ActivatedRoute} from "@angular/router";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {StoreService} from "../../../../core/services/store.service";
import {PartnerSearchComponent} from "./component/partner-search/partner-search.component";
import {MemberSearchComponent} from "./component/member-search/member-search.component";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    PartnerSearchComponent,
    MemberSearchComponent,
  ],
})
export class SearchPage {
  groupId: string | null = null;
  user: User | null = null; // define your user here
  currentGroup: Partial<AppGroup> | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.user = this.authStoreService.getCurrentUser();
    this.groupId = this.activatedRoute.snapshot.paramMap.get("groupId");
  }

  get isAdmin(): boolean {
    if (!this.user?.uid) {
      return false;
    }
    return this.currentGroup?.admins?.includes(this.user?.uid) ?? false;
  }

  ionViewWillEnter() {
    this.currentGroup = this.storeService
      .getCollection("groups")
      .find((group) => group["id"] === this.groupId);
  }

  ionViewWillLeave() {}
}
