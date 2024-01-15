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
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {Account} from "../../../../models/account.model";
import {DetailsComponent} from "./components/details/details.component";
import {HeroComponent} from "./components/hero/hero.component";
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
    RouterModule,
  ],
})
export class GroupProfilePage {
  private accountsSubscription?: Subscription;
  accountId: string | null = "";
  group?: Partial<Account>;
  isAdmin: boolean = false;
  isMember: boolean = false;
  isPendingMember: boolean = false;

  constructor(
    private authStoreService: AuthStoreService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private router: Router,
  ) {
    this.accountId = this.route.snapshot.paramMap.get("accountId");
    if (this.accountId) {
      this.storeService.getAndSortRelatedAccounts(this.accountId);
    }
  }

  ionViewWillEnter() {
    this.initiateSubscribers();
  }

  ionViewWillLeave() {
    // Unsubscribe from the accounts$ observable when the component is destroyed
    this.accountsSubscription?.unsubscribe();
  }

  initiateSubscribers() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (groups) => {
        this.group = groups.find((group) => group.id === this.accountId);

        if (this.group) {
          if (this.group.type === "user") {
            // redirect user to /user-profile/:accountId
            this.router.navigate(["/user-profile", this.group.id]);
          }
          let user = this.authStoreService.getCurrentUser();
          let userId = user?.uid ? user.uid : "";
          // Filter for admin relationships
          const adminAccount = this.group?.relatedAccounts?.filter(
            (ra) => ra.relationship === "admin" && ra.id === userId,
          );
          this.isAdmin = this.group.id === userId || adminAccount !== undefined;
        }
      },
    );
  }
}
