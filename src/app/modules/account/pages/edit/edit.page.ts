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
import {EditMenuComponent} from "./components/edit-menu/edit-menu.component";
import {BasicInfoComponent} from "./components/basic-info/basic-info.component";
import {ContactInfoComponent} from "./components/contact-info/contact-info.component";
import {ProfessionalInfoComponent} from "./components/professional-info/professional-info.component";
import {VolunteerPreferenceInfoComponent} from "./components/volunteer-preference-info/volunteer-preference-info.component";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {User} from "firebase/auth";

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
    EditMenuComponent,
    BasicInfoComponent,
    ContactInfoComponent,
    ProfessionalInfoComponent,
    VolunteerPreferenceInfoComponent,
  ],
})
export class EditPage {
  selectedForm: String = "basic";
  authUser: User | null = null;
  private accountId: string | null = null;
  private accountsSubscription?: Subscription;
  public account?: Partial<Account>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private storeService: StoreService,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
    this.authUser = this.authStoreService.getCurrentUser();
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

  get isProfileOwner(): boolean {
    return this.accountId === this.authStoreService.getCurrentUser()?.uid;
  }

  onItemSelected(form: string): void {
    this.selectedForm = form;
  }
}
