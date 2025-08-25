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

import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {ListingEditPage} from "./listing-edit.page";
import {IonicModule, NavController, Platform} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {Listing} from "@shared/models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {AppState} from "../../../../state/app.state";
import {AuthUser} from "@shared/models/auth-user.model";
import {selectListingById} from "../../../../state/selectors/listings.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Timestamp} from "firebase/firestore";
import {TranslateTestingModule} from "../../../../shared/testing/translate-testing.module";

describe("ListingEditPage", () => {
  let component: ListingEditPage;
  let fixture: ComponentFixture<ListingEditPage>;
  let store: MockStore<AppState>;
  let router: jasmine.SpyObj<Router>;

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

  const platformMock = {
    ready: jasmine.createSpy().and.returnValue(Promise.resolve()),
    backButton: {
      subscribeWithPriority: jasmine.createSpy("subscribeWithPriority"),
    },
    is: jasmine.createSpy().and.returnValue(false),
  };

  const navControllerMock = jasmine.createSpyObj("NavController", [
    "navigateRoot",
    "navigateForward",
    "navigateBack",
    "back",
  ]);

  const initialListingsState = {
    entities: {
      "123": mockListing, // We want to ensure the listing exists
    },
    relatedAccounts: {},
    selectedListingId: null,
    loading: false,
    error: null,
    filterType: "all",
    searchQuery: "",
    listingsLastUpdated: null,
    relatedAccountsLastUpdated: {},
  };

  const initialState = {
    listings: initialListingsState,
  };

  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      declarations: [ListingEditPage],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore({initialState}), // Pass initialState here
        {provide: Router, useValue: routerSpy},
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
        {provide: Platform, useValue: platformMock},
        {provide: NavController, useValue: navControllerMock},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<AppState>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Override selectors before creating component
    store.overrideSelector(selectListingById("123"), mockListing);
    store.overrideSelector(selectAuthUser, mockAuthUser);

    fixture = TestBed.createComponent(ListingEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadListingById on init if listingId is present", () => {
    spyOn(store, "dispatch");
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.loadListingById({id: "123"}),
    );
  });

  it("should provide the listing data via listing$", (done) => {
    component.listing$.subscribe((listing) => {
      expect(listing).toEqual(mockListing);
      done();
    });
  });

  it("should determine if user is the owner", (done) => {
    component.isOwner$.subscribe((isOwner) => {
      expect(isOwner).toBeTrue();
      done();
    });
  });

  // it("should navigate to /listings if user is not the owner", waitForAsync(() => {
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

  //   fixture.whenStable().then(() => {
  //     expect(router.navigate).toHaveBeenCalledWith(["/listings"]);
  //   });
  // }));

  it("should dispatch updateListing action on submit if listingId is present", () => {
    spyOn(store, "dispatch");
    const updatedListing = {
      ...mockListing,
      title: "Updated Title",
    };
    component.onSubmit(updatedListing);
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.updateListing({listing: updatedListing}),
    );
  });

  it("should not navigate after updating listing unless implemented in component", () => {
    // The component as given does not navigate after updating.
    // This test ensures we do not expect navigation if not implemented.
    // Remove this test or adapt it if navigation logic is added later.
    spyOn(store, "dispatch");
    const updatedListing = {
      ...mockListing,
      title: "Another Update",
    };
    component.onSubmit(updatedListing);
    expect(store.dispatch).toHaveBeenCalled();
    // Ensure no navigation
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
