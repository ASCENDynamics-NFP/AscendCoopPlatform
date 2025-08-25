/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {of} from "rxjs";
import {UnifiedRegistrationComponent} from "./unified-registration.component";
import {TranslateTestingModule} from "../../../../../../shared/testing/translate-testing.module";

describe("UnifiedRegistrationComponent", () => {
  let component: UnifiedRegistrationComponent;
  let fixture: ComponentFixture<UnifiedRegistrationComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj("Store", ["dispatch", "select"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [UnifiedRegistrationComponent],
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(),
        TranslateTestingModule,
      ],
      providers: [
        {provide: Store, useValue: storeSpy},
        {provide: Router, useValue: routerSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UnifiedRegistrationComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup store spy to return observables
    mockStore.select.and.returnValue(of(null));

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form for user registration", () => {
    component.accountType = "user";
    component.ngOnChanges({
      accountType: {
        currentValue: "user",
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.registrationForm.get("groupDetails")).toBeNull();
    expect(component.nameLabel).toBe("Name");
    expect(component.isGroupRegistration).toBe(false);
  });

  it("should initialize form for group registration", () => {
    component.accountType = "group";
    component.ngOnChanges({
      accountType: {
        currentValue: "group",
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.registrationForm.get("groupDetails")).toBeTruthy();
    expect(component.nameLabel).toBe("Group Name");
    expect(component.isGroupRegistration).toBe(true);
  });
});
