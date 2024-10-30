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
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {ListingFormComponent} from "./listing-form.component";
import {Timestamp} from "firebase/firestore";
import {Listing} from "../../../../models/listing.model";

describe("ListingFormComponent", () => {
  let component: ListingFormComponent;
  let fixture: ComponentFixture<ListingFormComponent>;
  let formBuilder: FormBuilder;

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
    requirements: ["Requirement 1", "Requirement 2"],
    responsibilities: ["Responsibility 1", "Responsibility 2"],
    benefits: ["Benefit 1", "Benefit 2"],
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
    await TestBed.configureTestingModule({
      declarations: [ListingFormComponent],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(ListingFormComponent);
    component = fixture.componentInstance;
    // Initialize form before running tests
    component.ngOnInit();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with empty form", () => {
    expect(component.listingForm.get("title")?.value).toBe("");
    expect(component.listingForm.valid).toBeFalsy();
  });

  // it("should populate form with listing data", () => {
  //   // Set the listing data before initializing arrays
  //   component.listing = mockListing;
  //   // Re-initialize the component with the listing data
  //   component.ngOnInit();
  //   fixture.detectChanges();

  //   // Verify the form was populated correctly
  //   expect(component.listingForm.get("title")?.value).toBe(mockListing.title);
  //   expect(component.listingForm.get("organization")?.value).toBe(
  //     mockListing.organization,
  //   );
  //   expect(component.getFormArray("skills").length).toBeGreaterThan(0);
  // });

  it("should add skill to form array", () => {
    component.addSkill();
    const skillsArray = component.getFormArray("skills");
    expect(skillsArray.length).toBe(1);
  });

  it("should add email to form array", () => {
    component.addEmail();
    const emailsArray = component.getFormArray("contactInformation.emails");
    expect(emailsArray.length).toBe(1);
  });

  it("should add phone number to form array", () => {
    component.addPhoneNumber();
    const phoneArray = component.getFormArray(
      "contactInformation.phoneNumbers",
    );
    expect(phoneArray.length).toBe(1);
  });

  it("should remove array item", () => {
    component.addSkill();
    component.removeArrayItem("skills", 0);
    const skillsArray = component.getFormArray("skills");
    expect(skillsArray.length).toBe(0);
  });

  it("should validate required fields", () => {
    const form = component.listingForm;
    form.patchValue({
      title: "Test Title",
      description: "Test Description",
      type: "volunteer",
      organization: "Test Org",
      timeCommitment: {
        hoursPerWeek: 10,
        duration: "3 months",
        schedule: "Weekly",
        startDate: new Date().toISOString(),
      },
      location: {
        street: "123 Main St",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
        zipcode: "12345",
      },
    });

    expect(form.valid).toBeTruthy();
  });

  it("should emit form data on valid submit", () => {
    spyOn(component.formSubmit, "emit");

    // Set all required form values
    component.listingForm.patchValue({
      title: "Test Title",
      description: "Test Description",
      type: "volunteer",
      organization: "Test Org",
      location: {
        street: "123 Main St",
        city: "Test City",
        state: "Test State",
        country: "Test Country",
        zipcode: "12345",
      },
      timeCommitment: {
        hoursPerWeek: 10,
        duration: "3 months",
        schedule: "Weekly",
        startDate: new Date().toISOString(),
      },
    });
    // Ensure form is valid before submit
    expect(component.listingForm.valid).toBeTruthy();
    component.onSubmit();
    expect(component.formSubmit.emit).toHaveBeenCalled();
  });

  it("should validate date range", () => {
    const timeCommitment = component.listingForm.get("timeCommitment");
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() - 1);

    timeCommitment?.patchValue({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    expect(timeCommitment?.errors?.["dateRange"]).toBeTruthy();
  });
});
