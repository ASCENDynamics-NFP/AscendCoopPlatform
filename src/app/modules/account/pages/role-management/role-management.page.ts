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
// role-management.page.ts

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {GroupRole} from "@shared/models/group-role.model";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  selectGroupRolesByGroupId,
  selectAccountLoading,
} from "../../../../state/selectors/account.selectors";

@Component({
  selector: "app-role-management",
  templateUrl: "./role-management.page.html",
  styleUrls: ["./role-management.page.scss"],
})
export class RoleManagementPage implements OnInit {
  groupId!: string;
  roles$!: Observable<GroupRole[]>;
  loading$ = this.store.select(selectAccountLoading);

  newRole: Partial<GroupRole> = {name: "", parentRoleId: undefined};

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {
    this.groupId = this.route.snapshot.paramMap.get("accountId") || "";
  }

  ngOnInit() {
    this.roles$ = this.store.select(selectGroupRolesByGroupId(this.groupId));
    this.store.dispatch(AccountActions.loadGroupRoles({groupId: this.groupId}));
  }

  addRole() {
    if (!this.newRole.name) return;
    const role: GroupRole = {
      id: Date.now().toString(),
      name: this.newRole.name!,
      description: this.newRole.description,
      parentRoleId: this.newRole.parentRoleId,
    };
    this.store.dispatch(
      AccountActions.createGroupRole({groupId: this.groupId, role}),
    );
    this.newRole = {name: "", parentRoleId: undefined};
  }

  updateRole(role: GroupRole) {
    this.store.dispatch(
      AccountActions.updateGroupRole({groupId: this.groupId, role}),
    );
  }

  deleteRole(role: GroupRole) {
    this.store.dispatch(
      AccountActions.deleteGroupRole({
        groupId: this.groupId,
        roleId: role.id,
      }),
    );
  }
}
