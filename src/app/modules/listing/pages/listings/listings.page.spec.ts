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
import {ListingsPage} from "./listings.page";
import {IonicModule, NavController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {of} from "rxjs";
import {Listing} from "../../../../models/listing.model";
import * as ListingActions from "../../../../state/actions/listings.actions";
import {Timestamp} from "firebase/firestore";

describe("ListingsPage", () => {
  let component: ListingsPage;
  let fixture: ComponentFixture<ListingsPage>;
  let store: jasmine.SpyObj<Store>;
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
    const storeSpy = jasmine.createSpyObj("Store", ["dispatch", "select"]);
    const navCtrlSpy = jasmine.createSpyObj("NavController", [
      "navigateForward",
    ]);

    storeSpy.select.and.returnValue(of(mockListings));

    await TestBed.configureTestingModule({
      declarations: [ListingsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: Store, useValue: storeSpy},
        {provide: NavController, useValue: navCtrlSpy},
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    navCtrl = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
    fixture = TestBed.createComponent(ListingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load listings on init", () => {
    expect(store.dispatch).toHaveBeenCalledWith(ListingActions.loadListings());
  });

  it("should display listings from store", () => {
    component.listings$.subscribe((listings) => {
      expect(listings).toEqual(mockListings);
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
    const event = {detail: {value: "volunteer"}};
    component.filterListings(event);
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingActions.filterListings({listingType: "volunteer"}),
    );
  });

  it("should search listings", () => {
    const event = {detail: {value: "test"}};
    component.searchListings(event);
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingActions.searchListings({query: "test"}),
    );
  });
});
