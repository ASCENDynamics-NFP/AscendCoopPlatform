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
import {authGuard, registrationAuthGuard} from "../../core/guards";
import {
  adminGroupOwnerGuard,
  profileOwnerGuard,
  ownerOrAdminGuard,
} from "../../core/guards";
import {DetailsPage} from "./pages/details/details.page";
import {EditPage} from "./pages/edit/edit.page";
import {RegistrationPage} from "./pages/registration/registration.page";
import {SettingsPage} from "./pages/settings/settings.page";
import {ListPage} from "./relatedAccount/pages/list/list.page";
import {ListingsListPage} from "./relatedListings/pages/listings-list/listings-list.page";
import {ProjectsPage} from "./pages/projects/projects.page";
import {AdminDashboardPage} from "./pages/admin-dashboard/admin-dashboard.page";
import {DirectoryPage} from "./pages/directory/directory.page";

const routes: Routes = [
  {
    path: "settings",
    component: SettingsPage,
    canActivate: [authGuard],
  },
  // Legacy routes redirected to unified directory
  {path: "group-list", redirectTo: "directory", pathMatch: "full"},
  {path: "users", redirectTo: "directory", pathMatch: "full"},
  {
    path: "directory",
    component: DirectoryPage,
    canActivate: [authGuard],
  },
  {
    path: ":accountId/projects",
    component: ProjectsPage,
    canActivate: [authGuard, adminGroupOwnerGuard],
  },
  {
    path: ":accountId/settings",
    component: SettingsPage,
    canActivate: [authGuard, ownerOrAdminGuard],
  },
  {
    path: ":accountId/admin",
    component: AdminDashboardPage,
    canActivate: [authGuard, adminGroupOwnerGuard],
  },
  {
    path: "registration/:accountId",
    component: RegistrationPage,
    canActivate: [registrationAuthGuard],
  },
  {
    path: ":accountId",
    component: DetailsPage,
    canActivate: [authGuard],
  },
  {
    path: ":accountId/edit",
    component: EditPage,
    canActivate: [authGuard, profileOwnerGuard],
  },
  {
    path: ":accountId/listings",
    component: ListingsListPage,
    canActivate: [authGuard],
  },
  {
    path: ":accountId/related/:listType",
    component: ListPage,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
