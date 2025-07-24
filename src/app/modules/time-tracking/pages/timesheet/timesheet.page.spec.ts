import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {TimesheetPage} from "./timesheet.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {ActivatedRoute} from "@angular/router";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {
  selectEntries,
  selectProjects,
} from "../../../../state/selectors/time-tracking.selectors";

describe("TimesheetPage", () => {
  let component: TimesheetPage;
  let fixture: ComponentFixture<TimesheetPage>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimesheetPage],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: {get: () => "acc1"}}},
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAuthUser, {uid: "test"} as any);
    store.overrideSelector(selectProjects, []);
    store.overrideSelector(selectEntries, []);

    fixture = TestBed.createComponent(TimesheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set userId from auth selector", () => {
    expect(component.userId).toBe("test");
  });

  it("should read accountId from route params", () => {
    expect(component.accountId).toBe("acc1");
  });

  it("should expose entries observable", (done) => {
    component.entries$.subscribe((e) => {
      expect(e).toEqual([]);
      done();
    });
  });

  it("should advance to the next week", () => {
    const start = new Date(component.currentWeekStart);
    component.nextWeek();
    expect(+component.currentWeekStart).toBe(
      +start + 7 * 24 * 60 * 60 * 1000,
    );
  });

  it("should go back to the previous week", () => {
    const start = new Date(component.currentWeekStart);
    component.previousWeek();
    expect(+component.currentWeekStart).toBe(
      +start - 7 * 24 * 60 * 60 * 1000,
    );
  });
});
