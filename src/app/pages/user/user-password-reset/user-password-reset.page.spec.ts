import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UserPasswordResetPage} from "./user-password-reset.page";

describe("UserPasswordResetPage", () => {
  let component: UserPasswordResetPage;
  let fixture: ComponentFixture<UserPasswordResetPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(UserPasswordResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
