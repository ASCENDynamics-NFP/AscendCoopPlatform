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
import {TestBed} from "@angular/core/testing";
import {GroupsService} from "./groups.service";
import {of} from "rxjs";
import {Timestamp} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {environment} from "../../../environments/environment";

initializeApp(environment.firebaseConfig);

describe("GroupsService", () => {
  let service: GroupsService;

  // Create a spy object for GroupsService
  const GroupsServiceSpy = jasmine.createSpyObj("GroupsService", [
    "getGroup",
    "createGroup",
    "updateGroup",
    "deleteGroup",
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: GroupsService, useValue: GroupsServiceSpy}],
    });
    service = TestBed.inject(GroupsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // it("should fetch a group by id", async () => {
  //   // Arrange
  //   const mockGroup = {id: "group1", name: "Test Group"};
  //   GroupsServiceSpy.getGroup.and.returnValue(of(mockGroup));

  //   // Act
  //   const group = await service.getGroup("group1");

  //   // Assert
  //   expect(group).toEqual(mockGroup);
  //   expect(GroupsServiceSpy.getGroup).toHaveBeenCalledWith("group1");
  // });

  // it("should add a new group", async () => {
  //   // get timestamp
  //   const timestamp = Timestamp.now();

  //   // Arrange
  //   const group = {
  //     name: "New Group",
  //     createdAt: timestamp,
  //     createdBy: null,
  //     description: "Unit test group.",
  //     groupPicture: null,
  //     id: null,
  //     lastModifiedAt: null,
  //     lastModifiedBy: null,
  //     lastModifiedByDisplayName: null,
  //   };
  //   GroupsServiceSpy.addGroup.and.returnValue(Promise.resolve());

  //   // Act
  //   await service.createGroup(group);

  //   // Assert
  //   expect(GroupsServiceSpy.createGroup).toHaveBeenCalledWith(group);
  // });

  it("should update a group", async () => {
    // Arrange
    const updatedGroup = {id: "group1", name: "Updated Group"};
    GroupsServiceSpy.updateGroup.and.returnValue(Promise.resolve());

    // Act
    await service.updateGroup(updatedGroup);

    // Assert
    expect(GroupsServiceSpy.updateGroup).toHaveBeenCalledWith(updatedGroup);
  });

  it("should delete a group", async () => {
    // Arrange
    const groupId = "group1";
    GroupsServiceSpy.deleteGroup.and.returnValue(Promise.resolve());

    // Act
    await service.deleteGroup(groupId);

    // Assert
    expect(GroupsServiceSpy.deleteGroup).toHaveBeenCalledWith(groupId);
  });
});
