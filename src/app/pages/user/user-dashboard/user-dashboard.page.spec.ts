import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UserDashboardPage} from "./user-dashboard.page";
import {initializeApp} from "firebase/app";
import {environment} from "./../../../../environments/environment";

describe("UserDashboardPage", () => {
  let component: UserDashboardPage;
  let fixture: ComponentFixture<UserDashboardPage>;

  beforeAll(() => {
    initializeApp(environment.firebaseConfig);
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(UserDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
