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
// src/app/modules/account/pages/settings/settings.page.ts

import {Component, inject} from "@angular/core";
import {Observable} from "rxjs";
import {AuthUser} from "@shared/models/auth-user.model";
import {Account} from "@shared/models/account.model";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../state/selectors/account.selectors";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage {
  authUser$: Observable<AuthUser | null>;
  account$: Observable<Account | undefined>;
  private initialAccountId: string | null = null;

  // Optional route via inject to keep tests simple
  private route = inject(ActivatedRoute, {
    optional: true,
  }) as ActivatedRoute | null;

  constructor(
    private metaService: MetaService,
    private store: Store,
  ) {
    // Get the authUser observable
    this.authUser$ = this.store.select(selectAuthUser);

    const paramAccountId = this.route?.snapshot.paramMap.get("accountId");
    this.initialAccountId = paramAccountId ?? null;
    if (this.initialAccountId) {
      this.account$ = this.store.select(
        selectAccountById(this.initialAccountId),
      );
    } else {
      // Fallback to current user's account
      this.account$ = this.authUser$.pipe(
        switchMap((authUser) => {
          if (authUser?.uid) {
            return this.store.select(selectAccountById(authUser.uid));
          }
          return [undefined];
        }),
      );
    }
  }

  ionViewWillEnter() {
    const setMeta = (accountId?: string | null) => {
      const url = accountId
        ? `https://ascendynamics.org/account/${accountId}/settings`
        : `https://ascendynamics.org/account/settings`;
      this.metaService.updateMetaTags(
        "Settings | ASCENDynamics NFP",
        "Customize your settings and preferences on ASCENDynamics NFP.",
        "settings, preferences, account, customization",
        {
          title: "Settings | ASCENDynamics NFP",
          description:
            "Manage your preferences and account settings on ASCENDynamics NFP.",
          url,
          image:
            "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
        },
        {
          card: "summary",
          title: "Settings | ASCENDynamics NFP",
          description:
            "Update your account preferences and settings on ASCENDynamics NFP.",
          image:
            "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
        },
      );
    };

    if (this.initialAccountId) {
      setMeta(this.initialAccountId);
    } else {
      // Fallback to current user
      this.authUser$
        .pipe(switchMap((u) => [u?.uid || null]))
        .subscribe((uid) => {
          setMeta(uid);
        });
    }
  }
}
