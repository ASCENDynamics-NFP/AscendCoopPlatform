import {TestBed} from "@angular/core/testing";

import {SecureInnerPagesGuard} from "./secure-inner-pages.guard";
import {AuthService} from "../services/auth.service";

describe("SecureInnerPagesGuard", () => {
  let guard: SecureInnerPagesGuard;
  let service: AuthService;
  let authSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: AuthService, useValue: authSpy}],
    });

    service = TestBed.inject(AuthService);
    guard = TestBed.inject(SecureInnerPagesGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
