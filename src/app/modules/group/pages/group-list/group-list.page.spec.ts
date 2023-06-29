import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GroupListPage} from "./group-list.page";
import {AuthService} from "../../../../core/services/auth.service";

describe("GroupListPage", () => {
  let component: GroupListPage;
  let fixture: ComponentFixture<GroupListPage>;
  // let service: AuthService;
  let authSpy: any;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [{provide: AuthService, useValue: authSpy}],
    });

    // service = TestBed.inject(AuthService);
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GroupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
