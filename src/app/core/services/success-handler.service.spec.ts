import {TestBed} from "@angular/core/testing";

import {SuccessHandlerService} from "./success-handler.service";

describe("SuccessHandlerService", () => {
  let service: SuccessHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuccessHandlerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
