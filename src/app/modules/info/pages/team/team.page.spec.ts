import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule, ModalController} from "@ionic/angular";
import {TeamPage} from "./team.page";
import {MetaService} from "../../../../core/services/meta.service";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("TeamPage", () => {
  let component: TeamPage;
  let fixture: ComponentFixture<TeamPage>;

  beforeEach(waitForAsync(() => {
    const metaServiceSpy = jasmine.createSpyObj("MetaService", [
      "updateMetaTags",
    ]);
    const modalControllerSpy = jasmine.createSpyObj("ModalController", [
      "create",
    ]);

    TestBed.configureTestingModule({
      declarations: [TeamPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: MetaService, useValue: metaServiceSpy},
        {provide: ModalController, useValue: modalControllerSpy},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
