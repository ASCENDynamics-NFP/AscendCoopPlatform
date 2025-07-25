import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {ProjectsPage} from "./projects.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../../../core/services/project.service";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectRelatedAccountsByAccountId} from "../../../../state/selectors/account.selectors";
import {of} from "rxjs";

describe("ProjectsPage", () => {
  let component: ProjectsPage;
  let fixture: ComponentFixture<ProjectsPage>;
  let store: MockStore;
  let serviceSpy: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj("ProjectService", [
      "getProjects",
      "createProject",
      "updateProject",
      "setArchived",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ProjectsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore(),
        {provide: ProjectService, useValue: serviceSpy},
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: {get: () => "acc1"}}},
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAuthUser, {uid: "u1"} as any);
    store.overrideSelector(selectRelatedAccountsByAccountId("acc1"), []);
    serviceSpy.getProjects.and.returnValue(of([]));

    fixture = TestBed.createComponent(ProjectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load projects for account", () => {
    expect(serviceSpy.getProjects).toHaveBeenCalledWith("acc1");
  });
});
