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
import {ListingFormComponent} from "./listing-form.component";
import {IonicModule} from "@ionic/angular";
import {ReactiveFormsModule, FormBuilder} from "@angular/forms";
import {Store} from "@ngrx/store";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {Timestamp} from "firebase/firestore";

describe("ListingFormComponent", () => {
  let component: ListingFormComponent;
  let fixture: ComponentFixture<ListingFormComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListingFormComponent],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore({
          initialState: {
            auth: {user: {uid: "test-user-id"}},
            accounts: {selectedAccount: null},
          },
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ListingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with default values", () => {
    expect(component.listingForm.get("title")).toBeTruthy();
    expect(component.listingForm.get("description")).toBeTruthy();
    expect(component.listingForm.get("type")).toBeTruthy();
    expect(component.listingForm.get("organization")).toBeTruthy();
  });

  it("should add skill to form array", () => {
    const initialLength = component.getFormArray("skills").length;
    component.addSkill();
    expect(component.getFormArray("skills").length).toBe(initialLength + 1);
  });

  it("should remove skill from form array", () => {
    component.addSkill();
    const initialLength = component.getFormArray("skills").length;
    component.removeArrayItem("skills", 0);
    expect(component.getFormArray("skills").length).toBe(initialLength - 1);
  });

  it("should emit form value on valid submit as active", () => {
    spyOn(component.formSubmit, "emit");
    const mockListing = {
      title: "Test Listing",
      description: "Test Description",
      type: "volunteer",
      organization: "Test Org",
      timeCommitment: {
        hoursPerWeek: 10,
        duration: "3 months",
        schedule: "Flexible",
        startDate: new Date(),
        endDate: new Date(),
        isFlexible: true,
      },
    };

    component.listingForm.patchValue(mockListing);
    component.saveAsActive();

    expect(component.formSubmit.emit).toHaveBeenCalled();
  });

  it("should not emit form value on invalid submit", () => {
    spyOn(component.formSubmit, "emit");
    component.saveAsActive();
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it("should emit form value with draft status", () => {
    const emitSpy = spyOn(component.formSubmit, "emit");
    const mockListing = {
      title: "Test Listing",
      description: "Test Description",
      type: "volunteer",
      organization: "Test Org",
      timeCommitment: {
        hoursPerWeek: 10,
        duration: "3 months",
        schedule: "Flexible",
        startDate: new Date(),
        endDate: new Date(),
        isFlexible: true,
      },
      skills: [],
      requirements: [],
      responsibilities: [],
      benefits: [],
      contactInformation: {
        emails: [],
        phoneNumbers: [],
        addresses: [],
        preferredMethodOfContact: "Email",
      },
    };

    component.listingForm.patchValue(mockListing);
    component.saveAsDraft();

    expect(emitSpy).toHaveBeenCalled();
    const emittedListing = emitSpy.calls.first().args[0];
    expect(emittedListing.status).toBe("draft");
  });

  it("should emit form value with inactive status", () => {
    const emitSpy = spyOn(component.formSubmit, "emit");
    const mockListing = {
      title: "Test Listing",
      description: "Test Description",
      type: "volunteer",
      organization: "Test Org",
      remote: false,
      timeCommitment: {
        hoursPerWeek: 10,
        duration: "3 months",
        schedule: "Flexible",
        startDate: Timestamp.fromDate(new Date()),
        endDate: Timestamp.fromDate(new Date()),
        isFlexible: true,
      },
      skills: [],
      requirements: [],
      responsibilities: [],
      benefits: [],
      contactInformation: {
        emails: [],
        phoneNumbers: [],
        addresses: [],
        preferredMethodOfContact: "Email",
      },
    };

    component.listingForm.patchValue(mockListing);
    fixture.detectChanges();
    component.saveAsInactive();

    expect(emitSpy).toHaveBeenCalled();
    const emittedListing = emitSpy.calls.first().args[0];
    expect(emittedListing.status).toBe("inactive");
  });

  it("should initialize form with listing data when provided", () => {
    const mockListing = {
      id: "123",
      title: "Existing Listing",
      description: "Test Description",
      type: "volunteer",
      organization: "Test Org",
      timeCommitment: {
        hoursPerWeek: 10,
        duration: "3 months",
        schedule: "Flexible",
        startDate: Timestamp.fromDate(new Date()),
        endDate: Timestamp.fromDate(new Date()),
        isFlexible: true,
      },
    };

    component.listing = mockListing as any;
    component.ngOnInit();

    expect(component.listingForm.get("title")?.value).toBe(mockListing.title);
    expect(component.listingForm.get("organization")?.value).toBe(
      mockListing.organization,
    );
  });

  it("should add and remove contact information", () => {
    component.addEmail();
    expect(component.getFormArray("contactInformation.emails").length).toBe(1);

    component.addPhoneNumber();
    expect(
      component.getFormArray("contactInformation.phoneNumbers").length,
    ).toBe(1);

    component.addAddress();
    expect(component.getFormArray("contactInformation.addresses").length).toBe(
      1,
    );

    component.removeArrayItem("contactInformation.emails", 0);
    expect(component.getFormArray("contactInformation.emails").length).toBe(0);
  });
});
