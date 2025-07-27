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
// role-management.page.spec.ts

import {ComponentFixture, TestBed} from "@angular/core/testing";
import {RoleManagementPage} from "./role-management.page";
import {provideMockStore} from "@ngrx/store/testing";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../state/actions/account.actions";
import {RouterTestingModule} from "@angular/router/testing";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";

describe("RoleManagementPage", () => {
  let component: RoleManagementPage;
  let fixture: ComponentFixture<RoleManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleManagementPage],
      imports: [RouterTestingModule],
      providers: [
        provideMockStore({}),
        {
          provide: AngularFirestore,
          useValue: {
            createId: jasmine
              .createSpy("createId")
              .and.returnValue("generatedId"),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleManagementPage);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch createGroupRole on addRole", () => {
    const store = TestBed.inject(Store);
    spyOn(store, "dispatch");
    const afs = TestBed.inject(AngularFirestore);
    (afs.createId as jasmine.Spy).and.returnValue("generatedId");
    component.newRole = {name: "Test"};
    component.addRole();
    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.createGroupRole({
        groupId: component.groupId,
        role: {
          id: "generatedId",
          name: "Test",
          description: undefined,
          parentRoleId: undefined,
          roleType: "organization",
        },
      }),
    );
  });

  it("should dispatch updateGroupRole on updateRole", () => {
    const store = TestBed.inject(Store);
    spyOn(store, "dispatch");
    const role = {id: "1", name: "Test"};
    component.updateRole(role as any);
    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: AccountActions.updateGroupRole.type,
      }),
    );
  });
});
