import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UserLoginPage} from "./user-login.page";
import {AuthService} from "../../../../core/services/auth.service";
import {of} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

describe("UserLoginPage", () => {
  let component: UserLoginPage;
  let fixture: ComponentFixture<UserLoginPage>;
  let service: AuthService;
  let authSpy: any;
  let translate: TranslateService;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj("auth", ["onSignInWithEmailLink"]);
    // Mock user$ as an Observable that emits null
    authSpy.user$ = of(null);
    authSpy.onSignInWithEmailLink.and.returnValue(Promise.resolve());
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{provide: AuthService, useValue: authSpy}, TranslateService],
    });
    service = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(UserLoginPage);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService); // inject TranslateService
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
