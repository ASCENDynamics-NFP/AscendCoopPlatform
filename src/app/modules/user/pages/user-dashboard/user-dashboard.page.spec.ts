import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UserDashboardPage} from "./user-dashboard.page";
import {AuthService} from "../../../../core/services/auth.service";
import {of} from "rxjs";

describe("UserDashboardPage", () => {
  let component: UserDashboardPage;
  let fixture: ComponentFixture<UserDashboardPage>;
  let service: AuthService;
  let authSpy: any = {};

  beforeEach(async () => {
    // Mock user$ as an Observable that emits null
    authSpy.user$ = of(null);
    TestBed.configureTestingModule({
      providers: [{provide: AuthService, useValue: authSpy}],
    });

    service = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(UserDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
