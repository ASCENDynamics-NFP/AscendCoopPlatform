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
import {Routes} from "@angular/router";
import {AuthGuard} from "./core/guards/auth.guard";
import {SecureInnerPagesGuard} from "./core/guards/secure-inner-pages.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "user-signup",
    pathMatch: "full",
  },
  {
    path: "group-profile/:accountId/edit",
    loadComponent: () =>
      import("./modules/group/pages/group-edit/group-edit.page").then(
        (m) => m.GroupEditPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "group-list",
    loadComponent: () =>
      import("./modules/group/pages/group-list/group-list.page").then(
        (m) => m.GroupListPage,
      ),
  },
  {
    path: "group-profile/:accountId",
    loadComponent: () =>
      import("./modules/group/pages/group-profile/group-profile.page").then(
        (m) => m.GroupProfilePage,
      ),
  },
  {
    path: "user-dashboard/:accountId",
    loadComponent: () =>
      import("./modules/user/pages/user-dashboard/user-dashboard.page").then(
        (m) => m.UserDashboardPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "user-profile/:accountId",
    loadComponent: () =>
      import("./modules/user/pages/user-profile/user-profile.page").then(
        (m) => m.UserProfilePage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "user-profile/:accountId/friends",
    loadComponent: () =>
      import("./modules/user/pages/friends/friends.page").then(
        (m) => m.FriendsPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "user-signup",
    loadComponent: () =>
      import("./modules/user/pages/user-signup/user-signup.page").then(
        (m) => m.UserSignupPage,
      ),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "user-login",
    loadComponent: () =>
      import("./modules/user/pages/user-login/user-login.page").then(
        (m) => m.UserLoginPage,
      ),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "user-settings",
    loadComponent: () =>
      import("./modules/user/pages/user-settings/user-settings.page").then(
        (m) => m.UserSettingsPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "friends",
    loadComponent: () =>
      import("./modules/user/pages/friends/friends.page").then(
        (m) => m.FriendsPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    loadComponent: () =>
      import("./modules/user/pages/users/users.page").then((m) => m.UsersPage),
    canActivate: [AuthGuard],
  },
  {
    path: "user-profile/:accountId/edit",
    loadComponent: () =>
      import(
        "./modules/user/pages/edit-user-profile/edit-user-profile.page"
      ).then((m) => m.EditUserProfilePage),
    canActivate: [AuthGuard],
  },
  {
    path: "user-profile/:accountId/groups",
    loadComponent: () =>
      import("./modules/user/pages/user-groups/user-groups.page").then(
        (m) => m.UserGroupsPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "group/:accountId",
    loadChildren: () =>
      import("./modules/group/pages/group/group.routes").then((m) => m.routes),
    canActivate: [AuthGuard],
  },
];
