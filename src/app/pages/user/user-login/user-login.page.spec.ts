import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UserLoginPage} from "./user-login.page";
import {initializeApp} from "firebase/app";
import {environment} from "./../../../../environments/environment";

describe("UserLoginPage", () => {
  let component: UserLoginPage;
  let fixture: ComponentFixture<UserLoginPage>;

  beforeAll(() => {
    initializeApp(environment.firebaseConfig);
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(UserLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
