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
import {Component, OnInit, OnDestroy} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {RelatedAccountsComponent} from "./components/related-accounts/related-accounts.component";
import {Account} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import {Observable, Subscription} from "rxjs";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {AppHeaderComponent} from "../../../../shared/components/app-header/app-header.component";
import {ProfessionalInfoComponent} from "./components/professional-info/professional-info.component";
import {VolunteerPreferenceInfoComponent} from "./components/volunteer-preference-info/volunteer-preference-info.component";
import {User} from "firebase/auth";
import {HeroComponent} from "./components/hero/hero.component";
import {loadAccount} from "../../../../core/state/actions/account.actions";
import {selectAccount} from "../../../../core/state/selectors/account.selectors";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeroComponent,
    AppHeaderComponent,
    RelatedAccountsComponent,
    ProfessionalInfoComponent,
    VolunteerPreferenceInfoComponent,
  ],
})
export class DetailsPage implements OnInit, OnDestroy {
  public accountId: string | null;
  authUser: User | null = null;
  account$: Observable<Account | null>;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authStoreService: AuthStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {
    this.accountId = this.route.snapshot.paramMap.get("accountId");
    this.authUser = this.authStoreService.getCurrentUser();
    this.account$ = this.store.select(selectAccount);
  }

  get isProfileOwner(): boolean {
    return this.accountId === this.authStoreService.getCurrentUser()?.uid;
  }

  ngOnInit() {
    if (this.accountId) {
      this.store.dispatch(loadAccount({accountId: this.accountId}));
    }

    this.subscriptions.add(
      this.account$.subscribe((account) => {
        if (account) {
          if (!account.type) {
            this.router.navigate([`/registration/${this.accountId}`]); // Navigate to registration
          }
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
