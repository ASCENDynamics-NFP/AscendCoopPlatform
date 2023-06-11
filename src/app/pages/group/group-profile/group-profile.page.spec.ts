import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupProfilePage} from "./group-profile.page";
import {ActivatedRoute} from "@angular/router";

describe("GroupProfilePage", () => {
  let component: GroupProfilePage;
  let fixture: ComponentFixture<GroupProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
    }).compileComponents();
    fixture = TestBed.createComponent(GroupProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
