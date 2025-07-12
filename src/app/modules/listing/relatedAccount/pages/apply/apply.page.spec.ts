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
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {ApplyPage} from "./apply.page";
import {FormBuilder, ReactiveFormsModule, FormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {AppState} from "../../../../../state/app.state";
import {ActivatedRoute} from "@angular/router";
import {AlertController, IonicModule} from "@ionic/angular";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {selectListingById} from "../../../../../state/selectors/listings.selectors";
import {AuthUser} from "@shared/models/auth-user.model";
import {Listing} from "@shared/models/listing.model";
import {Timestamp} from "firebase/firestore";
import * as ListingsActions from "../../../../../state/actions/listings.actions";

describe("ApplyPage", () => {
  let component: ApplyPage;
  let fixture: ComponentFixture<ApplyPage>;
  let store: MockStore<AppState>;
  let alertController: jasmine.SpyObj<AlertController>;
  let alertElement: any;

  const mockAuthUser: AuthUser = {
    uid: "user123",
    email: "test@example.com",
    name: "John Doe",
    phoneNumber: "1234567890",
    iconImage: "icon.png",
    heroImage: "hero.png",
    displayName: null,
    emailVerified: false,
    tagline: null,
    type: null,
    createdAt: null,
    lastLoginAt: null,
    providerData: [],
  };

  const mockListing: Listing = {
    id: "listing123",
    title: "Test Listing",
    description: "A nice test listing",
    status: "active",
    type: "job",
    organization: "",
    remote: false,
    skills: [],
    timeCommitment: {
      hoursPerWeek: 10,
      duration: "3 months",
      schedule: "Flexible",
      startDate: Timestamp.fromDate(new Date()),
      endDate: Timestamp.fromDate(new Date()),
      isFlexible: true,
    },
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

  beforeEach(async () => {
    alertElement = {present: jasmine.createSpy("present")};
    const routeStub = {
      snapshot: {
        paramMap: {
          get: () => "listing123",
        },
      },
    };

    alertController = jasmine.createSpyObj("AlertController", ["create"]);

    await TestBed.configureTestingModule({
      declarations: [ApplyPage],
      imports: [
        // Import IonicModule, FormsModule, and ReactiveFormsModule
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: ActivatedRoute, useValue: routeStub},
        {provide: AlertController, useValue: alertController},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyPage);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    // Mock selectors
    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.overrideSelector(selectListingById("listing123"), mockListing);

    alertController.create.and.returnValue(Promise.resolve(alertElement));
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should patch form values from authUser on ngOnInit", () => {
    component.ngOnInit();
    expect(component.applyForm.value.firstName).toBe("John");
    expect(component.applyForm.value.lastName).toBe("Doe");
    expect(component.applyForm.value.email).toBe("test@example.com");
    expect(component.applyForm.value.phone).toBe("1234567890");
  });

  it("should show an alert if non-PDF file is selected", fakeAsync(() => {
    const fakeEvent = {
      target: {
        files: [new File(["dummy content"], "dummy.txt", {type: "text/plain"})],
        value: "somepath/dummy.txt",
      },
    } as unknown as Event;

    component.onFileSelect(fakeEvent, "resume");
    tick(); // Resolve promises

    expect(alertController.create).toHaveBeenCalledWith({
      header: "Invalid File",
      message: "Please upload a valid PDF file.",
      buttons: ["OK"],
    });
  }));

  it("should show an alert if the file is larger than 10 MB", fakeAsync(() => {
    const largeFile = new File([""], "large.pdf", {type: "application/pdf"});
    Object.defineProperty(largeFile, "size", {value: 11 * 1024 * 1024}); // 11MB
    const fakeEvent = {
      target: {
        files: [largeFile],
        value: "somepath/large.pdf",
      },
    } as unknown as Event;

    component.onFileSelect(fakeEvent, "resume");
    tick();

    expect(alertController.create).toHaveBeenCalledWith({
      header: "File Too Large",
      message: "File size must not exceed 10 MB.",
      buttons: ["OK"],
    });
  }));

  it("should accept a valid PDF file and set resumeFile", () => {
    const validPdf = new File(["dummy content"], "resume.pdf", {
      type: "application/pdf",
    });
    const fakeEvent = {
      target: {
        files: [validPdf],
        value: "somepath/resume.pdf",
      },
    } as unknown as Event;

    component.onFileSelect(fakeEvent, "resume");
    expect(component.resumeFile).toEqual(validPdf);
    expect(component.resumeFileName).toEqual("resume.pdf");
  });

  it("should format phone number correctly", () => {
    const inputElement = {value: "1234567890"} as HTMLInputElement;
    const event = {target: inputElement};
    component.formatPhoneNumber(event);
    expect(inputElement.value).toBe("(123) 456-7890");
  });

  it("should show alert if form is invalid on submit", fakeAsync(() => {
    component.applyForm.patchValue({firstName: ""}); // Invalid form
    component.onSubmit();
    tick();

    expect(alertController.create).toHaveBeenCalledWith({
      header: "Form Invalid",
      message: "Please fill out all required fields correctly.",
      buttons: ["OK"],
    });
  }));

  it("should show alert if no authUser found on submit", fakeAsync(() => {
    store.overrideSelector(selectAuthUser, null);
    store.refreshState();
    fixture.detectChanges();

    component.applyForm.patchValue({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phone: "(123) 456-7890",
    });

    component.onSubmit();
    tick();

    expect(alertController.create).toHaveBeenCalledWith({
      header: "Error",
      message: "Unable to fetch user information. Please try again.",
      buttons: ["OK"],
    });
  }));

  it("should dispatch submitApplication action on valid form submit", fakeAsync(() => {
    spyOn(store, "dispatch");
    store.overrideSelector(selectAuthUser, mockAuthUser);
    store.refreshState();
    fixture.detectChanges();

    component.applyForm.patchValue({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      phone: "(123) 456-7890",
      notes: "Some note",
    });

    component.onSubmit();
    tick();

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: ListingsActions.submitApplication.type,
      }),
    );

    expect(alertController.create).toHaveBeenCalledWith({
      header: "Application Submitted",
      message: "Your application has been submitted successfully!",
      buttons: ["OK"],
    });
  }));

  it("should call showAlert with correct arguments", fakeAsync(() => {
    component.showAlert("Test Header", "Test Message");
    tick();

    expect(alertController.create).toHaveBeenCalledWith({
      header: "Test Header",
      message: "Test Message",
      buttons: ["OK"],
    });
  }));
});
