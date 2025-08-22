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
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../core/guards/auth.guard";
import {RegistrationAuthGuard} from "../../core/guards/registration-auth.guard";
import {AdminGroupOwnerGuard} from "../../core/guards/admin-group-owner.guard";
import {ProfileOwnerGuard} from "../../core/guards/profile-owner.guard";
import {DetailsPage} from "./pages/details/details.page";
import {EditPage} from "./pages/edit/edit.page";
import {RegistrationPage} from "./pages/registration/registration.page";
import {GroupListPage} from "./pages/group-list/group-list.page";
import {SettingsPage} from "./pages/settings/settings.page";
import {UsersPage} from "./pages/users/users.page";
import {ListPage} from "./relatedAccount/pages/list/list.page";
import {ListingsListPage} from "./relatedListings/pages/listings-list/listings-list.page";
import {RoleManagementPage} from "./pages/role-management/role-management.page";
import {RoleHierarchyPage} from "./pages/role-hierarchy/role-hierarchy.page";
import {ProjectsPage} from "./pages/projects/projects.page";
import {AdminDashboardPage} from "./pages/admin-dashboard/admin-dashboard.page";

const routes: Routes = [
  {
    path: "group-list",
    component: GroupListPage,
  },
  {
    path: "settings",
    component: SettingsPage,
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    component: UsersPage,
    canActivate: [AuthGuard],
  },
  {
    path: ":accountId/projects",
    component: ProjectsPage,
    canActivate: [AuthGuard, AdminGroupOwnerGuard],
  },
  {
    path: ":accountId/admin",
    component: AdminDashboardPage,
    canActivate: [AuthGuard, AdminGroupOwnerGuard],
  },
  {
    path: "registration/:accountId",
    component: RegistrationPage,
    canActivate: [RegistrationAuthGuard],
  },
  {
    path: ":accountId",
    component: DetailsPage,
    canActivate: [AuthGuard],
  },
  {
    path: ":accountId/edit",
    component: EditPage,
    canActivate: [AuthGuard, ProfileOwnerGuard],
  },
  {
    path: ":accountId/listings",
    component: ListingsListPage,
    canActivate: [AuthGuard],
  },
  {
    path: ":accountId/related/:listType",
    component: ListPage,
    canActivate: [AuthGuard],
  },
  {
    path: ":accountId/roles",
    component: RoleManagementPage,
    canActivate: [AuthGuard],
  },
  {
    path: ":accountId/hierarchy",
    component: RoleHierarchyPage,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
