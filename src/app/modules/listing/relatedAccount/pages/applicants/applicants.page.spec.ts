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
// import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
// import {ApplicantsPage} from "./applicants.page";
// import {IonicModule, ModalController} from "@ionic/angular";
// import {RouterTestingModule} from "@angular/router/testing";
// import {Store} from "@ngrx/store";
// import {provideMockStore, MockStore} from "@ngrx/store/testing";
// import {AppState} from "../../../../../state/app.state";
// import * as ListingsActions from "../../../../../state/actions/listings.actions";
// import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
// import {
//   selectListingById,
//   selectRelatedAccountsByListingId,
// } from "../../../../../state/selectors/listings.selectors";
// import {ActivatedRoute, Router} from "@angular/router";
// import {AuthUser} from "@shared/models/auth-user.model";
// import {Listing} from "@shared/models/listing.model";
// import {ListingRelatedAccount} from "@shared/models/listing-related-account.model";
// import {of} from "rxjs";
// import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
// import {ApplicantDetailsModalComponent} from "./components/applicant-details-modal/applicant-details-modal.component";
// import {Timestamp} from "firebase/firestore";

// // Create selectors for loading and error to avoid inline arrows
// import {createSelector} from "@ngrx/store";

// export const selectListingsState = (state: AppState) => state.listings;
// export const selectListingsLoading = createSelector(
//   selectListingsState,
//   (state) => state.loading,
// );
// export const selectListingsError = createSelector(
//   selectListingsState,
//   (state) => state.error,
// );

// describe("ApplicantsPage", () => {
//   let component: ApplicantsPage;
//   let fixture: ComponentFixture<ApplicantsPage>;
//   let store: MockStore<AppState>;
//   let router: Router;
//   let modalController: jasmine.SpyObj<ModalController>;

//   const mockListingId = "listing123";
//   const mockListing: Listing = {
//     id: mockListingId,
//     title: "Test Listing",
//     description: "Test Description",
//     type: "job",
//     organization: "Test Org",
//     remote: false,
//     contactInformation: {
//       emails: [{name: "John Doe", email: "john@example.com"}],
//       phoneNumbers: [],
//       addresses: [],
//       preferredMethodOfContact: "Email",
//     },
//     timeCommitment: {
//       hoursPerWeek: 10,
//       duration: "3 months",
//       schedule: "Flexible",
//       startDate: Timestamp.fromDate(new Date()),
//       endDate: Timestamp.fromDate(new Date()),
//       isFlexible: true,
//     },
//     skills: [],
//     requirements: [],
//     responsibilities: [],
//     benefits: [],
//     status: "active",
//     createdBy: "user-123",
//   };

//   const mockAuthUser: AuthUser = {
//     uid: "user-123",
//     email: "user@example.com",
//     displayName: "Owner User",
//     iconImage: null,
//     emailVerified: true,
//     heroImage: null,
//     tagline: null,
//     type: "user",
//     createdAt: new Date(),
//     lastLoginAt: new Date(),
//     phoneNumber: null,
//     providerData: [],
//     settings: {language: "en", theme: "light"},
//   };

//   // Include required fields for ListingRelatedAccount
//   const mockAccounts: ListingRelatedAccount[] = Array.from(
//     {length: 35},
//     (_, i) => ({
//       id: `account${i}`,
//       listingId: mockListingId,
//       firstName: `FirstName${i}`,
//       lastName: `LastName${i}`,
//       email: `user${i}@example.com`,
//       phone: "1234567890",
//       notes: "",
//       resumeFile: null,
//       coverLetterFile: null,
//       accountId: `user-${i}`,
//       name: `User ${i}`,
//       iconImage: "",
//       heroImage: "",
//       type: "application",
//       status: "applied",
//       applicationDate: Timestamp.fromDate(new Date()), // Added required field
//     }),
//   );

//   const routeStub = {
//     snapshot: {
//       paramMap: {
//         get: () => mockListingId,
//       },
//     },
//   };

//   const initialListingsState = {
//     entities: {[mockListingId]: mockListing}, // Add the mock listing here
//     relatedAccounts: {[mockListingId]: mockAccounts}, // Add your mock accounts here
//     selectedListingId: null,
//     loading: false,
//     error: null,
//     filterType: "all",
//     searchQuery: "",
//     listingsLastUpdated: null,
//     relatedAccountsLastUpdated: {},
//   };

//   const initialState: Partial<AppState> = {
//     listings: initialListingsState,
//     // ... If you have other state slices, include them here
//   } as Partial<AppState>;

