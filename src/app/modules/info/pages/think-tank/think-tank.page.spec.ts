import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ThinkTankPage} from "./think-tank.page";

describe("ThinkTankPage", () => {
  let component: ThinkTankPage;
  let fixture: ComponentFixture<ThinkTankPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ThinkTankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
