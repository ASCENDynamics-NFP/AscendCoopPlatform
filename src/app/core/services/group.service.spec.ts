import {TestBed} from "@angular/core/testing";

import {GroupService} from "./group.service";
import {ActivatedRoute} from "@angular/router";

describe("GroupService", () => {
  let service: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "123", // provide your mock value here
              },
            },
          },
        },
      ],
      imports: [],
    }).compileComponents();
    service = TestBed.inject(GroupService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
