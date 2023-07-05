import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {UserSignupPage} from "./user-signup.page";
import {AuthService} from "../../../../core/services/auth.service";
import {of} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

describe("UserSignupPage", () => {
  let component: UserSignupPage;
  let fixture: ComponentFixture<UserSignupPage>;
  let translate: TranslateService;

  const mockAuthService = {
    // Add the methods used in your component here.
    // For example, if your component calls `authService.signUp()`, add a `signUp` method:
    signUp: jasmine.createSpy("signUp").and.returnValue(Promise.resolve(true)),
    user$: of(false), // This is an Observable
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserSignupPage, TranslateModule.forRoot()],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSignupPage);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService); // inject TranslateService
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test for signUp method
  // it("should call signUp on AuthService when signUp is called", async () => {
  //   // Arrange
  //   component.signupForm.setValue({
  //     email: "test@test.com",
  //     password: "test1234",
  //   });

  //   // Act
  //   await component.signup();

  //   // Assert
  //   expect(mockAuthService.signUp).toHaveBeenCalled();
  //   expect(mockAuthService.signUp).toHaveBeenCalledWith(
  //     "test@test.com",
  //     "test1234",
  //   );
  // });
});
