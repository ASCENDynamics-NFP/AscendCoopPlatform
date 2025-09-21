import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {WeekViewComponent} from "./week-view.component";
import {Store} from "@ngrx/store";
import {Timestamp} from "firebase/firestore";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {SimpleChange} from "@angular/core";
import {SuccessHandlerService} from "../../../../core/services/success-handler.service";
import {ErrorHandlerService} from "../../../../core/services/error-handler.service";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateTestingModule} from "../../../../shared/testing/translate-testing.module";

describe("WeekViewComponent", () => {
  let component: WeekViewComponent;
  let fixture: ComponentFixture<WeekViewComponent>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    store = jasmine.createSpyObj("Store", ["dispatch"]);
    await TestBed.configureTestingModule({
      declarations: [WeekViewComponent],
      imports: [FormsModule, IonicModule.forRoot(), TranslateTestingModule],
      providers: [
        {provide: Store, useValue: store},
        {
          provide: SuccessHandlerService,
          useValue: {handleSuccess: jasmine.createSpy("handleSuccess")},
        },
        {
          provide: ErrorHandlerService,
          useValue: {handleFirebaseAuthError: jasmine.createSpy("handleError")},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekViewComponent);
    component = fixture.componentInstance;

    component.userId = "test";

    component.availableProjects = [
      {id: "p1", name: "Project 1"} as any,
      {id: "p2", name: "Project 2"} as any,
      {id: "p3", name: "Project 3"} as any,
    ];
    component.rows = [{projectId: "p1"}, {projectId: "p2"}];

    const today = new Date();
    component.weekStart = today;
    component.entries = [
      {
        id: "e1",
        projectId: "p1",
        userId: "u1",
        date: Timestamp.fromDate(today),
        hours: 1,
        status: "pending",
      } as any,
    ];

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render a row for each configured row", () => {
    const rows = fixture.nativeElement.querySelectorAll("tbody tr");
    expect(rows.length).toBe(2);
  });

  it("should track pending changes on hours change but not dispatch immediately", fakeAsync(() => {
    // First set up a project for row 0
    const mockEvent = {detail: {value: "p1"}} as any;
    component.addProjectById(0, mockEvent);
    fixture.detectChanges();
    tick();

    store.dispatch.calls.reset();

    // Create a mock event that simulates input change
    const mockInputEvent = {
      target: {value: "8"},
    } as unknown as Event;

    const day = new Date();
    component.onHoursChange(0, day, mockInputEvent);
    tick();

    // Should not dispatch immediately (manual save behavior)
    expect(store.dispatch).not.toHaveBeenCalled();

    // Should track the change as pending
    expect(component.hasUnsavedChanges).toBe(true);

    // Should dispatch when saveChanges is called
    component.saveChanges();
    tick();

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: TimeTrackingActions.saveTimeEntry.type,
      }),
    );
  }));

  it("should track pending deletion when hours set to 0 but not dispatch immediately", fakeAsync(() => {
    // First set up a project for row 0 with existing entry
    const mockEvent = {detail: {value: "p1"}} as any;
    component.addProjectById(0, mockEvent);
    fixture.detectChanges();
    tick();

    store.dispatch.calls.reset();

    // Create a mock event that simulates setting input to 0
    const mockInputEvent = {
      target: {value: "0"},
    } as unknown as Event;

    const day = new Date();
    component.onHoursChange(0, day, mockInputEvent);
    tick();

    // Should not dispatch immediately (manual save behavior)
    expect(store.dispatch).not.toHaveBeenCalled();

    // Should track the change as pending
    expect(component.hasUnsavedChanges).toBe(true);

    // Should dispatch delete action when saveChanges is called
    component.saveChanges();
    tick();

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: TimeTrackingActions.deleteTimeEntry.type,
      }),
    );
  }));

  it("should include userId when creating new entry via saveChanges", () => {
    // First set up a project for row 0
    const mockEvent = {detail: {value: "p1"}} as any;
    component.addProjectById(0, mockEvent);

    const nextDay = new Date(component.weekStart);
    nextDay.setDate(nextDay.getDate() + 1);
    component.onHoursChange(0, nextDay, {
      target: {value: "3"},
    } as any);

    // Should not dispatch immediately
    expect(store.dispatch).not.toHaveBeenCalled();

    // Should dispatch with userId when saveChanges is called
    component.saveChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: TimeTrackingActions.saveTimeEntry.type,
        entry: jasmine.objectContaining({userId: "test"}),
      }),
    );
  });

  it("should add a row when addRow is called", () => {
    component.addRow();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);
  });

  it("should not dispatch when hours empty for new entry", fakeAsync(() => {
    // Set up a project for row 1
    const mockEvent = {detail: {value: "p3"}} as any;
    component.addProjectById(1, mockEvent);
    fixture.detectChanges();
    tick();

    store.dispatch.calls.reset();

    // Create a mock event with empty value
    const mockInputEvent = {
      target: {value: ""},
    } as unknown as Event;

    const day = new Date();
    component.onHoursChange(1, day, mockInputEvent);
    tick();

    expect(store.dispatch).not.toHaveBeenCalled();
  }));

  it("should not dispatch when hours are outside 0-24", () => {
    store.dispatch.calls.reset();
    component.onHoursChange(0, component.weekStart, {
      target: {value: "-1"},
    } as any);
    component.onHoursChange(0, component.weekStart, {
      target: {value: "25"},
    } as any);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("should not dispatch when project is undefined", () => {
    store.dispatch.calls.reset();
    component.rows.push({projectId: null});
    const index = component.rows.length - 1;
    component.onHoursChange(index, component.weekStart, {
      target: {value: "1"},
    } as any);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("should skip validation when project is not selected", () => {
    store.dispatch.calls.reset();
    component.rows.push({projectId: null});
    const index = component.rows.length - 1;
    spyOn(component, "getEntry");
    component.onHoursChange(index, component.weekStart, {
      target: {value: "5"},
    } as any);
    expect(component.getEntry).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("should calculate initial totals", () => {
    expect(component.rowTotals[0]).toBe(1);
    expect(component.rowTotals[1]).toBe(0);
    expect(component.columnTotals[0]).toBe(1);
    expect(component.totalHours).toBe(1);
  });

  it("should update totals based on existing entries", fakeAsync(() => {
    // The component already has an entry with 1 hour for p1 on 'today'
    // Let's verify the totals are calculated correctly for existing data

    tick();
    fixture.detectChanges();

    // Check initial totals (there's already 1 hour entry for p1)
    expect(component.rowTotals[0]).toBe(1); // p1 has 1 hour
    expect(component.rowTotals[1]).toBe(0); // p2 has no hours
    expect(component.totalHours).toBe(1);

    // Add a new entry to simulate an hours change result
    component.entries.push({
      id: "e2",
      projectId: "p1",
      userId: "u1",
      date: Timestamp.fromDate(component.days[1]), // Second day of week
      hours: 5,
      status: "pending",
    } as any);

    // Manually trigger totals update (simulating what happens after store update)
    (component as any).updateTotals();

    expect(component.rowTotals[0]).toBe(6); // p1 now has 1 + 5 = 6 hours
    expect(component.columnTotals[1]).toBe(5); // Second day has 5 hours
    expect(component.totalHours).toBe(6);
  }));

  it("should update header dates when weekStart changes", () => {
    const initialHeader: string = fixture.nativeElement
      .querySelectorAll("thead th")[1]
      .textContent.trim();
    const nextWeek = new Date(component.weekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    component.weekStart = nextWeek;
    component.ngOnChanges({
      weekStart: new SimpleChange(null, nextWeek, false),
    });
    fixture.detectChanges();
    const newHeader: string = fixture.nativeElement
      .querySelectorAll("thead th")[1]
      .textContent.trim();
    expect(newHeader).not.toBe(initialHeader);
  });
});
