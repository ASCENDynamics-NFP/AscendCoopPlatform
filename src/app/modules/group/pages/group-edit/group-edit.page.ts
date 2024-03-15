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
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../models/account.model";
import {ActivatedRoute} from "@angular/router";
import {StoreService} from "../../../../core/services/store.service";
import {Subscription} from "rxjs";
import {GroupRegistrationComponent} from "../../../account/pages/registration/components/group-registration/group-registration.component";

@Component({
  selector: "app-group-edit",
  templateUrl: "./group-edit.page.html",
  styleUrls: ["./group-edit.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    GroupRegistrationComponent,
  ],
})
export class GroupEditPage {
  private accountsSubscription?: Subscription;
  account: Partial<Account> | null = null;
  groupId: string | null = null;

  constructor(
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.groupId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account =
          accounts.find((account) => account.id === this.groupId) || null;
      },
    );
    if (!this.account) {
      this.storeService.getDocById("accounts", this.groupId);
    }
  }

  ionViewWillLeave() {
    // Unsubscribe from the accounts$ observable when the component is destroyed
    this.accountsSubscription?.unsubscribe();
  }
}
