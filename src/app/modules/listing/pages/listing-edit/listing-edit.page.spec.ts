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
import {ListingEditPage} from "./listing-edit.page";
import {IonicModule, NavController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {BehaviorSubject, of} from "rxjs";
import {Listing} from "../../../../models/listing.model";
import * as ListingActions from "../../../../state/actions/listings.actions";
import {Timestamp} from "firebase/firestore";

describe("ListingEditPage", () => {
  let component: ListingEditPage;
  let fixture: ComponentFixture<ListingEditPage>;
  let store: jasmine.SpyObj<Store>;
  let router: jasmine.SpyObj<Router>;

  const mockListing: Listing = {
    id: "123",
    title: "Test Listing",
    description: "Test Description",
    type: "volunteer",
    organization: "Test Org",
    location: {
      street: "123 Test St",
      city: "Test City",
      state: "Test State",
      country: "Test Country",
      zipcode: "12345",
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
      preferredMethodOfContact: "Email",
    },
    remote: false,
  };

  beforeEach(async () => {
    const navCtrlMock = {
      navigateForward: jasmine.createSpy("navigateForward"),
      navigateRoot: jasmine.createSpy("navigateRoot"),
      // Add a mock for the missing subscribe functionality
      subscribe: new BehaviorSubject(null),
    };
    const storeSpy = jasmine.createSpyObj("Store", ["dispatch", "select"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    storeSpy.select.and.returnValue(of(mockListing));

    await TestBed.configureTestingModule({
      declarations: [ListingEditPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: Store, useValue: storeSpy},
        {provide: Router, useValue: routerSpy},
        {provide: NavController, useValue: navCtrlMock},
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
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ListingEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load listing on init", () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingActions.loadListingById({id: "123"}),
    );
  });

  it("should update listing on form submit", () => {
    const updatedListing = {...mockListing, title: "Updated Title"};
    component.onSubmit(updatedListing);
    expect(store.dispatch).toHaveBeenCalledWith(
      ListingActions.updateListing({listing: updatedListing}),
    );
    expect(router.navigate).toHaveBeenCalledWith(["/listings", "123"]);
  });
});
