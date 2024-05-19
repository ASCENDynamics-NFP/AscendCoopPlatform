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
    redirectTo: "signup",
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
    path: ":accountId/friends",
    loadComponent: () =>
      import("./modules/user/pages/friends/friends.page").then(
        (m) => m.FriendsPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "signup",
    loadComponent: () =>
      import("./modules/account/pages/signup/signup.page").then(
        (m) => m.SignupPage,
      ),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./modules/account/pages/login/login.page").then(
        (m) => m.LoginPage,
      ),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./modules/account/pages/settings/settings.page").then(
        (m) => m.SettingsPage,
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
    path: ":accountId/groups",
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
  {
    path: "registration/:accountId",
    loadComponent: () =>
      import("./modules/account/pages/registration/registration.page").then(
        (m) => m.RegistrationPage,
      ),
  },
  {
    path: ":accountId",
    loadComponent: () =>
      import("./modules/account/pages/details/details.page").then(
        (m) => m.DetailsPage,
      ),
  },
  {
    path: ":accountId/edit",
    loadComponent: () =>
      import("./modules/account/pages/edit/edit.page").then((m) => m.EditPage),
  },
];
