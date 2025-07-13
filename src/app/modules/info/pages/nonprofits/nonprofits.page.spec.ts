import {ComponentFixture, TestBed} from "@angular/core/testing";
import {NonprofitsPage} from "./nonprofits.page";

describe("NonprofitsPage", () => {
  let component: NonprofitsPage;
  let fixture: ComponentFixture<NonprofitsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NonprofitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
