import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupEditPage} from "./group-edit.page";

describe("GroupEditPage", () => {
  let component: GroupEditPage;
  let fixture: ComponentFixture<GroupEditPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GroupEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
