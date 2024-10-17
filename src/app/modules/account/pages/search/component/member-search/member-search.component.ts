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
// src/app/modules/account/pages/search/component/member-search/member-search.component.ts

import {Component, Input, OnInit} from "@angular/core";
import {Subject, Observable, combineLatest, of} from "rxjs";
import {
  debounceTime,
  startWith,
  switchMap,
  map,
  distinctUntilChanged,
  take,
} from "rxjs/operators";
import {AuthUser} from "../../../../../../models/auth-user.model";
import {Account, RelatedAccount} from "../../../../../../models/account.model";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {
  selectRelatedAccounts,
  selectFilteredAccounts,
} from "../../../../../../state/selectors/account.selectors";

@Component({
  selector: "app-member-search",
  templateUrl: "./member-search.component.html",
  styleUrls: ["./member-search.component.scss"],
})
export class MemberSearchComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @Input() user: AuthUser | null = null;
  @Input() currentGroup?: Account;
  private searchTerms = new Subject<string>();
  userList$!: Observable<Account[]>;
  searchTerm: string = "";

  constructor(private store: Store) {}

  ngOnInit() {
    // Use searchTerms to filter users
    this.userList$ = this.searchTerms.pipe(
      startWith(this.searchTerm),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.store.select(selectFilteredAccounts(term, "user")),
      ),
    );

    // Dispatch setSelectedAccount and loadRelatedAccounts actions
    if (this.currentGroup?.id) {
      this.store.dispatch(
        AccountActions.setSelectedAccount({accountId: this.currentGroup.id}),
      );

      this.store.dispatch(
        AccountActions.loadRelatedAccounts({accountId: this.currentGroup.id}),
      );
    }
  }

  searchUsers(event: any) {
    const value = event.target.value;
    this.searchTerms.next(value);
  }

  canInviteUser(user: Account): Observable<boolean> {
    return combineLatest([
      of(this.currentGroup),
      this.store.select(selectRelatedAccounts),
    ]).pipe(
      map(([currentGroup, relatedAccounts]) => {
        if (!currentGroup?.id || !user.id) {
          return false;
        }

        return !relatedAccounts.some(
          (ra) =>
            ra.id === user.id &&
            (ra.status === "accepted" || ra.status === "pending"),
        );
      }),
    );
  }

  inviteUser(user: Account) {
    this.canInviteUser(user)
      .pipe(take(1))
      .subscribe((canInvite) => {
        if (!canInvite) {
          console.log("Cannot invite user");
          return;
        }

        if (this.currentGroup?.id && user.id) {
          const newRelatedAccount: RelatedAccount = {
            id: user.id,
            name: user.name,
            iconImage: user.iconImage,
            tagline: user.tagline,
            type: "user",
            status: "pending",
            relationship: "member",
            initiatorId: this.currentGroup.id,
            targetId: user.id,
          };

          // Dispatch action to add related account
          this.store.dispatch(
            AccountActions.createRelatedAccount({
              accountId: this.currentGroup.id,
              relatedAccount: newRelatedAccount,
            }),
          );
        }
      });
  }
}
