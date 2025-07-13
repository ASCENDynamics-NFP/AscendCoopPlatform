import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ServicesPage} from "./services.page";

describe("ServicesPage", () => {
  let component: ServicesPage;
  let fixture: ComponentFixture<ServicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
