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
// src/app/core/services/time-tracking.service.spec.ts

import {TestBed} from "@angular/core/testing";
import {of} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {TimeTrackingService} from "./time-tracking.service";
import {FirestoreService} from "./firestore.service";
import {Project} from "@shared/models/project.model";
import {TimeEntry} from "@shared/models/time-entry.model";
import {getFirebaseTestProviders} from "../../testing/test-utilities";
import {FirebaseFunctionsService} from "./firebase-functions.service";
import {ProjectService} from "./project.service";

describe("TimeTrackingService", () => {
  let service: TimeTrackingService;
  let afsSpy: jasmine.SpyObj<AngularFirestore>;
  let firestoreSpy: jasmine.SpyObj<FirestoreService>;
  let firebaseFunctionsSpy: jasmine.SpyObj<FirebaseFunctionsService>;
  let projectServiceSpy: jasmine.SpyObj<ProjectService>;

  beforeEach(() => {
    afsSpy = jasmine.createSpyObj("AngularFirestore", ["collection"]);
    firestoreSpy = jasmine.createSpyObj("FirestoreService", [
      "addDocument",
      "updateDocument",
      "deleteDocument",
    ]);
    firebaseFunctionsSpy = jasmine.createSpyObj("FirebaseFunctionsService", [
      "createTimeEntry",
      "updateTimeEntry",
      "getAccountTimeEntries",
      "getTimeTrackingStats",
      "deleteTimeEntry",
    ]);
    projectServiceSpy = jasmine.createSpyObj("ProjectService", [
      "getProjects",
      "getAccountProjects",
    ]);
    // Setup return values for spies
    firebaseFunctionsSpy.getAccountTimeEntries.and.returnValue(
      of({
        timeEntries: [
          {id: "e1", projectId: "p1", userId: "user123", date: "d", hours: 1},
        ],
      }),
    );
    projectServiceSpy.getAccountProjects.and.returnValue(
      of([{id: "1", name: "Proj", accountId: "account1", archived: false}]),
    );

    TestBed.configureTestingModule({
      providers: [
        TimeTrackingService,
        {provide: AngularFirestore, useValue: afsSpy},
        {provide: FirestoreService, useValue: firestoreSpy},
        {provide: FirebaseFunctionsService, useValue: firebaseFunctionsSpy},
        {provide: ProjectService, useValue: projectServiceSpy},
        ...getFirebaseTestProviders(),
      ],
    });

    service = TestBed.inject(TimeTrackingService);
  });

  it("should retrieve projects from Firestore", (done) => {
    const accountId = "account1";
    const mockProjects: any[] = [
      {id: "1", name: "Proj", accountId, archived: false},
    ];

    service.getProjects(accountId).subscribe((projects) => {
      expect(projects).toEqual(mockProjects);
      done();
    });
  });

  it("should retrieve user time entries", (done) => {
    const userId = "user123";
    const accountId = "accountId";
    const mockEntries: TimeEntry[] = [
      {
        id: "e1",
        projectId: "p1",
        userId,
        date: "d" as any,
        hours: 1,
      } as TimeEntry,
    ];

    service.getUserEntries(accountId, userId).subscribe((entries) => {
      expect(entries).toEqual(mockEntries);
      done();
    });
  });

  it("should add a time entry using FirestoreService", async () => {
    const entry = {id: "e1", accountId: "testAccountId"} as TimeEntry;
    const expectedSanitizedEntry = {
      id: "e1",
      accountId: "testAccountId",
      status: "pending",
      notes: "",
      userName: "",
      projectName: "",
    } as TimeEntry;
    firestoreSpy.addDocument.and.returnValue(Promise.resolve("e1"));

    const result = await service.addTimeEntry(entry);

    expect(firestoreSpy.addDocument).toHaveBeenCalledWith(
      `accounts/${entry.accountId}/timeEntries`,
      expectedSanitizedEntry,
    );
    expect(result).toBe("e1");
  });

  it("should update a time entry using FirestoreService", async () => {
    const entry = {id: "e1", accountId: "testAccountId"} as TimeEntry;
    const expectedSanitizedEntry = {
      id: "e1",
      accountId: "testAccountId",
      status: "pending",
      notes: "",
      userName: "",
      projectName: "",
    } as TimeEntry;
    firestoreSpy.updateDocument.and.returnValue(Promise.resolve());

    await service.updateTimeEntry(entry);

    expect(firestoreSpy.updateDocument).toHaveBeenCalledWith(
      `accounts/${entry.accountId}/timeEntries`,
      entry.id,
      expectedSanitizedEntry,
    );
  });

  it("should delete a time entry using FirestoreService", async () => {
    const entry = {id: "e1", accountId: "acct"} as TimeEntry;
    firestoreSpy.deleteDocument.and.returnValue(Promise.resolve());

    await service.deleteTimeEntry(entry);

    expect(firestoreSpy.deleteDocument).toHaveBeenCalledWith(
      `accounts/${entry.accountId}/timeEntries`,
      entry.id,
    );
  });
});
