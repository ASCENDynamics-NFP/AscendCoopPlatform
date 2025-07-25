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

describe("TimeTrackingService", () => {
  let service: TimeTrackingService;
  let afsSpy: jasmine.SpyObj<AngularFirestore>;
  let firestoreSpy: jasmine.SpyObj<FirestoreService>;

  beforeEach(() => {
    afsSpy = jasmine.createSpyObj("AngularFirestore", ["collection"]);
    firestoreSpy = jasmine.createSpyObj("FirestoreService", [
      "addDocument",
      "updateDocument",
      "deleteDocument",
    ]);

    TestBed.configureTestingModule({
      providers: [
        TimeTrackingService,
        {provide: AngularFirestore, useValue: afsSpy},
        {provide: FirestoreService, useValue: firestoreSpy},
      ],
    });

    service = TestBed.inject(TimeTrackingService);
  });

  it("should retrieve projects from Firestore", (done) => {
    const accountId = "account1";
    const mockProjects: Project[] = [
      {id: "1", name: "Proj", accountId, archived: false} as Project,
    ];
    const snapshotActions = [
      {
        payload: {
          doc: {
            data: () => ({name: "Proj", accountId, archived: false}),
            id: "1",
          },
        },
      },
    ];
    const whereSpy = jasmine.createSpy("where").and.returnValue({} as any);
    (afsSpy.collection as any).and.callFake((name: string, fn?: any) => {
      if (fn) {
        fn({where: whereSpy});
      }
      return {
        snapshotChanges: () => of(snapshotActions as any),
      } as any;
    });

    service.getProjects(accountId).subscribe((projects) => {
      expect(projects).toEqual(mockProjects);
      done();
    });
    expect(afsSpy.collection).toHaveBeenCalledWith(
      `accounts/${accountId}/projects` as any,
      jasmine.any(Function),
    );
    expect(whereSpy).toHaveBeenCalledWith("archived", "==", false);
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
    const whereSpy = jasmine.createSpy("where").and.returnValue({} as any);
    (afsSpy.collection as any).and.callFake((name: string, fn?: any) => {
      if (fn) {
        fn({where: whereSpy});
      }
      return {
        snapshotChanges: () =>
          of([{payload: {doc: {data: () => mockEntries[0], id: "e1"}}}] as any),
      } as any;
    });

    service.getUserEntries(accountId, userId).subscribe((entries) => {
      expect(entries).toEqual(mockEntries);
      done();
    });

    expect(afsSpy.collection).toHaveBeenCalledWith(
      `accounts/${accountId}/timeEntries` as any,
      jasmine.any(Function),
    );
    expect(whereSpy).toHaveBeenCalledWith("userId", "==", userId);
  });

  it("should add a time entry using FirestoreService", async () => {
    const entry = {id: "e1", accountId: "testAccountId"} as TimeEntry;
    firestoreSpy.addDocument.and.returnValue(Promise.resolve("e1"));

    const result = await service.addTimeEntry(entry);

    expect(firestoreSpy.addDocument).toHaveBeenCalledWith(
      `accounts/${entry.accountId}/timeEntries`,
      entry,
    );
    expect(result).toBe("e1");
  });

  it("should update a time entry using FirestoreService", async () => {
    const entry = {id: "e1", accountId: "testAccountId"} as TimeEntry;
    firestoreSpy.updateDocument.and.returnValue(Promise.resolve());

    await service.updateTimeEntry(entry);

    expect(firestoreSpy.updateDocument).toHaveBeenCalledWith(
      `accounts/${entry.accountId}/timeEntries`,
      entry.id,
      entry,
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
