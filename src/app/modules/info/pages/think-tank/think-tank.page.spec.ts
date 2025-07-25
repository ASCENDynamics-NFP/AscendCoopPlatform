import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {RouterTestingModule} from "@angular/router/testing";
import {SharedModule} from "../../../../shared/shared.module";
import {provideMockStore} from "@ngrx/store/testing";
import {ThinkTankPage} from "./think-tank.page";

describe("ThinkTankPage", () => {
  let component: ThinkTankPage;
  let fixture: ComponentFixture<ThinkTankPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ThinkTankPage],
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

    fixture = TestBed.createComponent(ThinkTankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
