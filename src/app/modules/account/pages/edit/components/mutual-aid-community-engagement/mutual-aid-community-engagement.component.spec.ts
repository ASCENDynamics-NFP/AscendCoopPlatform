import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";

import {MutualAidCommunityEngagementComponent} from "./mutual-aid-community-engagement.component";

describe("MutualAidCommunityEngagementComponent", () => {
  let component: MutualAidCommunityEngagementComponent;
  let fixture: ComponentFixture<MutualAidCommunityEngagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MutualAidCommunityEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
