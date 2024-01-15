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
import {User} from "firebase/auth";

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
  accountId: string | null = null;
  currentUser: User | null = null;
  account?: Partial<Account>;
  isMember: boolean = false;
  isPendingMember: boolean = false;

  constructor(
    private authStoreService: AuthStoreService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private router: Router,
  ) {
    this.accountId = this.route.snapshot.paramMap.get("accountId");
    this.currentUser = this.authStoreService.getCurrentUser();
    if (this.accountId) {
      this.storeService.getAndSortRelatedAccounts(this.accountId);
    }
  }

  get isAdmin() {
    const foundAdmin = this.account?.relatedAccounts?.filter(
      (ra) => ra.relationship === "admin" && ra.id === this.currentUser?.uid,
    );
    return (
      ((this.accountId && this.currentUser?.uid === this.accountId) ||
        (foundAdmin && foundAdmin.length > 0)) ??
      false
    );
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
      (accounts) => {
        this.account = accounts.find((acc) => acc.id === this.accountId);
      },
    );

    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        if (!this.accountId) return;
        this.account = accounts.find(
          (account) => account.id === this.accountId,
        );
        if (!this.account) {
          this.storeService.getDocById("accounts", this.accountId); // get and add doc to store
        } else {
          if (this.account?.type === "user") {
            this.router.navigate([`/user-profile/${this.accountId}`]); // Navigate to user-profile
          }
          if (!this.account?.relatedAccounts) {
            this.storeService.getAndSortRelatedAccounts(this.accountId);
          }
        }
      },
    );
  }
}
