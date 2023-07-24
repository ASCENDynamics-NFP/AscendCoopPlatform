/**
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
* 
* This file is part of Nonprofit Social Networking Platform.
* 
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* 
* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
*/
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
