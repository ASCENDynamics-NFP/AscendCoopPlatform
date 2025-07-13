import {ComponentFixture, TestBed} from "@angular/core/testing";
import {TeamPage} from "./team.page";

describe("TeamPage", () => {
  let component: TeamPage;
  let fixture: ComponentFixture<TeamPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
