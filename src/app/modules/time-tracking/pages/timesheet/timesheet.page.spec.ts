import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {TimesheetPage} from "./timesheet.page";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";

describe("TimesheetPage", () => {
  let component: TimesheetPage;
  let fixture: ComponentFixture<TimesheetPage>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimesheetPage],
      imports: [IonicModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAuthUser, {uid: "test"} as any);

    fixture = TestBed.createComponent(TimesheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set userId from auth selector", () => {
    expect(component.userId).toBe("test");
  });
});
