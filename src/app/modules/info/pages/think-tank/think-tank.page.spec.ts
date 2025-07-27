import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {ThinkTankPage} from "./think-tank.page";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("ThinkTankPage", () => {
  let component: ThinkTankPage;
  let fixture: ComponentFixture<ThinkTankPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ThinkTankPage],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ThinkTankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
