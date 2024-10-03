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
// partner-search.component.ts
import {Component, Input, OnInit} from "@angular/core";
import {Account, RelatedAccount} from "../../../../../../models/account.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../../state/reducers";
import * as AccountActions from "../../../../../../state/actions/account.actions";
import {selectGroupsByName} from "../../../../../../state/selectors/account.selectors";

@Component({
  selector: "app-partner-search",
  templateUrl: "./partner-search.component.html",
  styleUrls: ["./partner-search.component.scss"],
})
export class PartnerSearchComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @Input() currentGroup?: Account;
  groups: Account[] = [];
  relatedAccounts: RelatedAccount[] = [];
  private searchTerm: string = "";

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // Initially load all groups
    this.store.dispatch(AccountActions.loadAllGroups());

    // Subscribe to groups
    this.store.select(selectGroupsByName("")).subscribe((groups) => {
      this.groups = groups;
    });
  }

  get searchResults() {
    return this.groups.filter((group) =>
      group.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  searchGroups(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      // Dispatch action to search groups by name
      this.store.dispatch(
        AccountActions.searchGroupsByName({name: this.searchTerm}),
      );

      // Update the groups list
      this.store
        .select(selectGroupsByName(this.searchTerm))
        .subscribe((groups) => {
          this.groups = groups;
        });
    }
  }

  sendPartnerGroupRequest(group: Account) {
    if (!this.currentGroup?.id || !group.id) {
      console.log("No current group or group ID");
      return;
    }

    const relatedAccount: RelatedAccount = {
      id: group.id,
      name: group.name,
      iconImage: group.iconImage,
      tagline: group.tagline,
      type: "group",
      status: "pending",
      relationship: "partner",
      initiatorId: this.currentGroup.id,
      targetId: group.id,
    };

    // Dispatch action to add related account
    this.store.dispatch(
      AccountActions.addRelatedAccount({
        accountId: this.currentGroup.id,
        relatedAccount: relatedAccount,
      }),
    );
  }

  canInvite(group: Account): boolean {
    if (group.id === this.currentGroup?.id) {
      return false;
    }

    const isAlreadyPartner = this.relatedAccounts.some(
      (ra) => ra.id === group.id && ra.status !== "rejected",
    );

    return !isAlreadyPartner;
  }
}