//   beforeEach(waitForAsync(() => {
//     const modalControllerSpy = jasmine.createSpyObj("ModalController", [
//       "create",
//     ]);
//     const routerStub = {
//       navigate: jasmine.createSpy("navigate"),
//     };

//     TestBed.configureTestingModule({
//       declarations: [ApplicantsPage],
//       imports: [IonicModule.forRoot(), RouterTestingModule],
//       providers: [
//         provideMockStore({initialState}), // Pass your initialState here
//         {provide: ActivatedRoute, useValue: routeStub},
//         {provide: ModalController, useValue: modalControllerSpy},
//         {provide: Router, useValue: routerStub},
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     }).compileComponents();

//     store = TestBed.inject(Store) as MockStore<AppState>;
//     modalController = TestBed.inject(
//       ModalController,
//     ) as jasmine.SpyObj<ModalController>;
//     router = TestBed.inject(Router);

//     // Mock selectors
//     store.overrideSelector(selectListingById(mockListingId), mockListing);
//     store.overrideSelector(selectAuthUser, mockAuthUser);
//     store.overrideSelector(
//       selectRelatedAccountsByListingId(mockListingId),
//       mockAccounts,
//     );

//     // Mock loading & error using defined selectors (not inline functions)
//     store.overrideSelector(selectListingsLoading, false);
//     store.overrideSelector(selectListingsError, null);

//     fixture = TestBed.createComponent(ApplicantsPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }));

//   it("should create the component", () => {
//     expect(component).toBeTruthy();
//   });

// it("should dispatch loadListingRelatedAccounts on init", () => {
//   spyOn(store, "dispatch");
//   component.ngOnInit();
//   expect(store.dispatch).toHaveBeenCalledWith(
//     ListingsActions.loadListingRelatedAccounts({listingId: mockListingId}),
//   );
// });

// it("should calculate total items and pages correctly", (done) => {
//   component.totalItems$.subscribe((total) => {
//     expect(total).toBe(35);
//   });

//   component.totalPages$.subscribe((pages) => {
//     // With 35 items and pageSize=20, we get 2 pages total
//     expect(pages).toBe(2);
//     done();
//   });
// });

// it("should paginate accounts correctly (first page)", (done) => {
//   component.paginatedAccounts$.subscribe((accounts) => {
//     expect(accounts.length).toBe(20); // First page: 20 items
//     done();
//   });
// });

// it("should go to next page and show remaining items (second page)", (done) => {
//   component.nextPage();
//   component.paginatedAccounts$.subscribe((accounts) => {
//     // On second page, 35 total - 20 = 15 items left
//     if (component["currentPageSubject"].value === 2) {
//       expect(accounts.length).toBe(15);
//       done();
//     }
//   });
// });

// it("should open applicant details modal if user is owner", waitForAsync(() => {
//   const selectedAccount = mockAccounts[0];
//   const modalSpy = jasmine.createSpyObj("HTMLIonModalElement", ["present"]);
//   modalController.create.and.returnValue(Promise.resolve(modalSpy));

//   component.openApplicantDetailsModal(selectedAccount);
//   // Wait for ownership check
//   fixture.whenStable().then(() => {
//     expect(modalController.create).toHaveBeenCalledWith({
//       component: ApplicantDetailsModalComponent,
//       componentProps: {relatedAccount: selectedAccount},
//     });
//   });
// }));

// it("should navigate to account page if user is not owner", (done) => {
//   // Override auth user to simulate non-owner
//   store.overrideSelector(selectAuthUser, {
//     ...mockAuthUser,
//     uid: "some-other-user",
//   });
//   store.refreshState();
//   fixture.detectChanges();

//   const selectedAccount = mockAccounts[0];
//   component.openApplicantDetailsModal(selectedAccount);

//   component.isOwner$.subscribe((isOwner) => {
//     if (!isOwner) {
//       expect(router.navigate).toHaveBeenCalledWith([
//         "/account",
//         selectedAccount.accountId,
//       ]);
//       done();
//     }
//   });
// });

// it("should update currentPage when goToPage is called", () => {
//   component.goToPage(2);
//   expect(component["currentPageSubject"].value).toBe(2);
// });

// it("should update currentPage when nextPage and previousPage are called", () => {
//   component.goToPage(1);
//   component.nextPage();
//   expect(component["currentPageSubject"].value).toBe(2);

//   component.previousPage();
//   expect(component["currentPageSubject"].value).toBe(1);
// });
// });
