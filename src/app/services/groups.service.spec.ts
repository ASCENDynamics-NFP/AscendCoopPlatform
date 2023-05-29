import {TestBed} from "@angular/core/testing";
import {GroupsService} from "./groups.service";
import {of} from "rxjs";
import {Timestamp} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {environment} from "../../environments/environment";

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
    await service.updateGroup(updatedGroup.id, updatedGroup);

    // Assert
    expect(GroupsServiceSpy.updateGroup).toHaveBeenCalledWith(
      updatedGroup.id,
      updatedGroup,
    );
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
