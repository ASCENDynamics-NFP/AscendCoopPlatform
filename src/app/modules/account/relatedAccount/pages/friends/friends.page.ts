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
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Account, RelatedAccount} from "../../../../../models/account.model";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../state/reducers";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {selectAccountById} from "../../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../../state/actions/account.actions";
import {AuthUser} from "../../../../../models/auth-user.model";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"],
})
export class FriendsPage implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  currentFriendsList: Partial<RelatedAccount>[] = [];
  pendingFriendsList: Partial<RelatedAccount>[] = [];
  accountId: string | null = null;
  currentUser: AuthUser | null = null;
  account?: Account;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.accountId = this.activatedRoute.snapshot.paramMap.get("accountId");
  }

  ngOnInit() {
    // Subscribe to the authenticated user
    this.subscriptions.add(
      this.store.select(selectAuthUser).subscribe((user) => {
        this.currentUser = user;
      }),
    );

    if (this.accountId) {
      // Dispatch action to load the account
      this.store.dispatch(
        AccountActions.loadAccount({accountId: this.accountId}),
      );

      // Subscribe to the account data
      this.subscriptions.add(
        this.store
          .select(selectAccountById(this.accountId))
          .subscribe((account) => {
            if (account) {
              this.account = account;
              this.sortRelatedAccounts(account.relatedAccounts || []);
            }
          }),
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sortRelatedAccounts(relatedAccounts: Partial<RelatedAccount>[]) {
    this.currentFriendsList = relatedAccounts.filter(
      (ra) => ra.type === "user" && ra.status === "accepted",
    );
    this.pendingFriendsList = relatedAccounts.filter(
      (ra) => ra.type === "user" && ra.status === "pending",
    );
  }

  updateStatus(request: Partial<RelatedAccount>, status: string) {
    if (!this.accountId || !request.id) return;

    const updatedRelatedAccount: RelatedAccount = {
      id: request.id,
      status: status as "pending" | "accepted" | "rejected" | "blocked",
    };

    // Dispatch action to update the related account
    this.store.dispatch(
      AccountActions.updateRelatedAccount({
        accountId: this.accountId,
        relatedAccount: updatedRelatedAccount,
      }),
    );
  }

  acceptRequest(request: Partial<RelatedAccount>) {
    this.updateStatus(request, "accepted");
  }

  rejectRequest(request: Partial<RelatedAccount>) {
    this.updateStatus(request, "rejected");
  }

  removeRequest(request: Partial<RelatedAccount>) {
    if (!this.accountId || !request.id) return;

    // Dispatch action to delete the related account
    this.store.dispatch(
      AccountActions.deleteRelatedAccount({
        accountId: this.accountId,
        relatedAccountId: request.id,
      }),
    );
  }

  showAcceptRejectButtons(request: Partial<RelatedAccount>) {
    return (
      this.isOwner() &&
      request.status === "pending" &&
      request.initiatorId !== this.currentUser?.uid
    );
  }

  showRemoveButton(request: Partial<RelatedAccount>) {
    return (
      this.isOwner() &&
      (request.status === "accepted" ||
        (request.status === "pending" &&
          request.initiatorId === this.currentUser?.uid))
    );
  }

  isOwner() {
    return this.currentUser?.uid === this.accountId;
  }
}
