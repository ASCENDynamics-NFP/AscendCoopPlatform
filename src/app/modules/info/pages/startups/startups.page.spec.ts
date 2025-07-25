import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {RouterTestingModule} from "@angular/router/testing";
import {SharedModule} from "../../../../shared/shared.module";
import {StartupsPage} from "./startups.page";

describe("StartupsPage", () => {
  let component: StartupsPage;
  let fixture: ComponentFixture<StartupsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StartupsPage],
      imports: [IonicModule.forRoot(), RouterTestingModule, SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StartupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
