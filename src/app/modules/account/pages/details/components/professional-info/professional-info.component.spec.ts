import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";

import {ProfessionalInfoComponent} from "./professional-info.component";

describe("ProfessionalInfoComponent", () => {
  let component: ProfessionalInfoComponent;
  let fixture: ComponentFixture<ProfessionalInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
