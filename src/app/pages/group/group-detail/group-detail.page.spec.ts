import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupDetailPage} from "./group-detail.page";

describe("GroupDetailPage", () => {
  let component: GroupDetailPage;
  let fixture: ComponentFixture<GroupDetailPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GroupDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
