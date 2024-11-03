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
import {IonicModule} from "@ionic/angular";
import {HeroComponent} from "./hero.component";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {Timestamp} from "firebase/firestore";
import {Listing} from "../../../../../../models/listing.model";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe("HeroComponent", () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let store: MockStore;

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
    heroImage: "assets/image/orghero.png",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {listings: {selectedListing: null}},
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display listing hero image", () => {
    component.listing = mockListing;
    fixture.detectChanges();
    const heroImage = fixture.nativeElement.querySelector("img");
    expect(heroImage.src).toContain(mockListing.heroImage);
  });

  it("should display default hero image when no listing image provided", () => {
    component.listing = {...mockListing, heroImage: undefined};
    fixture.detectChanges();
    const heroImage = fixture.nativeElement.querySelector("img");
    expect(heroImage.src).toContain("assets/image/orghero.png");
  });

  it("should show edit button when isOwner is true", () => {
    component.listing = mockListing;
    component.isOwner = true;
    fixture.detectChanges();
    const editButton = fixture.nativeElement.querySelector(".edit-button");
    expect(editButton).toBeTruthy();
  });

  it("should hide edit button when isOwner is false", () => {
    component.listing = mockListing;
    component.isOwner = false;
    fixture.detectChanges();
    const editButton = fixture.nativeElement.querySelector(".edit-button");
    expect(editButton).toBeFalsy();
  });
});
