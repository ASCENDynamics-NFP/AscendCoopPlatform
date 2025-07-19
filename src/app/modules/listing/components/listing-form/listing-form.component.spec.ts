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
import {By} from "@angular/platform-browser";
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
    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalled();
  });

  it("should not emit form value on invalid submit", () => {
    spyOn(component.formSubmit, "emit");
    component.onSubmit();
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
    component.onSubmit();

    expect(emitSpy).toHaveBeenCalled();
    const emittedListing = emitSpy.calls.first().args[0];
    expect(emittedListing.status).toBe("draft");
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

  it("should display title validation message when invalid", () => {
    const titleControl = component.listingForm.get("title");
    titleControl?.setValue("");
    titleControl?.markAsTouched();
    fixture.detectChanges();
    const notes = fixture.debugElement.queryAll(By.css("ion-note"));
    const hasError = notes.some((n) =>
      n.nativeElement.textContent.includes("Title is required."),
    );
    expect(hasError).toBeTrue();
  });

  it("should display description validation message when invalid", () => {
    const descControl = component.listingForm.get("description");
    descControl?.setValue("");
    descControl?.markAsTouched();
    fixture.detectChanges();
    const notes = fixture.debugElement.queryAll(By.css("ion-note"));
    const hasError = notes.some((n) =>
      n.nativeElement.textContent.includes("Description is required."),
    );
    expect(hasError).toBeTrue();
  });

  it("should display organization validation message when invalid", () => {
    const orgControl = component.listingForm.get("organization");
    orgControl?.setValue("");
    orgControl?.markAsTouched();
    fixture.detectChanges();
    const notes = fixture.debugElement.queryAll(By.css("ion-note"));
    const hasError = notes.some((n) =>
      n.nativeElement.textContent.includes("Organization is required."),
    );
    expect(hasError).toBeTrue();
  });

  it("should display contact email validation message when invalid", () => {
    component.addEmail();
    fixture.detectChanges();

    const emailGroup = component
      .getFormArray("contactInformation.emails")
      .at(0);

    emailGroup.get("email")?.setValue("");
    // mark all fields in the email form group as touched
    emailGroup.markAllAsTouched();
    fixture.detectChanges();

    const note = fixture.debugElement.query(By.css("[formArrayName='emails'] ion-note span"));
    expect(note.nativeElement.textContent.trim()).toBe("Email is required.");
  });
});
