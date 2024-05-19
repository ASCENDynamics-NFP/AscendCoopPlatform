import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";

import {VolunteerPreferenceInfoComponent} from "./volunteer-preference-info.component";

describe("VolunteerPreferenceInfoComponent", () => {
  let component: VolunteerPreferenceInfoComponent;
  let fixture: ComponentFixture<VolunteerPreferenceInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(VolunteerPreferenceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
