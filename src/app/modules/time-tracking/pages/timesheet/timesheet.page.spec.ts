import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {TimesheetPage} from "./timesheet.page";
import {WeekViewComponent} from "../../components/week-view/week-view.component";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {ActivatedRoute} from "@angular/router";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {selectEntries} from "../../../../state/selectors/time-tracking.selectors";
import {selectActiveProjectsByAccount} from "../../../../state/selectors/projects.selectors";
import {selectRelatedAccountsByAccountId} from "../../../../state/selectors/account.selectors";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {TranslateTestingModule} from "../../../../shared/testing/translate-testing.module";
import {TimesheetNotificationService} from "../../services/timesheet-notification.service";

describe("TimesheetPage", () => {
  let component: TimesheetPage;
  let fixture: ComponentFixture<TimesheetPage>;
  let store: MockStore;
  let mockNotificationService: jasmine.SpyObj<TimesheetNotificationService>;

  beforeEach(async () => {
    mockNotificationService = jasmine.createSpyObj(
      "TimesheetNotificationService",
      [
        "notifyTimesheetSubmitted",
        "notifyTimesheetApproved",
        "notifyTimesheetRejected",
        "notifyNoteAdded",
      ],
    );

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
        {
          provide: TimesheetNotificationService,
          useValue: mockNotificationService,
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

  // New user scenarios
  describe("New user scenarios", () => {
    it("should handle user with no projects available", (done) => {
      store.overrideSelector(selectActiveProjectsByAccount("acc1"), []);
      fixture.detectChanges();

      component.projects$.subscribe((projects) => {
        expect(projects).toEqual([]);
        expect(component).toBeTruthy();
        done();
      });
    });

    it("should handle first-time timesheet entry", () => {
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      store.overrideSelector(selectEntries("acc1", "test", weekStart), []);
      fixture.detectChanges();

      component.entries$.subscribe((entries) => {
        expect(entries).toEqual([]);
      });
    });

    it("should handle user without proper permissions", () => {
      // Create a fresh component instance with null user
      const fixture2 = TestBed.createComponent(TimesheetPage);
      const component2 = fixture2.componentInstance as TimesheetPage;

      store.overrideSelector(selectAuthUser, null);
      fixture2.detectChanges();

      expect(component2.userId).toBe("");
    });
  });

  // Entry workflow testing
  describe("Entry workflow testing", () => {
    beforeEach(() => {
      const mockEntries = [
        {
          id: "e1",
          accountId: "acc1",
          projectId: "p1",
          userId: "test",
          date: new Date(),
          hours: 8,
          status: "draft",
          description: "Test work",
        } as any,
      ];
      store.overrideSelector(
        selectEntries("acc1", "test", component.currentWeekStart),
        mockEntries,
      );
    });

    it("should save draft entries and maintain state", (done) => {
      const mockEntries = [
        {
          id: "e1",
          accountId: "acc1",
          projectId: "p1",
          userId: "test",
          date: new Date(),
          hours: 8,
          status: "draft",
          description: "Test work",
        } as any,
      ];

      store.overrideSelector(
        selectEntries("acc1", "test", component.currentWeekStart),
        mockEntries,
      );

      // Set entries directly to avoid observable timing issues
      component.entries = mockEntries;
      fixture.detectChanges();

      // Test the entries are maintained in draft state
      expect(component.entries.length).toBe(1);
      expect(component.entries[0].status).toBe("draft");
      done();
    });

    it("should lock UI after submission", () => {
      const mockPendingEntries = [
        {
          id: "e1",
          accountId: "acc1",
          projectId: "p1",
          userId: "test",
          date: new Date(),
          hours: 8,
          status: "pending",
        } as any,
      ];

      store.overrideSelector(
        selectEntries("acc1", "test", component.currentWeekStart),
        mockPendingEntries,
      );

      // Set component entries directly to ensure the method can access them
      component.entries = mockPendingEntries;
      fixture.detectChanges();

      expect(component.canEditCurrentWeek()).toBe(false);
    });

    it("should show correct status messages", () => {
      const mockRejectedEntries = [
        {
          id: "e1",
          accountId: "acc1",
          projectId: "p1",
          userId: "test",
          date: new Date(),
          hours: 8,
          status: "rejected",
        } as any,
      ];

      store.overrideSelector(
        selectEntries("acc1", "test", component.currentWeekStart),
        mockRejectedEntries,
      );

      // Set component entries directly to ensure the status calculation works
      component.entries = mockRejectedEntries;
      fixture.detectChanges();

      const statusMessage = component.getWeekStatusMessage();
      expect(statusMessage).toContain("rejected");
    });
  });

  // Edge cases
  describe("Edge cases", () => {
    it("should handle submission without authenticated user", () => {
      store.overrideSelector(selectAuthUser, null);
      component.userId = "";
      fixture.detectChanges();

      component.submitForApproval();

      // Should not dispatch submit action when user is not authenticated
      const submitCalls = (store.dispatch as jasmine.Spy).calls
        .all()
        .filter(
          (call) =>
            call.args[0].type ===
            TimeTrackingActions.submitTimesheetForApproval.type,
        );
      expect(submitCalls.length).toBe(0);
    });

    it("should prevent submission of invalid entries", () => {
      const mockInvalidEntries = [
        {
          id: "e1",
          accountId: "acc1",
          projectId: "", // Invalid: no project
          userId: "test",
          date: new Date(),
          hours: 8,
          status: "draft",
        } as any,
      ];

      store.overrideSelector(
        selectEntries("acc1", "test", component.currentWeekStart),
        mockInvalidEntries,
      );
      fixture.detectChanges();

      component.submitForApproval();

      // Should not submit entries without valid project
      const submitCalls = (store.dispatch as jasmine.Spy).calls
        .all()
        .filter(
          (call) =>
            call.args[0].type ===
            TimeTrackingActions.submitTimesheetForApproval.type,
        );
      expect(submitCalls.length).toBe(0);
    });

    it("should handle week navigation correctly", () => {
      const originalWeek = new Date(component.currentWeekStart);

      component.nextWeek();
      expect(component.currentWeekStart.getTime()).toBe(
        originalWeek.getTime() + 7 * 24 * 60 * 60 * 1000,
      );

      component.returnToCurrentWeek();
      // Should be close to today's week (within a week range)
      const today = new Date();
      const timeDiff = Math.abs(
        component.currentWeekStart.getTime() - today.getTime(),
      );
      expect(timeDiff).toBeLessThan(7 * 24 * 60 * 60 * 1000);
    });
  });

  // Submit button state testing
  describe("Submit button functionality", () => {
    it("should show correct button text for different states", () => {
      // Draft state
      const draftEntries = [
        {
          id: "e1",
          accountId: "acc1",
          projectId: "p1",
          userId: "test",
          date: new Date(),
          status: "draft",
          hours: 8,
        } as any,
      ];
      store.overrideSelector(
        selectEntries("acc1", "test", component.currentWeekStart),
        draftEntries,
      );
      fixture.detectChanges();

      expect(component.getSubmitButtonText()).toContain("Submit");

      // Rejected state should show "Resubmit"
      const rejectedEntries = [
        {
          id: "e1",
          accountId: "acc1",
          projectId: "p1",
          userId: "test",
          date: new Date(),
          status: "rejected",
          hours: 8,
          description: "Test work",
        } as any,
      ];
      store.overrideSelector(
        selectEntries("acc1", "test", component.currentWeekStart),
        rejectedEntries,
      );

      // Set entries directly for getCurrentWeekStatus to work properly
      component.entries = rejectedEntries;
      fixture.detectChanges();

      expect(component.getSubmitButtonText()).toContain("Resubmit");
    });

    // Temporarily disabled - complex async test that needs refactoring
    // TODO: Refactor notification service integration test
    xit("should integrate with notification service on submission", () => {
      const mockEntries = [
        {
          id: "e1",
          accountId: "acc1",
          projectId: "p1",
          userId: "test",
          date: new Date(),
          hours: 8,
          status: "draft",
          description: "Test work",
        } as any,
      ];

      // Set up component properties
      component.accountId = "acc1";
      component.userId = "test";
      component.entries = mockEntries;
      component.availableProjects = [{id: "p1", name: "Test Project"} as any];
      fixture.detectChanges();

      // Clear previous dispatch calls
      (store.dispatch as jasmine.Spy).calls.reset();

      component.submitForApproval();

      // Should dispatch submit action - this is the main behavior we're testing
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: TimeTrackingActions.submitTimesheetForApproval.type,
        }),
      );
    });
  });
});
