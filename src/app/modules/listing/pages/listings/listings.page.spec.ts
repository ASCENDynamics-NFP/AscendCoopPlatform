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
// src/app/modules/listing/pages/listings/listings.page.spec.ts

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {ListingsPage} from "./listings.page";
import {IonicModule, NavController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {Listing} from "@shared/models/listing.model";
import * as ListingsActions from "../../../../state/actions/listings.actions";
import {Timestamp} from "firebase/firestore";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {
  selectFilteredListings,
  selectLoading,
  selectError,
} from "../../../../state/selectors/listings.selectors";
import {AppState} from "../../../../state/app.state";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("ListingsPage", () => {
  let component: ListingsPage;
  let fixture: ComponentFixture<ListingsPage>;
  let store: MockStore<AppState>;
  let navCtrl: jasmine.SpyObj<NavController>;

  const mockListings: Listing[] = [
    {
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
    },
  ];

  beforeEach(async () => {
    const navCtrlSpy = jasmine.createSpyObj("NavController", [
      "navigateForward",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ListingsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore(),
        {provide: NavController, useValue: navCtrlSpy},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<AppState>;
    navCtrl = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
    fixture = TestBed.createComponent(ListingsPage);
    component = fixture.componentInstance;

    store.overrideSelector(selectFilteredListings, mockListings);
    store.overrideSelector(selectLoading, false);
    store.overrideSelector(selectError, null);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load listings on init", () => {
    spyOn(store, "dispatch");
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(ListingsActions.loadListings());
  });

  it("should display listings from store", (done) => {
    component.listings$.subscribe((listings) => {
      expect(listings).toEqual(mockListings);
      done();
    });
  });

  it("should navigate to create listing page", () => {
    component.createListing();
    expect(navCtrl.navigateForward).toHaveBeenCalledWith("/listings/create");
  });

  it("should navigate to listing detail page", () => {
    component.viewListing("123");
    expect(navCtrl.navigateForward).toHaveBeenCalledWith("/listings/123");
  });

  it("should filter listings by listingType", () => {
    spyOn(store, "dispatch");
    const event = {detail: {value: "volunteer"}};
    component.filterListings(event);
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.filterListings({listingType: "volunteer"}),
    );
  });

  it("should search listings after debounce", fakeAsync(() => {
    spyOn(store, "dispatch");
    const event = {detail: {value: "test"}};
    component.searchListings(event);
    tick(300);
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.searchListings({query: "test"}),
    );
  }));

  it("should debounce rapid search inputs", fakeAsync(() => {
    spyOn(store, "dispatch");

    component.searchListings({detail: {value: "t"}});
    tick(100);
    component.searchListings({detail: {value: "te"}});
    tick(100);
    component.searchListings({detail: {value: "tes"}});
    tick(100);
    component.searchListings({detail: {value: "test"}});

    tick(300);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingsActions.searchListings({query: "test"}),
    );
  }));
});
