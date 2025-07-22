/*******************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/
// src/app/modules/account/pages/role-hierarchy/role-hierarchy.page.ts

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {GroupRole} from "@shared/models/group-role.model";
import {RelatedAccount} from "@shared/models/account.model";
import {
  selectGroupRolesByGroupId,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

interface RoleNode {
  role: GroupRole;
  children: RoleNode[];
  relatedAccounts: RelatedAccount[];
}

@Component({
  selector: "app-role-hierarchy",
  templateUrl: "./role-hierarchy.page.html",
  styleUrls: ["./role-hierarchy.page.scss"],
})
export class RoleHierarchyPage implements OnInit {
  accountId!: string;
  roleTree$!: Observable<RoleNode[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {
    this.accountId = this.route.snapshot.paramMap.get("accountId") || "";
  }

  ngOnInit() {
    const roles$ = this.store.select(selectGroupRolesByGroupId(this.accountId));
    const relatedAccounts$ = this.store.select(
      selectRelatedAccountsByAccountId(this.accountId),
    );

    this.store.dispatch(
      AccountActions.loadGroupRoles({groupId: this.accountId}),
    );
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.accountId}),
    );

    this.roleTree$ = combineLatest([roles$, relatedAccounts$]).pipe(
      map(([roles, accounts]) => this.buildTree(roles, accounts)),
    );
  }

  private buildTree(
    roles: GroupRole[],
    accounts: RelatedAccount[],
  ): RoleNode[] {
    const mapNodes = new Map<string, RoleNode>();
    roles.forEach((role) =>
      mapNodes.set(role.id, {role, children: [], relatedAccounts: []}),
    );
    roles.forEach((role) => {
      if (role.parentRoleId) {
        const parent = mapNodes.get(role.parentRoleId);
        parent?.children.push(mapNodes.get(role.id)!);
      }
    });
    accounts.forEach((acc) => {
      if (acc.roleId) {
        mapNodes.get(acc.roleId)?.relatedAccounts.push(acc);
      }
    });
    return roles
      .filter((r) => !r.parentRoleId)
      .map((r) => mapNodes.get(r.id)!) as RoleNode[];
  }
}
