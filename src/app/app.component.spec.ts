import {TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AppComponent} from "./app.component";
import { of } from "rxjs";
import { AuthService } from "./services/auth.service";

describe("AppComponent", () => {
  let service: AuthService;
  let authSpy: any;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj("auth", ["onSignOut"]);
    // Mock user$ as an Observable that emits null
    authSpy.user$ = of(null);
    authSpy.onSignOut.and.returnValue(Promise.resolve());
    
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{provide: AuthService, useValue: authSpy}],
    }).compileComponents();

    service = TestBed.inject(AuthService);
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
