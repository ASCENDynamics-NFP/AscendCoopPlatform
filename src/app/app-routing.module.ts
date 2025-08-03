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

export const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: "", // Used to remove "/auth" from landing page.
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "account", // Used to organize routes in "/account" folder.
    loadChildren: () =>
      import("./modules/account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "auth", // Used to organize routes in "/auth" folder.
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "listings", // Used to organize routes in "/listings" folder.
    loadChildren: () =>
      import("./modules/listing/listing.module").then((m) => m.ListingModule),
  },
  {
    path: "messaging", // Used to organize routes in "/messaging" folder.
    loadChildren: () =>
      import("./modules/messaging/messaging.module").then(
        (m) => m.MessagingModule,
      ),
  },
  {
    path: "account/:accountId/time-tracking",
    loadChildren: () =>
      import("./modules/time-tracking/time-tracking.module").then(
        (m) => m.TimeTrackingModule,
      ),
  },
  {
    path: "info", // Used to organize routes in "/info" folder.
    loadChildren: () =>
      import("./modules/info/info.module").then((m) => m.InfoModule),
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
