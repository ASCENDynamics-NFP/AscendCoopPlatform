import {TestBed} from "@angular/core/testing";
import {UsersService} from "./users.service";
import {initializeApp} from "firebase/app";
import {environment} from "../../../environments/environment";

initializeApp(environment.firebaseConfig);

describe("UsersService", () => {
  let service: UsersService;
  // Create a spy object for UsersService
  const UsersServiceSpy = jasmine.createSpyObj("UsersService", [
    "getUser",
    "createUser",
    "updateUser",
    "deleteUser",
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: UsersService, useValue: UsersServiceSpy}],
    });
    service = TestBed.inject(UsersService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
