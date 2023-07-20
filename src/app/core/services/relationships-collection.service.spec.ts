import {TestBed} from "@angular/core/testing";

import {RelationshipsCollectionService} from "./relationships-collection.service";

describe("RelationshipsCollectionService", () => {
  let service: RelationshipsCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationshipsCollectionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
