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
import {Component, Input, OnInit} from "@angular/core";
import {StoreService} from "../../../../../../core/services/store.service";
import {Account, RelatedAccount} from "../../../../../../models/account.model";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-partner-search",
  templateUrl: "./partner-search.component.html",
  styleUrls: ["./partner-search.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class PartnerSearchComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @Input() currentGroup?: Partial<Account>;
  groups: Partial<Account>[] | null = [];
  relatedAccounts: Partial<RelatedAccount>[] = [];
  private searchTerm: string = "";

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    // Fetch groups
    this.groups = this.storeService
      .getCollection("accounts")
      .filter((g) => g["type"] === "group");
  }

  get searchResults() {
    return (
      this.groups?.filter((group) =>
        group.name?.toLowerCase().includes(this.searchTerm.toLowerCase()),
      ) ?? []
    );
  }

  searchGroups(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      this.storeService.searchDocsByName("accounts", this.searchTerm);
    }
  }

  sendPartnerGroupRequest(group: Partial<Account>) {
    if (!this.currentGroup?.id || !group.id) {
      console.log("No current group or group ID");
      return;
    }

    // Create a related account for the partner group
    const relatedAccount = {
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

    const docPath = `accounts/${this.currentGroup.id}/relatedAccounts/${group.id}`;
    this.storeService.updateDocAtPath(docPath, relatedAccount);
  }

  canInvite(group: Partial<Account>): boolean {
    if (group.id === this.currentGroup?.id) {
      // Cannot invite the same group
      return false;
    }

    // Check if the group is already a partner
    const isAlreadyPartner = this.relatedAccounts.some(
      (ra) => ra.id === group.id && ra.status !== "rejected", // You may adjust the condition as needed
    );

    return !isAlreadyPartner;
  }
}
