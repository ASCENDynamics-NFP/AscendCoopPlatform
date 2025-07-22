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
// role-hierarchy.page.ts

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable, combineLatest} from "rxjs";
import {map} from "rxjs/operators";
import {GroupRole} from "@shared/models/group-role.model";
import {RelatedAccount} from "@shared/models/account.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectGroupRolesByGroupId,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";

interface RoleNode {
  role: GroupRole;
  children: RoleNode[];
  accounts: RelatedAccount[];
}

@Component({
  selector: "app-role-hierarchy",
  templateUrl: "./role-hierarchy.page.html",
  styleUrls: ["./role-hierarchy.page.scss"],
})
export class RoleHierarchyPage implements OnInit {
  groupId!: string;
  roleTree$!: Observable<RoleNode[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {
    this.groupId = this.route.snapshot.paramMap.get("accountId") || "";
  }

  ngOnInit() {
    const roles$ = this.store.select(selectGroupRolesByGroupId(this.groupId));
    const accounts$ = this.store.select(
      selectRelatedAccountsByAccountId(this.groupId),
    );

    this.store.dispatch(AccountActions.loadGroupRoles({groupId: this.groupId}));
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.groupId}),
    );

    this.roleTree$ = combineLatest([roles$, accounts$]).pipe(
      map(([roles, accounts]) => this.buildTree(roles, accounts)),
    );
  }

  private buildTree(
    roles: GroupRole[],
    accounts: RelatedAccount[],
  ): RoleNode[] {
    const map = new Map<string, RoleNode>();
    roles.forEach((role) => {
      map.set(role.id, {
        role,
        children: [],
        accounts: accounts.filter((acc) => acc.roleId === role.id),
      });
    });
    const roots: RoleNode[] = [];
    map.forEach((node) => {
      if (node.role.parentRoleId && map.has(node.role.parentRoleId)) {
        map.get(node.role.parentRoleId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }
}
