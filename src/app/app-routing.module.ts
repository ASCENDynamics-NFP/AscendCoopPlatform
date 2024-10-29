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
// src/app/app-routing.module.ts

import {NgModule} from "@angular/core";
import {RouterModule, Routes, ExtraOptions} from "@angular/router";
import {AuthGuard} from "./core/guards/auth.guard";
import {SecureInnerPagesGuard} from "./core/guards/secure-inner-pages.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: "",
    loadChildren: () =>
      import("./modules/account/pages/landing/landing.module").then(
        (m) => m.LandingPageModule,
      ),
  },
  {
    path: "group-list",
    loadChildren: () =>
      import("./modules/account/pages/group-list/group-list.module").then(
        (m) => m.GroupListPageModule,
      ),
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./modules/account/pages/signup/signup.module").then(
        (m) => m.SignupPageModule,
      ),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "login",
    loadChildren: () =>
      import("./modules/account/pages/login/login.module").then(
        (m) => m.LoginPageModule,
      ),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./modules/account/pages/settings/settings.module").then(
        (m) => m.SettingsPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    loadChildren: () =>
      import("./modules/account/pages/users/users.module").then(
        (m) => m.UsersPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "registration/:accountId",
    loadChildren: () =>
      import("./modules/account/pages/registration/registration.module").then(
        (m) => m.RegistrationPageModule,
      ),
  },
  {
    path: "listings",
    loadChildren: () =>
      import("./modules/listing/listing.module").then((m) => m.ListingModule),
  },
  {
    path: ":accountId",
    loadChildren: () =>
      import("./modules/account/pages/details/details.module").then(
        (m) => m.DetailsPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: ":accountId/edit",
    loadChildren: () =>
      import("./modules/account/pages/edit/edit.module").then(
        (m) => m.EditPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: ":accountId/related/:listType",
    loadChildren: () =>
      import("./modules/account/relatedAccount/pages/list/list.module").then(
        (m) => m.ListPageModule,
      ),
    canActivate: [AuthGuard],
  },
];

// Router options
const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled", // Enable fragment scrolling
  scrollPositionRestoration: "enabled", // Restore scroll position on navigation
  onSameUrlNavigation: "reload", // Allow navigation to the same URL
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
