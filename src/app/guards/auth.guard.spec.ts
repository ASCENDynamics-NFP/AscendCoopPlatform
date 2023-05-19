import {TestBed} from "@angular/core/testing";

import {AuthGuard} from "./auth.guard";
import {AuthService} from "../services/auth.service";

describe("AuthGuard", () => {
  let guard: AuthGuard;
  let service: AuthService;
  let authSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: AuthService, useValue: authSpy}],
    });

    service = TestBed.inject(AuthService);
    guard = TestBed.inject(AuthGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
