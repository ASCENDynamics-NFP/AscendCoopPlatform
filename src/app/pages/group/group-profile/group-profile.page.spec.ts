import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupProfilePage} from "./group-profile.page";

describe("GroupProfilePage", () => {
  let component: GroupProfilePage;
  let fixture: ComponentFixture<GroupProfilePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GroupProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
