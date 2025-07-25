import {ComponentFixture, TestBed} from "@angular/core/testing";
import {WeekViewComponent} from "./week-view.component";
import {Store} from "@ngrx/store";
import {Timestamp} from "firebase/firestore";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {SimpleChange} from "@angular/core";

describe("WeekViewComponent", () => {
  let component: WeekViewComponent;
  let fixture: ComponentFixture<WeekViewComponent>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    store = jasmine.createSpyObj("Store", ["dispatch"]);
    await TestBed.configureTestingModule({
      declarations: [WeekViewComponent],
      providers: [{provide: Store, useValue: store}],
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

  it("should dispatch save action on hours change", () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector("tbody tr input");
    input.value = "2";
    input.dispatchEvent(new Event("change"));
    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: TimeTrackingActions.saveTimeEntry.type,
      }),
    );
  });

  it("should include userId when creating new entry", () => {
    const nextDay = new Date(component.weekStart);
    nextDay.setDate(nextDay.getDate() + 1);
    component.onHoursChange(0, nextDay, {
      target: {value: "3"},
    } as any);

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: TimeTrackingActions.saveTimeEntry.type,
        entry: jasmine.objectContaining({userId: "test"}),
      }),
    );
  });

  it("should add a row when a project is added", () => {
    const mockEvent = {target: {value: "p3"}} as any;
    component.addProjectById(1, mockEvent);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);
  });

  it("should not dispatch when hours empty for new entry", () => {
    const mockEvent = {target: {value: "p3"}} as any;
    component.addProjectById(1, mockEvent);
    fixture.detectChanges();
    store.dispatch.calls.reset();
    const inputs = fixture.nativeElement.querySelectorAll(
      "tbody tr:last-child input",
    );
    const input = inputs[0] as HTMLInputElement;
    input.value = "";
    input.dispatchEvent(new Event("change"));
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("should calculate initial totals", () => {
    expect(component.rowTotals[0]).toBe(1);
    expect(component.rowTotals[1]).toBe(0);
    expect(component.columnTotals[0]).toBe(1);
    expect(component.totalHours).toBe(1);
  });

  it("should update totals when hours change", () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector("tbody tr input");
    input.value = "5";
    input.dispatchEvent(new Event("change"));
    fixture.detectChanges();
    expect(component.rowTotals[0]).toBe(5);
    expect(component.columnTotals[0]).toBe(5);
    expect(component.totalHours).toBe(5);
  });

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
