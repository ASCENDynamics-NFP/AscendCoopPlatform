import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {UserGroupsPage} from "./user-groups.page";
import {ActivatedRoute} from "@angular/router";

describe("UserGroupsPage", () => {
  let component: UserGroupsPage;
  let fixture: ComponentFixture<UserGroupsPage>;

  beforeEach(waitForAsync(() => {
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
    }).compileComponents();
    fixture = TestBed.createComponent(UserGroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
