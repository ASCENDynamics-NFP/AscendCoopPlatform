import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupListPage} from "./group-list.page";

describe("GroupListPage", () => {
  let component: GroupListPage;
  let fixture: ComponentFixture<GroupListPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GroupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
