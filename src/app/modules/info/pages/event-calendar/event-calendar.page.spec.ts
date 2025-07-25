import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {RouterTestingModule} from "@angular/router/testing";
import {SharedModule} from "../../../../shared/shared.module";
import {provideMockStore} from "@ngrx/store/testing";
import {EventCalendarPage} from "./event-calendar.page";

describe("EventCalendarPage", () => {
  let component: EventCalendarPage;
  let fixture: ComponentFixture<EventCalendarPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventCalendarPage],
      imports: [IonicModule.forRoot(), RouterTestingModule, SharedModule],
      providers: [
        provideMockStore({
          initialState: {
            auth: {user: null, loading: false, error: null},
            projects: {entities: {}, loading: false, error: null},
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
