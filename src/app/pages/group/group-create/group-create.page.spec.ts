import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupCreatePage} from "./group-create.page";

describe("GroupCreatePage", () => {
  let component: GroupCreatePage;
  let fixture: ComponentFixture<GroupCreatePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GroupCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
