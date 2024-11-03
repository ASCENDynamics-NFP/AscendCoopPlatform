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
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule, LoadingController, ModalController} from "@ionic/angular";
import {FeedbackModalComponent} from "./feedback-modal.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";
import {FirestoreService} from "../../../core/services/firestore.service";
import {AuthUser} from "../../../models/auth-user.model";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../environments/environment";

describe("FeedbackModalComponent", () => {
  let component: FeedbackModalComponent;
  let fixture: ComponentFixture<FeedbackModalComponent>;
  let mockFirestoreService: Partial<FirestoreService>;
  let mockErrorHandler: Partial<ErrorHandlerService>;
  let mockLoadingController: Partial<LoadingController>;
  let mockModalController: Partial<ModalController>;

  const mockUser: AuthUser = {
    uid: "test-uid",
    email: "test@example.com",
    displayName: "Test User",
    emailVerified: true,
    photoURL: null,
  };

  beforeEach(waitForAsync(() => {
    // Initialize Firebase for testing
    initializeApp(environment.firebaseConfig);

    mockFirestoreService = {
      addDocument: jasmine
        .createSpy("addDocument")
        .and.returnValue(Promise.resolve()),
    };

    mockErrorHandler = {
      handleFirebaseAuthError: jasmine.createSpy("handleFirebaseAuthError"),
    };

    mockLoadingController = {
      create: jasmine.createSpy("create").and.returnValue(
        Promise.resolve({
          present: () => Promise.resolve(),
          dismiss: () => Promise.resolve(),
        }),
      ),
    };

    mockModalController = {
      dismiss: jasmine.createSpy("dismiss").and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      declarations: [FeedbackModalComponent],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        {provide: FirestoreService, useValue: mockFirestoreService},
        {provide: ErrorHandlerService, useValue: mockErrorHandler},
        {provide: LoadingController, useValue: mockLoadingController},
        {provide: ModalController, useValue: mockModalController},
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackModalComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with user data when user is provided", () => {
    expect(component.feedbackForm.get("name")?.value).toBe(
      mockUser.displayName,
    );
    expect(component.feedbackForm.get("email")?.value).toBe(mockUser.email);
  });

  it("should submit feedback when form is valid", async () => {
    component.feedbackForm.patchValue({
      category: "Bug Report",
      feedback: "Test feedback",
      rating: 4,
    });

    await component.submitFeedback();

    expect(mockFirestoreService.addDocument).toHaveBeenCalled();
    expect(mockModalController.dismiss).toHaveBeenCalled();
  });

  it("should close modal on closeModal()", () => {
    component.closeModal();
    expect(mockModalController.dismiss).toHaveBeenCalled();
  });

  it("should handle file upload", async () => {
    const mockFile = new File(["test"], "test.jpg", {type: "image/jpeg"});
    const mockEvent = {target: {files: [mockFile]}};

    await component.onFileChange(mockEvent);

    expect(component.feedbackForm.get("attachment")?.value).toBe(mockFile);
    expect(mockLoadingController.create).toHaveBeenCalled();
  });
});
