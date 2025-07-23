import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {TimesheetPage} from "./timesheet.page";
import {provideMockStore} from "@ngrx/store/testing";

describe("TimesheetPage", () => {
  let component: TimesheetPage;
  let fixture: ComponentFixture<TimesheetPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimesheetPage],
      imports: [IonicModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimesheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
