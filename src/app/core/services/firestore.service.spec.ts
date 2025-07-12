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
import {FirestoreService} from "./firestore.service";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {of, firstValueFrom} from "rxjs";

describe("FirestoreService", () => {
  let service: FirestoreService;
  let angularFirestoreMock: jasmine.SpyObj<AngularFirestore>;
  let collectionSpy: jasmine.SpyObj<AngularFirestoreCollection<any>>;
  let docSpy: jasmine.SpyObj<AngularFirestoreDocument<any>>;
  let storageSpy: jasmine.SpyObj<AngularFireStorage>;

  beforeEach(() => {
    docSpy = jasmine.createSpyObj("AngularFirestoreDocument", {
      ref: {
        get: jasmine.createSpy("get").and.returnValue(
          Promise.resolve({
            exists: true,
            id: "testDocId",
            data: () => ({name: "Test Document"}),
          }),
        ),
      },
      set: jasmine.createSpy("set").and.returnValue(Promise.resolve()),
      update: jasmine.createSpy("update").and.returnValue(Promise.resolve()),
      delete: jasmine.createSpy("delete").and.returnValue(Promise.resolve()),
      valueChanges: jasmine
        .createSpy("valueChanges")
        .and.returnValue(of({id: "testDocId", name: "Test Document"})),
    });

    collectionSpy = jasmine.createSpyObj("AngularFirestoreCollection", {
      doc: docSpy,
      add: jasmine
        .createSpy("add")
        .and.returnValue(Promise.resolve({id: "newDocId"})),
    });

    angularFirestoreMock = jasmine.createSpyObj("AngularFirestore", {
      collection: collectionSpy,
      doc: docSpy,
    });

    storageSpy = jasmine.createSpyObj("AngularFireStorage", {
      upload: jasmine.createSpy("upload").and.returnValue(Promise.resolve()),
      ref: jasmine.createSpy("ref").and.returnValue({
        getDownloadURL: jasmine
          .createSpy("getDownloadURL")
          .and.returnValue(of("http://example.com/file")),
      }),
    });

    TestBed.configureTestingModule({
      providers: [
        FirestoreService,
        {provide: AngularFirestore, useValue: angularFirestoreMock},
        {provide: AngularFireStorage, useValue: storageSpy},
      ],
    });

    service = TestBed.inject(FirestoreService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call AngularFirestore.collection and doc with correct arguments and return document data", async () => {
    const collectionName = "testCollection";
    const docId = "testDocId";

    const doc = await firstValueFrom(service.getDocument(collectionName, docId));

    expect(angularFirestoreMock.collection).toHaveBeenCalledWith(collectionName as any);
    expect(collectionSpy.doc).toHaveBeenCalledWith(docId);
    expect(doc).toEqual({id: "testDocId", name: "Test Document"});
  });

  it("should call updateDocument and update the document successfully", async () => {
    const collectionName = "testCollection";
    const docId = "testDocId";
    const updateData = {name: "Updated Name"};

    await service.updateDocument(collectionName, docId, updateData);

    expect(angularFirestoreMock.collection).toHaveBeenCalledWith(collectionName as any);
    expect(collectionSpy.doc).toHaveBeenCalledWith(docId);
    expect(docSpy.update).toHaveBeenCalledWith(updateData);
  });

  it("should throw an error when updating a document with missing parameters", async () => {
    const collectionName = "testCollection";
    const docId = "";
    const updateData = {name: "Updated Name"};

    await expectAsync(
      service.updateDocument(collectionName, docId, updateData),
    ).toBeRejected();

    expect(angularFirestoreMock.collection).toHaveBeenCalledWith(collectionName as any);
    expect(collectionSpy.doc).toHaveBeenCalledWith(docId);
  });
});
