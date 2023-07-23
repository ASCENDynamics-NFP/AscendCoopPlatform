import {ComponentFixture, TestBed} from "@angular/core/testing";
import {EditUserProfilePage} from "./edit-user-profile.page";

describe("EditUserProfilePage", () => {
  let component: EditUserProfilePage;
  let fixture: ComponentFixture<EditUserProfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditUserProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
