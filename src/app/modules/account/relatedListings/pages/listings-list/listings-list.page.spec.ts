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
// src/app/pages/account/relatedListings/pages/listings-list.page.spec.ts

// import {ComponentFixture, TestBed} from "@angular/core/testing";
// import {ListingsListPage} from "./listings-list.page";
// import {Store} from "@ngrx/store";
// import {ActivatedRoute, Router} from "@angular/router";
// import {of, BehaviorSubject} from "rxjs";
// import {AuthUser} from "../../../../../models/auth-user.model";
// import {Account} from "../../../../../models/account.model";
// import {RelatedListing} from "../../../../../models/related-listing.model";
// import {provideMockStore, MockStore} from "@ngrx/store/testing";
// import * as AccountSelectors from "../../../../../state/selectors/account.selectors";
// import * as AuthSelectors from "../../../../../state/selectors/auth.selectors";
// import * as AccountActions from "../../../../../state/actions/account.actions";
// import {IonicModule} from "@ionic/angular";
// import {FormsModule} from "@angular/forms";
// import {Timestamp} from "firebase/firestore";

// describe("ListingsListPage", () => {
//   let component: ListingsListPage;
//   let fixture: ComponentFixture<ListingsListPage>;
//   let store: MockStore;
//   let router: Router;
//   let activatedRoute: ActivatedRoute;
//   let dispatchSpy: jasmine.Spy;

//   const initialAuthUser: AuthUser = {
//     uid: "user-1",
//     email: "test@example.com",
//     displayName: "Test User",
//     emailVerified: false,
//     heroImage: null,
//     iconImage: null,
//     tagline: null,
//     type: null,
//     createdAt: null,
//     lastLoginAt: null,
//     providerData: [],
//   };

//   const initialAccount: Account = {
//     id: "account-1",
//     type: "user",
//     name: "Test Account",
//     privacy: "public",
//     tagline: "",
//     description: "",
//     iconImage: "",
//     heroImage: "",
//     legalAgreements: {
//       termsOfService: {
//         accepted: false,
//         datetime: new Timestamp(0, 0),
//         version: "",
//       },
//       privacyPolicy: {
//         accepted: false,
//         datetime: new Timestamp(0, 0),
//         version: "",
//       },
//     },
//     webLinks: [],
//     lastLoginAt: new Timestamp(0, 0),
//     email: "",
//   };

//   const initialRelatedListings: RelatedListing[] = [
//     {
//       id: "listing-1",
//       title: "Listing 1",
//       type: "gig",
//       relationship: "owner",
//       accountId: "account-1",
//       status: "active",
//       remote: false,
//     },
//     {
//       id: "listing-2",
//       title: "Listing 2",
//       type: "volunteer",
//       relationship: "participant",
//       accountId: "account-1",
//       status: "active",
//       remote: true,
//     },
//   ];

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ListingsListPage],
//       imports: [IonicModule.forRoot(), FormsModule],
//       providers: [
//         provideMockStore(),
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             snapshot: {
//               paramMap: {
//                 get: jasmine.createSpy("get").and.returnValue("account-1"),
//               },
//             },
//           },
//         },
//         {
//           provide: Router,
//           useValue: {
//             navigate: jasmine.createSpy("navigate"),
//           },
//         },
//       ],
//     }).compileComponents();

//     store = TestBed.inject(Store) as MockStore;
//     router = TestBed.inject(Router);
//     activatedRoute = TestBed.inject(ActivatedRoute);

//     fixture = TestBed.createComponent(ListingsListPage);
//     component = fixture.componentInstance;

//     dispatchSpy = spyOn(store, "dispatch").and.callThrough();

//     // Mock selectors
//     store.overrideSelector(AuthSelectors.selectAuthUser, initialAuthUser);
//     store.overrideSelector(
//       AccountSelectors.selectAccountById("account-1"),
//       initialAccount,
//     );
//     store.overrideSelector(
//       AccountSelectors.selectRelatedListingsByAccountId("account-1"),
//       initialRelatedListings,
//     );
//   });

//   it("should create the ListingsListPage component", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should get accountId from route parameters", () => {
//     expect(activatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith(
//       "accountId",
//     );
//     expect(component.accountId).toEqual("account-1");
//   });

//   it("should dispatch loadAccount action on ngOnInit", () => {
//     component.ngOnInit();
//     expect(dispatchSpy).toHaveBeenCalledWith(
//       AccountActions.loadAccount({accountId: "account-1"}),
//     );
//   });

//   it("should dispatch loadRelatedListings action on ngOnInit", () => {
//     component.ngOnInit();
//     expect(dispatchSpy).toHaveBeenCalledWith(
//       AccountActions.loadRelatedListings({accountId: "account-1"}),
//     );
//   });

//   it("should set the title based on account type", () => {
//     component.ngOnInit();
//     expect(component.title).toEqual("My Listings");
//   });

//   it("should determine isOwner$ correctly", (done) => {
//     component.ngOnInit();
//     component.isOwner$.subscribe((isOwner) => {
//       expect(isOwner).toBeTrue();
//       done();
//     });
//   });

//   it("should filter related listings based on relationshipFilter$", (done) => {
//     component.ngOnInit();
//     component.relationshipFilter$.next("owner");

//     component.filteredRelatedListings$.subscribe((listings) => {
//       expect(listings.length).toEqual(1);
//       expect(listings[0].relationship).toEqual("owner");
//       done();
//     });
//   });

//   it("should call removeListing and dispatch deleteRelatedListing action", () => {
//     component.ngOnInit();
//     const listingToRemove = initialRelatedListings[0];
//     component.accountId = "account-1";

//     component.removeListing(listingToRemove);

//     expect(dispatchSpy).toHaveBeenCalledWith(
//       AccountActions.deleteRelatedListing({
//         accountId: "account-1",
//         relatedListingId: "listing-1",
//       }),
//     );
//   });

//   it("should navigate to listing details page on goToListing", () => {
//     const listingId = "listing-1";
//     component.goToListing(listingId);
//     expect(router.navigate).toHaveBeenCalledWith([`/listings/${listingId}`]);
//   });

//   it("should handle onRelationshipFilterChange correctly", (done) => {
//     component.ngOnInit();
//     const event = {
//       detail: {
//         value: "participant",
//       },
//     };
//     component.onRelationshipFilterChange(event);

//     component.relationshipFilter$.subscribe((filter) => {
//       expect(filter).toEqual("participant");
//       done();
//     });
//   });

//   it("should track listings by id using trackById", () => {
//     const index = 1;
//     const item = {id: "listing-1"} as RelatedListing;
//     const trackById = component.trackById(index, item);
//     expect(trackById).toEqual("listing-1");
//   });

//   it("should handle account$ subscription correctly", () => {
//     spyOn(component.account$, "pipe").and.callThrough();
//     component.ngOnInit();
//     expect(component.account$.pipe).toHaveBeenCalled();
//   });
// });
