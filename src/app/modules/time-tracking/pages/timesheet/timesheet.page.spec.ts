import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {TimesheetPage} from "./timesheet.page";
import {WeekViewComponent} from "../../components/week-view/week-view.component";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {ActivatedRoute} from "@angular/router";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectEntries} from "../../../../state/selectors/time-tracking.selectors";
import {selectActiveProjectsByAccount} from "../../../../state/selectors/projects.selectors";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

describe("TimesheetPage", () => {
  let component: TimesheetPage;
  let fixture: ComponentFixture<TimesheetPage>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimesheetPage, WeekViewComponent],
      imports: [IonicModule.forRoot(), FormsModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            accounts: {
              ids: [],
              entities: {},
              loading: false,
              error: null,
            },
            auth: {
              user: null,
              loading: false,
              error: null,
            },
            listings: {
              ids: [],
              entities: {},
              loading: false,
              error: null,
            },
            projects: {
              ids: [],
              entities: {},
              loading: false,
              error: null,
            },
            timeTracking: {
              ids: [],
              entities: {},
              loading: false,
              error: null,
            },
          },
        }),
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {paramMap: {get: () => "acc1"}}},
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAuthUser, {uid: "test"} as any);
    store.overrideSelector(selectActiveProjectsByAccount("acc1"), []);
    const weekStart = (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d;
    })();
    store.overrideSelector(selectEntries("acc1", "test", weekStart), []);

    spyOn(store, "dispatch").and.callThrough();

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

  it("should dispatch load entries on init", (done) => {
    // The loadTimeEntries action is dispatched after auth user is available
    // Check that it was called during component initialization
    setTimeout(() => {
      const dispatchCalls = (store.dispatch as jasmine.Spy).calls.all();
      const loadEntriesCall = dispatchCalls.find(
        (call) =>
          call.args[0].type === TimeTrackingActions.loadTimeEntries.type,
      );
      expect(loadEntriesCall).toBeTruthy();
      if (loadEntriesCall) {
        expect(loadEntriesCall.args[0].accountId).toBe("acc1");
        expect(loadEntriesCall.args[0].userId).toBe("test");
        expect(loadEntriesCall.args[0].weekStart).toEqual(
          component.currentWeekStart,
        );
      }
      done();
    }, 100);
  });

  it("should advance to the next week", () => {
    const start = new Date(component.currentWeekStart);
    component.nextWeek();
    expect(+component.currentWeekStart).toBe(+start + 7 * 24 * 60 * 60 * 1000);
  });

  it("should go back to the previous week", () => {
    const start = new Date(component.currentWeekStart);
    component.previousWeek();
    expect(+component.currentWeekStart).toBe(+start - 7 * 24 * 60 * 60 * 1000);
  });

  it("should dispatch clear action on destroy", () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(
      TimeTrackingActions.clearTimeTrackingSubscriptions(),
    );
  });
});
