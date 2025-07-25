import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {ProjectsPage} from "./projects.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {ActivatedRoute} from "@angular/router";
import {SuccessHandlerService} from "../../../../core/services/success-handler.service";
import {ErrorHandlerService} from "../../../../core/services/error-handler.service";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectRelatedAccountsByAccountId} from "../../../../state/selectors/account.selectors";
import {
  selectProjectsByAccount,
  selectActiveProjectsByAccount,
} from "../../../../state/selectors/projects.selectors";
import * as ProjectsActions from "../../../../state/actions/projects.actions";
import {of} from "rxjs";

describe("ProjectsPage", () => {
  let component: ProjectsPage;
  let fixture: ComponentFixture<ProjectsPage>;
  let store: MockStore;
  let errorHandler: {handleFirebaseAuthError: jasmine.Spy};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore(),
        {
          provide: SuccessHandlerService,
          useValue: {handleSuccess: jasmine.createSpy("handleSuccess")},
        },
        {
          provide: ErrorHandlerService,
          useValue: {handleFirebaseAuthError: jasmine.createSpy("handleError")},
        },
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: {get: () => "acc1"}}},
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAuthUser, {uid: "u1"} as any);
    store.overrideSelector(selectRelatedAccountsByAccountId("acc1"), []);
    store.overrideSelector(selectProjectsByAccount("acc1"), []);
    store.overrideSelector(selectActiveProjectsByAccount("acc1"), []);

    spyOn(store, "dispatch").and.callThrough();

    errorHandler = TestBed.inject(ErrorHandlerService) as any;

    fixture = TestBed.createComponent(ProjectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load projects for account", () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      ProjectsActions.loadProjects({accountId: "acc1"}),
    );
  });

  it("should show error when adding a project with duplicate name", () => {
    store.overrideSelector(selectActiveProjectsByAccount("acc1"), [
      {id: "p1", name: "Alpha"} as any,
    ]);
    fixture = TestBed.createComponent(ProjectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.newProjectName = " alpha ";
    component.addProject();

    expect(errorHandler.handleFirebaseAuthError).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      jasmine.objectContaining({type: ProjectsActions.createProject.type}),
    );
  });

  it("should show error when updating to a duplicate name", () => {
    store.overrideSelector(selectActiveProjectsByAccount("acc1"), [
      {id: "p1", name: "Alpha"} as any,
      {id: "p2", name: "Beta"} as any,
    ]);
    fixture = TestBed.createComponent(ProjectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const project = {id: "p2", name: "Beta"} as any;
    component.updateProject(project, " alpha ");

    expect(errorHandler.handleFirebaseAuthError).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      jasmine.objectContaining({type: ProjectsActions.updateProject.type}),
    );
  });
});
