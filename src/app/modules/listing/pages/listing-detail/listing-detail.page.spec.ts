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
// src/app/modules/listings/pages/listing-detail/listing-detail.page.spec.ts

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {ListingDetailPage} from "./listing-detail.page";
import {
  IonicModule,
  AlertController,
  NavController,
  Platform,
} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {Listing} from "@shared/models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {Timestamp} from "firebase/firestore";
import {TimestampPipe} from "../../../../shared/pipes/timestamp.pipe";
import {
  selectListingById,
  selectLoading,
} from "../../../../state/selectors/listings.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {AppState} from "../../../../state/app.state";
import {AuthUser} from "@shared/models/auth-user.model";
import {Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {TranslateTestingModule} from "../../../../shared/testing/translate-testing.module";

describe("ListingDetailPage", () => {
  let component: ListingDetailPage;
  let fixture: ComponentFixture<ListingDetailPage>;
  let store: MockStore<AppState>;
  let router: jasmine.SpyObj<Router>;
  let alertController: AlertController;
  let activatedRoute: ActivatedRoute;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let platformMock: any;
  let locationMock: any;

  const mockListing: Listing = {
    id: "123",
    title: "Test Listing",
    description: "Test Description",
    type: "volunteer",
    organization: "Test Org",
    remote: false,
    contactInformation: {
      emails: [{name: "Test Contact", email: "test@test.com"}],
      phoneNumbers: [
        {
          type: "Mobile",
          number: "1234567890",
          isEmergencyNumber: false,
        },
      ],
      addresses: [
        {
          street: "123 Test St",
          city: "Test City",
          state: "Test State",
          country: "Test Country",
          zipcode: "12345",
          isPrimaryAddress: true,
        },
      ],
      preferredMethodOfContact: "Email",
    },
    timeCommitment: {
      hoursPerWeek: 10,
      duration: "3 months",
      schedule: "Flexible",
      startDate: Timestamp.fromDate(new Date()),
      endDate: Timestamp.fromDate(new Date()),
      isFlexible: true,
    },
    skills: [{name: "Test Skill", level: "beginner", required: true}],
    requirements: ["Requirement 1"],
    responsibilities: ["Responsibility 1"],
    benefits: ["Benefit 1"],
    status: "active",
    ownerAccountId: "user-123",
    ownerAccountType: "user",
  };

  const mockAuthUser: AuthUser = {
    uid: "user-123",
    email: "test@test.com",
    displayName: "Test User",
    iconImage: null,
    emailVerified: true,
    heroImage: null,
    tagline: null,
    type: "user",
    createdAt: new Date(),
    lastLoginAt: new Date(),
    phoneNumber: null,
    providerData: [],
    settings: {language: "en", theme: "light"},
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    const alertControllerSpy = jasmine.createSpyObj("AlertController", [
      "create",
    ]);

    navControllerSpy = jasmine.createSpyObj("NavController", [
      "navigateBack",
      "navigateForward",
      "navigateRoot",
      "back",
    ]);

    platformMock = {
      ready: jasmine.createSpy("ready").and.returnValue(Promise.resolve()),
      backButton: {
        subscribeWithPriority: jasmine.createSpy("subscribeWithPriority"),
      },
      is: jasmine.createSpy("is").and.returnValue(false),
    };

    locationMock = {
      back: jasmine.createSpy("back"),
    };

    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => "123",
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [ListingDetailPage, TimestampPipe],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore(),
        {provide: Router, useValue: routerSpy},
        {provide: NavController, useValue: navControllerSpy},
        {provide: Platform, useValue: platformMock},
        {provide: Location, useValue: locationMock},
        {provide: AlertController, useValue: alertControllerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<AppState>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertController = TestBed.inject(AlertController);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(ListingDetailPage);
    component = fixture.componentInstance;

    // Override selectors
    store.overrideSelector(selectListingById("123"), mockListing);
    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.overrideSelector(selectLoading, false);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load listing on init", () => {
    spyOn(store, "dispatch");
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.loadListingById({id: "123"}),
    );
  });

  it("should display loading spinner when loading is true", () => {
    store.overrideSelector(selectLoading, true);
    store.refreshState();
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css("ion-spinner"));
    expect(spinner).toBeTruthy();
  });

  // it("should display listing details", (done) => {
  //   component.listing$.subscribe((listing) => {
  //     expect(listing).toEqual(mockListing);
  //     done();
  //   });
  // });

  // it("should determine if user is owner", (done) => {
  //   component.isOwner$.subscribe((isOwner) => {
  //     expect(isOwner).toBeTrue();
  //     done();
  //   });
  // });
});
