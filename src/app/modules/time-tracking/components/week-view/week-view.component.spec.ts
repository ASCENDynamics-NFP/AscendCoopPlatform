import {ComponentFixture, TestBed} from "@angular/core/testing";
import {WeekViewComponent} from "./week-view.component";
import {Store} from "@ngrx/store";
import {Timestamp} from "firebase/firestore";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";

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

    component.projects = [
      {id: "p1", name: "Project 1"} as any,
      {id: "p2", name: "Project 2"} as any,
    ];

    const today = new Date();
    component.weekStart = today;
    component.entries = [
      {
        id: "e1",
        projectId: "p1",
        userId: "u1",
        date: Timestamp.fromDate(today),
        hours: 1,
      } as any,
    ];

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render a row for each project", () => {
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
});
