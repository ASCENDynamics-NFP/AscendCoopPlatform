import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UserSettingsPage} from "./user-settings.page";

describe("UserSettingsPage", () => {
  let component: UserSettingsPage;
  let fixture: ComponentFixture<UserSettingsPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(UserSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
