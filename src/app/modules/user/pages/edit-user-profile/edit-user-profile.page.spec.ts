import {ComponentFixture, TestBed} from "@angular/core/testing";
import {EditUserProfilePage} from "./edit-user-profile.page";
import {ActivatedRoute} from "@angular/router";

describe("EditUserProfilePage", () => {
  let component: EditUserProfilePage;
  let fixture: ComponentFixture<EditUserProfilePage>;

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
    fixture = TestBed.createComponent(EditUserProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
