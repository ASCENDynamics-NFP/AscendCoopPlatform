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
import {HomepageListingsComponent} from "./homepage-listings.component";
import {ListingsService} from "../../../../core/services/listings.service";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {IonicModule} from "@ionic/angular";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe("HomepageListingsComponent", () => {
  let component: HomepageListingsComponent;
  let fixture: ComponentFixture<HomepageListingsComponent>;
  let listingsService: ListingsService;

  const mockListings = [
    {
      id: "1",
      title: "Volunteer Project Manager",
      description:
        "We need a project manager to spearhead our community outreach...",
      type: "volunteer",
      organization: "Earth Hero",
      remote: false,
      timeCommitment: {
        hoursPerWeek: 40,
        duration: "3 months",
        schedule: "Flexible",
      },
      createdAt: {_seconds: 1729102620, _nanoseconds: 0},
      status: "active",
      iconImage: "assets/icon/logo.png",
    },
    {
      id: "2",
      title: "Community Outreach Coordinator",
      description:
        "Assist in coordinating community events and outreach programs.",
      type: "volunteer",
      organization: "Green Planet",
      remote: true,
      timeCommitment: {
        hoursPerWeek: 20,
        duration: "2 months",
        schedule: "Weekdays",
      },
      createdAt: {_seconds: 1729102620, _nanoseconds: 0},
      status: "active",
      iconImage: "assets/icon/logo.png",
    },
  ];

  beforeEach(async () => {
    const listingsServiceSpy = jasmine.createSpyObj("ListingsService", [
      "getHomepageListings",
    ]);
    listingsServiceSpy.getHomepageListings.and.returnValue(of(mockListings));

    await TestBed.configureTestingModule({
      declarations: [HomepageListingsComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [{provide: ListingsService, useValue: listingsServiceSpy}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageListingsComponent);
    component = fixture.componentInstance;
    listingsService = TestBed.inject(ListingsService);
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  // it("should call getHomepageListings on init", () => {
  //   spyOn(listingsService, "getHomepageListings").and.callThrough();
  //   component.ngOnInit();
  //   expect(listingsService.getHomepageListings).toHaveBeenCalled();
  // });

  // it("should render a list of listings", () => {
  //   const compiled = fixture.nativeElement;
  //   const listingCards = compiled.querySelectorAll(".listing-card");
  //   expect(listingCards.length).toBe(mockListings.length);
  // });

  // it("should display the correct listing title and organization", () => {
  //   const compiled = fixture.nativeElement;
  //   const firstListingTitle =
  //     compiled.querySelector(".listing-card h2").textContent;
  //   const firstListingOrg =
  //     compiled.querySelector(".listing-card p").textContent;

  //   expect(firstListingTitle).toContain(mockListings[0].title);
  //   expect(firstListingOrg).toContain(mockListings[0].organization);
  // });

  // it("should display the correct time commitment details", () => {
  //   const compiled = fixture.nativeElement;
  //   const firstListingDetails = compiled.querySelectorAll(
  //     ".listing-details .detail",
  //   );

  //   expect(firstListingDetails[0].textContent).toContain("Volunteer");
  //   expect(firstListingDetails[1].textContent).toContain("40 hrs/week");
  //   expect(firstListingDetails[2].textContent).toContain("Onsite");
  // });
});
