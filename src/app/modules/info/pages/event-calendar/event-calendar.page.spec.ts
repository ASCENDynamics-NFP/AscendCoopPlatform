import {ComponentFixture, TestBed} from "@angular/core/testing";
import {EventCalendarPage} from "./event-calendar.page";

describe("EventCalendarPage", () => {
  let component: EventCalendarPage;
  let fixture: ComponentFixture<EventCalendarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
