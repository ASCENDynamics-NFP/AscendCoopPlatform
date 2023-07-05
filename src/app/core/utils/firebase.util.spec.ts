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
