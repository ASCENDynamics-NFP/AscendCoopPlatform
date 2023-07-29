import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";

import {MemberListComponent} from "./member-list.component";

describe("MemberListComponent", () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
