import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";

import {GroupListComponent} from "./group-list.component";

describe("GroupListComponent", () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
