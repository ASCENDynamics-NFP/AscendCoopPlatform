import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {SettingsComponent} from "./settings.component";
import {ActivatedRoute} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {StoreService} from "../../../../../../core/services/store.service";
import {of} from "rxjs";

class MockStoreService {
  // Mock the methods and properties used by the component
  users$ = of([]); // You'll need to import 'of' from 'rxjs'
  updateDoc() {}
}

describe("SettingsComponent", () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [], // Include the component under test
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        TranslateModule.forRoot(), // Use forRoot() for testing
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "123", // provide your mock value here
              },
            },
          },
        },
        {provide: StoreService, useClass: MockStoreService}, // Mock the StoreService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
