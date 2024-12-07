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
// import {TestBed} from "@angular/core/testing";
// import {FirestoreService} from "./firestore.service";
// import {
//   AngularFirestore,
//   AngularFirestoreCollection,
//   AngularFirestoreDocument,
// } from "@angular/fire/compat/firestore";
// import {of} from "rxjs";

// describe("FirestoreService", () => {
//   let service: FirestoreService;
//   let angularFirestoreMock: jasmine.SpyObj<AngularFirestore>;
//   let collectionSpy: jasmine.SpyObj<AngularFirestoreCollection<any>>;
//   let docSpy: jasmine.SpyObj<AngularFirestoreDocument<any>>;

//   beforeEach(() => {
//     // Create a spy for AngularFirestoreDocument
//     docSpy = jasmine.createSpyObj("AngularFirestoreDocument", {
//       ref: {
//         get: jasmine.createSpy("get").and.returnValue(
//           Promise.resolve({
//             exists: true,
//             id: "testDocId",
//             data: () => ({name: "Test Document"}),
//           }),
//         ),
//       },
//       set: jasmine.createSpy("set").and.returnValue(Promise.resolve()),
//       update: jasmine.createSpy("update").and.returnValue(Promise.resolve()),
//       delete: jasmine.createSpy("delete").and.returnValue(Promise.resolve()),
//       valueChanges: jasmine
//         .createSpy("valueChanges")
//         .and.returnValue(of({id: "testDocId", name: "Test Document"})),
//     });

//     // Create a spy for AngularFirestoreCollection
//     collectionSpy = jasmine.createSpyObj("AngularFirestoreCollection", {
//       doc: docSpy,
//       add: jasmine
//         .createSpy("add")
//         .and.returnValue(Promise.resolve({id: "newDocId"})),
//     });

//     // Create a spy for AngularFirestore
//     angularFirestoreMock = jasmine.createSpyObj("AngularFirestore", {
//       collection: collectionSpy,
//       doc: docSpy,
//     });

//     // Configure TestBed with the mocked AngularFirestore
//     TestBed.configureTestingModule({
//       providers: [
//         FirestoreService,
//         {provide: AngularFirestore, useValue: angularFirestoreMock},
//       ],
//     });

//     // Inject the service
//     service = TestBed.inject(FirestoreService);
//   });

//   // Test Case 1: Service Creation
//   it("should be created", () => {
//     expect(service).toBeTruthy();
//   });

// // Test Case 2: Fetching a Document
// it("should call AngularFirestore.collection and doc with correct arguments and return document data", async () => {
//   const collectionName = "testCollection";
//   const docId = "testDocId";

//   const doc = await service.getDocument(collectionName, docId);

//   expect(angularFirestoreMock.collection).toHaveBeenCalledWith(
//     collectionName,
//   );
//   expect(collectionSpy.doc).toHaveBeenCalledWith(docId);
//   expect(docSpy.ref.get).toHaveBeenCalled();
//   expect(doc).toEqual({id: "testDocId", name: "Test Document"});
// });

// // Test Case 3: Updating a Document Successfully
// it("should call updateDocument and update the document successfully", async () => {
//   const collectionName = "testCollection";
//   const docId = "testDocId";
//   const updateData = {name: "Updated Name"};

//   await service.updateDocument(collectionName, docId, updateData);

//   expect(angularFirestoreMock.collection).toHaveBeenCalledWith(
//     collectionName,
//   );
//   expect(collectionSpy.doc).toHaveBeenCalledWith(docId);
//   expect(docSpy.set).toHaveBeenCalledWith(updateData, {merge: true});
// });

// // Test Case 4: Updating a Document with Missing Parameters
// it("should throw an error when updating a document with missing parameters", async () => {
//   const collectionName = "testCollection";
//   const docId = ""; // Missing docId
//   const updateData = {name: "Updated Name"};

//   await expectAsync(
//     service.updateDocument(collectionName, docId, updateData),
//   ).toBeRejectedWithError(FirebaseError);

//   expect(angularFirestoreMock.collection).toHaveBeenCalledWith(
//     collectionName,
//   );
//   expect(collectionSpy.doc).toHaveBeenCalledWith(docId);
// });
// });
