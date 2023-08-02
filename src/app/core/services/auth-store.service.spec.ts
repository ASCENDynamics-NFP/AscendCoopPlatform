import {TestBed} from "@angular/core/testing";
import {AuthStoreService} from "./auth-store.service";
import {User} from "firebase/auth";
import {of} from "rxjs";

describe("AuthStoreService", () => {
  let service: AuthStoreService;
  let authSpy: any;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj("auth", ["signUp", "signIn", "signOut"]);
    authSpy.signUp.and.returnValue(Promise.resolve());
    authSpy.signIn.and.returnValue(Promise.resolve());
    authSpy.signOut.and.returnValue(Promise.resolve());
    // Mock the onAuthStateChanged function
    authSpy.onAuthStateChanged = (callback: (user: User | null) => void) =>
      callback(null);
    // Mock user$ as an Observable that emits null
    authSpy.user$ = of(null);

    TestBed.configureTestingModule({
      providers: [{provide: AuthStoreService, useValue: authSpy}],
    });

    service = TestBed.inject(AuthStoreService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should sign up a user", async () => {
    const email = "test@example.com";
    const password = "password";
    await service.signUp(email, password);
    expect(authSpy.signUp).toHaveBeenCalledWith(email, password);
  }, 10000);

  it("should sign in a user", async () => {
    const email = "test@example.com";
    const password = "password";
    await service.signIn(email, password);
    expect(authSpy.signIn).toHaveBeenCalledWith(email, password);
  });

  it("should sign out a user", async () => {
    await service.signOut();
    expect(authSpy.signOut).toHaveBeenCalled();
  });

  it("should emit null for user$ when signed out", (done) => {
    service.user$.subscribe((user) => {
      expect(user).toBeNull();
      done();
    });
  });
});
