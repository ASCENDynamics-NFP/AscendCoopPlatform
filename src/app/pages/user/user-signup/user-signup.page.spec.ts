import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {UserSignupPage} from "./user-signup.page";
import {AuthService} from "../../../services/auth.service";

describe("UserSignupPage", () => {
  let component: UserSignupPage;
  let fixture: ComponentFixture<UserSignupPage>;

  const mockAuthService = {
    // Add the methods used in your component here.
    // For example, if your component calls `authService.signUp()`, add a `signUp` method:
    signUp: jasmine.createSpy("signUp").and.returnValue(Promise.resolve(true)),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserSignupPage],
      providers: [{provide: AuthService, useValue: mockAuthService}],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test for signUp method
  it("should call signUp on AuthService when signUp is called", async () => {
    // Arrange
    component.signupForm.setValue({
      email: "test@test.com",
      password: "test1234",
    });

    // Act
    await component.signup();

    // Assert
    expect(mockAuthService.signUp).toHaveBeenCalled();
    expect(mockAuthService.signUp).toHaveBeenCalledWith(
      "test@test.com",
      "test1234",
    );
  });
});
