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
import {ListingsPage} from "./pages/listings/listings.page";
import {ListingDetailPage} from "./pages/listing-detail/listing-detail.page";
import {ListingEditPage} from "./pages/listing-edit/listing-edit.page";
import {ListingCreatePage} from "./pages/listing-create/listing-create.page";
import {ApplicantsPage} from "./relatedAccount/pages/applicants/applicants.page";
import {ApplyPage} from "./relatedAccount/pages/apply/apply.page";
import {AuthGuard} from "../../core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ListingsPage,
    canActivate: [AuthGuard],
  },
  {
    path: "create",
    component: ListingCreatePage,
    canActivate: [AuthGuard],
  },
  {
    path: ":id",
    component: ListingDetailPage,
    canActivate: [AuthGuard],
  },
  {
    path: ":id/applicants",
    component: ApplicantsPage,
    canActivate: [AuthGuard],
  },
  {
    path: ":id/apply",
    component: ApplyPage,
    canActivate: [AuthGuard],
  },
  {
    path: ":id/edit",
    component: ListingEditPage,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingRoutingModule {}
