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
import {
  StandardRoleTemplate,
  StandardRoleCategory,
} from "../../../../../../shared/models/standard-role-template.model";

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

  it("should dispatch createGroupRole on onStandardRoleSelected", () => {
    const store = TestBed.inject(Store);
    spyOn(store, "dispatch");
    const afs = TestBed.inject(AngularFirestore);
    (afs.createId as jasmine.Spy).and.returnValue("generatedId");

    const template: StandardRoleTemplate = {
      id: "std_admin",
      category: "Organization" as StandardRoleCategory,
      name: "Administrator",
      description: "Test admin role",
      defaultPermissions: ["manage_members"],
      isSystemRole: true,
      icon: "shield-checkmark",
    };

    component.onStandardRoleSelected(template);

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.createGroupRole({
        groupId: component.groupId,
        role: {
          id: "generatedId",
          name: "Administrator",
          description: "Test admin role",
          roleType: "organization",
          permissions: ["manage_members"],
          standardRoleTemplateId: "std_admin",
          standardCategory: "Organization",
          isStandardRole: true,
          isCustomRole: false,
          icon: "shield-checkmark",
          sortOrder: 0,
        },
      }),
    );
  });

  it("should dispatch createGroupRole on onCustomRoleRequested", () => {
    const store = TestBed.inject(Store);
    spyOn(store, "dispatch");
    const afs = TestBed.inject(AngularFirestore);
    (afs.createId as jasmine.Spy).and.returnValue("generatedId");

    const customRole = {
      name: "Custom Manager",
      description: "Custom role description",
      category: "Organization" as StandardRoleCategory,
      parentRoleId: "parent-role-id",
    };

    component.onCustomRoleRequested(customRole);

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.createGroupRole({
        groupId: component.groupId,
        role: {
          id: "generatedId",
          name: "Custom Manager",
          description: "Custom role description",
          roleType: "organization",
          parentRoleId: "parent-role-id",
          standardCategory: "Organization",
          isStandardRole: false,
          isCustomRole: true,
          permissions: [],
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

  it("should dispatch deleteGroupRole on deleteRole", () => {
    const store = TestBed.inject(Store);
    spyOn(store, "dispatch");
    const role = {id: "test-role-id", name: "Test Role"};

    component.deleteRole(role as any);

    expect(store.dispatch).toHaveBeenCalledWith(
      AccountActions.deleteGroupRole({
        groupId: component.groupId,
        roleId: "test-role-id",
      }),
    );
  });

  it("should filter available parent roles by same category", () => {
    const roles = [
      {id: "1", name: "Admin", standardCategory: "Organization"},
      {id: "2", name: "Manager", standardCategory: "Organization"},
      {id: "3", name: "Volunteer", standardCategory: "Volunteer"},
      {id: "4", name: "Member", standardCategory: "Organization"},
    ];

    const currentRole = {
      id: "2",
      name: "Manager",
      standardCategory: "Organization",
    };

    const availableParents = component.getAvailableParentRoles(
      currentRole as any,
      roles as any,
    );

    expect(availableParents.length).toBe(2); // Admin and Member (same category, excluding self)
    expect(availableParents.map((r) => r.name)).toEqual(
      jasmine.arrayContaining(["Admin", "Member"]),
    );
    expect(availableParents.map((r) => r.name)).not.toContain("Manager"); // Exclude self
    expect(availableParents.map((r) => r.name)).not.toContain("Volunteer"); // Different category
  });

  it("should prevent circular references in parent selection", () => {
    const roles = [
      {
        id: "1",
        name: "Parent",
        standardCategory: "Organization",
        parentRoleId: undefined,
      },
      {
        id: "2",
        name: "Child",
        standardCategory: "Organization",
        parentRoleId: "1",
      },
      {
        id: "3",
        name: "Grandchild",
        standardCategory: "Organization",
        parentRoleId: "2",
      },
    ];

    // Try to make "Parent" a child of "Grandchild" (would create circular reference)
    const parentRole = {
      id: "1",
      name: "Parent",
      standardCategory: "Organization",
    };

    const availableParents = component.getAvailableParentRoles(
      parentRole as any,
      roles as any,
    );

    // Should not include Child or Grandchild as they would create circular reference
    expect(availableParents.map((r) => r.name)).not.toContain("Child");
    expect(availableParents.map((r) => r.name)).not.toContain("Grandchild");
  });
});
