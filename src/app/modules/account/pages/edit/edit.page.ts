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
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
// import {UserRegistrationComponent} from "../../../account/pages/registration/components/user-registration/user-registration.component";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    // UserRegistrationComponent,
  ],
})
export class EditPage {
  private accountId: string | null = null;
  private accountsSubscription?: Subscription;
  public account?: Partial<Account>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ionViewWillEnter() {
    this.accountsSubscription = this.storeService.accounts$.subscribe(
      (accounts) => {
        this.account = accounts.find(
          (account) => account.id === this.accountId,
        );
      },
    );
    if (!this.account) {
      this.storeService.getDocById("accounts", this.accountId);
    }
  }

  ionViewWillLeave() {
    this.accountsSubscription?.unsubscribe();
  }
}
