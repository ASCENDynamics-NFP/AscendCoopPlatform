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
// src/app/modules/listings/pages/listing-edit/listing-edit.page.spec.ts

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {ListingEditPage} from "./listing-edit.page";
import {IonicModule, NavController, Platform} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {Listing} from "../../../../models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {AppState} from "../../../../state/app.state";
import {AuthUser} from "../../../../models/auth-user.model";
import {selectListingById} from "../../../../state/selectors/listings.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Location} from "@angular/common";
import {Timestamp} from "firebase/firestore";

describe("ListingEditPage", () => {
  let component: ListingEditPage;
  let fixture: ComponentFixture<ListingEditPage>;
  let store: MockStore<AppState>;
  let router: jasmine.SpyObj<Router>;
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
          countryCode: "+1",
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
    createdBy: "user-123",
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

    await TestBed.configureTestingModule({
      declarations: [ListingEditPage],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore(),
        {provide: Router, useValue: routerSpy},
        {provide: NavController, useValue: navControllerSpy},
        {provide: Platform, useValue: platformMock},
        {provide: Location, useValue: locationMock},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "123",
              },
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<AppState>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ListingEditPage);
    component = fixture.componentInstance;

    // Override selectors
    store.overrideSelector(selectListingById("123"), mockListing);
    store.overrideSelector(selectAuthUser, mockAuthUser);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadListingById on init", () => {
    spyOn(store, "dispatch");
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.loadListingById({id: "123"}),
    );
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

  // it("should navigate to listings page if user is not owner", fakeAsync(() => {
  //   // Override selectors to simulate user not being the owner
  //   store.overrideSelector(selectListingById("123"), {
  //     ...mockListing,
  //     createdBy: "other-user",
  //   });
  //   store.overrideSelector(selectAuthUser, {
  //     ...mockAuthUser,
  //     uid: "another-user",
  //   });
  //   store.refreshState();
  //   fixture.detectChanges();
  //   tick();
  //   expect(router.navigate).toHaveBeenCalledWith(["/listings"]);
  // }));

  it("should update listing on form submit", () => {
    spyOn(store, "dispatch");
    const updatedListing = {
      ...mockListing,
      title: "Updated Title",
      lastModifiedBy: "user-123",
    };
    component.onSubmit(updatedListing);
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.updateListing({listing: updatedListing}),
    );
    expect(router.navigate).toHaveBeenCalledWith(["/listings", "123"]);
  });
});
