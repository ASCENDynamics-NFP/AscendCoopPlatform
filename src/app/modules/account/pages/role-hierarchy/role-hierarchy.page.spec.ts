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
// src/app/modules/account/pages/role-hierarchy/role-hierarchy.page.spec.ts

import {ComponentFixture, TestBed} from "@angular/core/testing";
import {RoleHierarchyPage} from "./role-hierarchy.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../state/actions/account.actions";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";

describe("RoleHierarchyPage", () => {
  let component: RoleHierarchyPage;
  let fixture: ComponentFixture<RoleHierarchyPage>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleHierarchyPage],
      imports: [RouterTestingModule],
      providers: [provideMockStore({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RoleHierarchyPage);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch load actions on ngOnInit", () => {
    spyOn(store, "dispatch");
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadGroupRoles({groupId: component.accountId}),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.loadRelatedAccounts({accountId: component.accountId}),
    );
  });
});
