import {TestBed} from "@angular/core/testing";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {of} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {ProjectService} from "./project.service";
import {Project} from "@shared/models/project.model";

describe("ProjectService", () => {
  let service: ProjectService;
  let afsSpy: jasmine.SpyObj<AngularFirestore>;
  let firestoreSpy: jasmine.SpyObj<FirestoreService>;

  beforeEach(() => {
    afsSpy = jasmine.createSpyObj("AngularFirestore", ["collection"]);
    firestoreSpy = jasmine.createSpyObj("FirestoreService", [
      "addDocument",
      "updateDocument",
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        {provide: AngularFirestore, useValue: afsSpy},
        {provide: FirestoreService, useValue: firestoreSpy},
      ],
    });

    service = TestBed.inject(ProjectService);
  });

  it("should retrieve projects", (done) => {
    const accountId = "acc";
    const actions = [
      {
        payload: {doc: {data: () => ({name: "Proj", accountId}), id: "1"}},
      },
    ];
    (afsSpy.collection as any).and.returnValue({
      snapshotChanges: () => of(actions as any),
    });

    service.getProjects(accountId).subscribe((projects) => {
      expect(projects.length).toBe(1);
      done();
    });
  });

  it("should create project", async () => {
    firestoreSpy.addDocument.and.returnValue(Promise.resolve("1"));
    const id = await service.createProject("a1", {
      name: "n",
      accountId: "a1",
    } as Project);
    expect(id).toBe("1");
  });
});
