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
import {Observable, combineLatest} from "rxjs";
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
    const related$ = this.store.select(
      selectRelatedAccountsByAccountId(this.accountId),
    );

    this.roleTree$ = combineLatest([roles$, related$]).pipe(
      map(([roles, related]) => this.buildRoleTree(roles, related)),
    );

    this.store.dispatch(
      AccountActions.loadGroupRoles({groupId: this.accountId}),
    );
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.accountId}),
    );
  }

  private buildRoleTree(
    roles: GroupRole[],
    relatedAccounts: RelatedAccount[],
  ): RoleNode[] {
    const accountsByRole: {[id: string]: RelatedAccount[]} = {};
    for (const account of relatedAccounts) {
      if (!account.roleId) continue;
      if (!accountsByRole[account.roleId]) {
        accountsByRole[account.roleId] = [];
      }
      accountsByRole[account.roleId].push(account);
    }

    const nodeMap: Map<string, RoleNode> = new Map();
    roles.forEach((role) =>
      nodeMap.set(role.id, {
        role,
        children: [],
        relatedAccounts: accountsByRole[role.id] || [],
      }),
    );

    const roots: RoleNode[] = [];
    nodeMap.forEach((node) => {
      if (node.role.parentRoleId && nodeMap.has(node.role.parentRoleId)) {
        nodeMap.get(node.role.parentRoleId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}
