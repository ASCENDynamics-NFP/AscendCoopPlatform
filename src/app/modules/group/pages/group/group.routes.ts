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
import {GroupPage} from "./group.page";

export const routes: Routes = [
  {
    path: "",
    component: GroupPage,
    children: [
      {
        path: ":groupId/details",
        loadComponent: () =>
          import("../group-profile/group-profile.page").then(
            (m) => m.GroupProfilePage,
          ),
      },
      {
        path: ":groupId/details/edit",
        loadComponent: () =>
          import("../group-edit/group-edit.page").then((m) => m.GroupEditPage),
      },
      {
        path: ":groupId/partners",
        loadComponent: () =>
          import("./component/partners/partners.component").then(
            (m) => m.PartnersComponent,
          ),
      },
      {
        path: ":groupId/members",
        loadComponent: () =>
          import("./component/members/members.component").then(
            (m) => m.MembersComponent,
          ),
      },
      {
        path: ":groupId/search",
        loadComponent: () =>
          import("../search/search.page").then((m) => m.SearchPage),
      },
      // {
      //   path: "",
      //   redirectTo: "group",
      //   pathMatch: "full",
      // },
    ],
  },
  // {
  //   path: "",
  //   redirectTo: "",
  //   pathMatch: "full",
  // },
];
