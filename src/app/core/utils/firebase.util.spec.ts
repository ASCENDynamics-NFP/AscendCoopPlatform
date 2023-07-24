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
import {prepareDataForCreate, prepareDataForUpdate} from "./firebase.util";
import {Timestamp} from "@angular/fire/firestore";

describe("Firebase utility functions", () => {
  let fakeTimestamp: Timestamp;
  let fakeUserId: string;
  let fakeData: any;

  beforeEach(() => {
    fakeTimestamp = Timestamp.now();
    fakeUserId = "test-user";
    fakeData = {example: "data"};
    spyOn(Timestamp, "now").and.returnValue(fakeTimestamp);
  });

  it("should prepare data for creation", () => {
    const result = prepareDataForCreate(fakeData, fakeUserId);

    expect(result).toEqual({
      example: "data",
      createdBy: "test-user",
      createdDate: fakeTimestamp,
      lastModifiedBy: "test-user",
      lastModifiedDate: fakeTimestamp,
    });
  });

  it("should prepare data for update", () => {
    const result = prepareDataForUpdate(fakeData, fakeUserId);

    expect(result).toEqual({
      example: "data",
      lastModifiedBy: "test-user",
      lastModifiedDate: fakeTimestamp,
    });
  });
});
