import {TestBed} from "@angular/core/testing";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {of} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {ProjectService} from "./project.service";
import {Project} from "@shared/models/project.model";
import {getFirebaseTestProviders} from "../../testing/test-utilities";
import {FirebaseFunctionsService} from "./firebase-functions.service";

describe("ProjectService", () => {
  let service: ProjectService;
  let afsSpy: jasmine.SpyObj<AngularFirestore>;
  let firestoreSpy: jasmine.SpyObj<FirestoreService>;
  let firebaseFunctionsSpy: jasmine.SpyObj<FirebaseFunctionsService>;

  beforeEach(() => {
    afsSpy = jasmine.createSpyObj("AngularFirestore", ["collection"]);
    firestoreSpy = jasmine.createSpyObj("FirestoreService", [
      "addDocument",
      "updateDocument",
    ]);
    firebaseFunctionsSpy = jasmine.createSpyObj("FirebaseFunctionsService", [
      "createProject",
      "updateProject",
      "getAccountProjects",
    ]);
    // Setup return values for spies
    firebaseFunctionsSpy.createProject.and.returnValue(of({projectId: "1"}));
    firebaseFunctionsSpy.getAccountProjects.and.returnValue(
      of({
        projects: [{id: "1", name: "Proj", accountId: "acc", archived: false}],
      }),
    );

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        {provide: AngularFirestore, useValue: afsSpy},
        {provide: FirestoreService, useValue: firestoreSpy},
        {provide: FirebaseFunctionsService, useValue: firebaseFunctionsSpy},
        ...getFirebaseTestProviders(),
      ],
    });

    service = TestBed.inject(ProjectService);
  });

  it("should retrieve projects", (done) => {
    const accountId = "acc";

    service.getProjects(accountId).subscribe((projects) => {
      expect(projects.length).toBe(1);
      done();
    });
  });

  it("should create project", async () => {
    const id = await service.createProject("a1", {
      name: "n",
      accountId: "a1",
    } as Project);
    expect(id).toBe("1");
  });
});
