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
import {ListingCreatePage} from "./listing-create.page";
import {IonicModule, NavController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import * as ListingActions from "../../../../state/actions/listings.actions";
import {Listing} from "../../../../models/listing.model";
import {Timestamp} from "firebase/firestore";
import {BehaviorSubject} from "rxjs";

describe("ListingCreatePage", () => {
  let component: ListingCreatePage;
  let fixture: ComponentFixture<ListingCreatePage>;
  let store: jasmine.SpyObj<Store>;
  let router: jasmine.SpyObj<Router>;

  const navCtrlMock = {
    navigateForward: jasmine.createSpy("navigateForward"),
    navigateRoot: jasmine.createSpy("navigateRoot"),
    subscribe: new BehaviorSubject(null),
  };

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj("Store", ["dispatch"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [ListingCreatePage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: Store, useValue: storeSpy},
        {provide: Router, useValue: routerSpy},
        {provide: NavController, useValue: navCtrlMock},
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ListingCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch create listing action on form submit", () => {
    const mockFormValue: Listing = {
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
    component.onSubmit(mockFormValue);

    expect(store.dispatch).toHaveBeenCalledWith(
      ListingActions.createListing({listing: mockFormValue}),
    );
  });

  it("should navigate to listings page after form submission", () => {
    const mockFormValue = {
      title: "Test Listing",
      description: "Test Description",
    };

    component.onSubmit(mockFormValue);

    expect(router.navigate).toHaveBeenCalledWith(["/listings"]);
  });
});
