import {TestBed} from "@angular/core/testing";
import {FirestoreService} from "./firestore.service";
import {getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {environment} from "../../../environments/environment";

initializeApp(environment.firebaseConfig);

describe("FirestoreService", () => {
  let service: FirestoreService;
  let firestoreSpy: any;
  let docData = {foo: "bar"};

  const docStub = {
    get: jasmine
      .createSpy("get")
      .and.returnValue(Promise.resolve({exists: true, data: () => docData})),
    set: jasmine.createSpy("set").and.returnValue(Promise.resolve()),
    delete: jasmine.createSpy("delete").and.returnValue(Promise.resolve()),
  };

  const collectionStub = {
    doc: jasmine.createSpy("doc").and.returnValue(docStub),
  };

  firestoreSpy = jasmine.createSpyObj("Firestore", ["collection"]);
  firestoreSpy.collection.and.returnValue(collectionStub);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirestoreService,
        {provide: getFirestore, useValue: firestoreSpy},
      ],
    });

    service = TestBed.inject(FirestoreService);
    spyOn(service, "addDocument").and.callThrough();
    spyOn(service, "updateDocument").and.callThrough();
    spyOn(service, "deleteDocument").and.callThrough();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // it('should call getDocument and return document data', async () => {
  //   const result = await service.getDocument('someCollection', 'someId');
  //   expect(firestoreSpy.collection().doc).toHaveBeenCalled();
  //   expect(result?.['foo']).toBe('bar');
  // });

  // it('should call addDocument and return void', async () => {
  //   await service.addDocument('someCollection', { foo: 'bar' });
  //   expect(service.addDocument).toHaveBeenCalledWith('someCollection', { foo: 'bar' });
  //   expect(collectionStub.doc().set).toHaveBeenCalled();
  // });

  // it('should call updateDocument and return void', async () => {
  //   await service.updateDocument('someCollection', 'someId', { foo: 'bar' });
  //   expect(service.updateDocument).toHaveBeenCalledWith('someCollection', 'someId', { foo: 'bar' });
  //   expect(collectionStub.doc().set).toHaveBeenCalled();
  // });

  // it('should call deleteDocument and return void', async () => {
  //   await service.deleteDocument('someCollection', 'someId');
  //   expect(service.deleteDocument).toHaveBeenCalledWith('someCollection', 'someId');
  //   expect(collectionStub.doc().delete).toHaveBeenCalled();
  // });
});
