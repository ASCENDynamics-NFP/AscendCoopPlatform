import {ComponentFixture, TestBed} from "@angular/core/testing";
import {StartupsPage} from "./startups.page";

describe("StartupsPage", () => {
  let component: StartupsPage;
  let fixture: ComponentFixture<StartupsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StartupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
